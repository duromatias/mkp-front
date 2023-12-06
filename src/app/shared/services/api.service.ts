import { stringify         } from 'qs';
import { Injectable, NgModule        } from '@angular/core';
import { HttpClient        } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { environment       } from 'src/environments/environment';
import { catchError, map   } from 'rxjs/operators';
import { Observable        } from 'rxjs/internal/Observable';
import { throwError        } from 'rxjs';
import { MessagesService   } from './messages.service';
import { Router            } from '@angular/router';
import { SnackBarService   } from './snack-bar.service';
import { QsSerializer      } from '../qs.serializer';

@Injectable()
@NgModule()
export class ApiService {

    public mostrarMensajes : boolean = true;

    constructor(
        private http     : HttpClient,
        private messages : MessagesService,
        private snackBar : SnackBarService,
        private router   : Router,
    ) {
    }

    public login(xGooToken: string) {
        const options = this.observeResponse();
        return this.http.post(environment.apiEndpoint + '/auth:login', {}, {
            headers: { 'X-go-token': xGooToken }
        }).pipe(catchError((e: HttpErrorResponse)=> {
            if(this.mostrarMensajes){
                this.messages.show(e.error.message);
            }
            return throwError(e);
        }));
    }

    public logout() {
        const options = this.observeResponse();

        return this.http.post(environment.apiEndpoint + '/auth:logout', {}, options);
    }

    observeResponse(options?: any) {
        return {
            observe: 'response',
            ...options
        }
    }

    public get(uri: string, params: any = {}): Observable<any> {
        let url = environment.apiEndpoint + uri;
        let strParams = stringify(params);
        if (strParams) {
            url += '?' + strParams;
        }

        return this.handle(this.http.get(url, {
            observe: 'body',
        }));
    }

    public getData(uri: string, params: any = {}) {
        return this.get(uri, params).pipe(map((result:any)=>result.data)).toPromise();
    }

    public getAll(uri: string, params: any = {}): Promise<any> {
        params['limit'] = 0;
        return this.get(uri, params).toPromise();
    }

    public getAllData(uri: string, params: any = {}): Promise<any> {
        params['limit'] = 0;
        return this.getData(uri, params);
    }

    public post(uri: string, body: any, options?: any): Promise<any> {
        return this.handle(
            this.http.post(
                environment.apiEndpoint + uri,
                this.getEncodedBody(body),
                options
            )
        ).toPromise();
    }

    public put(uri: string, body: any, options?: any): Promise<any> {
        return this.handle(
            this.http.put(
                environment.apiEndpoint + uri,
                this.getEncodedBody(body),
                options
            )
        ).toPromise();
    }

    public patch(uri: string, body:any, options?:any) {
        return this.handle(
            this.http.patch(
                environment.apiEndpoint + uri,
                this.getEncodedBody(body),
                options
            )
        )
    }

    public delete(uri: string): Promise<any> {
        return this.handle(this.http.delete(environment.apiEndpoint + uri)).toPromise();
    }

    private getEncodedBody(data: any): any {
        return (new QsSerializer)
            .serialize(data)
            .filter(v => v.value instanceof File)
            .length > 0 ?
                this.getEncodedBodyWithFile(data) :
                data;
    }

    private getEncodedBodyWithFile(data: any): FormData {
        let body = new FormData();
        (new QsSerializer).serialize(data).forEach(item => {
            body.append(item.name, item.value);
        });

        return body;
    }

    private handle(o: Observable<any>): Observable<ArrayBuffer> {
        return o.pipe(catchError((e: HttpErrorResponse)=> {
            if (e.status === 422 && this.mostrarMensajes){
                this.snackBar.show(e.error.message);
            }
            if (e.status === 401) {
                this.router.navigateByUrl('/auth/login');
                window.scroll(0,0);   
            }
            if (e.status === 403 && this.mostrarMensajes){
                this.snackBar.show(e.error.message||e.error.error);
            }
            return throwError(e);
        }));
    }

}
