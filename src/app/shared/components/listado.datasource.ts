import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ListadoDataSource<T> extends DataSource<T> {

    public data: Subject<T[]>;
    public limit: number = 10;
    public pageIndex: number = 0;
    public total: number = 0;
    public uri: string = "";
    public filtros: any = {}
    public fixedFilters: any = {};
    protected defaultFilters: any = {};
    public ordenes: any = {};
    public queryParams: any = {};
    public afterFetch: EventEmitter<any> = new EventEmitter<any>();
    public autoStart: boolean = true;
    protected client: ApiService;
    public currentData: T[] = [];


    constructor(client: ApiService) {
        super();
        this.client = client;
        this.data = new Subject<T[]>();
    }

    /**
     * Connect this data source to the table. The table will only update when
     * the returned stream emits new items.
     * @returns A stream of the items to be rendered.
     */
    public connect(): Observable<T[]> {
        if (this.autoStart) {
            this.refreshData();
        }
        return this.data.asObservable();
    }

    /**
     *  Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    public disconnect() { }

    public setPageIndex(pageIndex: number, pageSize: number) {
        this.pageIndex = pageIndex;
        this.limit = pageSize;
        this.refreshData();
    }

    public setDefaultFilters(values: any) {
        this.defaultFilters = values;
        Object.assign(this.filtros, this.defaultFilters);
    }

    public refreshData(pageIndex: number | null = null): Promise<any> {
        let params: any = {};
        if (pageIndex !== null) {
            this.pageIndex = pageIndex;
        }
        params.page = (pageIndex !== null ? pageIndex : this.pageIndex) + 1;
        params.limit = this.limit;
        params.filtros = {};
        params.ordenes = {};

        Object.assign(params.filtros, this.defaultFilters);
        Object.assign(params.filtros, this.filtros);
        Object.assign(params.filtros, this.fixedFilters);
        Object.assign(params.ordenes, this.ordenes);
        Object.assign(params, this.queryParams);

        for (let key in params.filtros) {
            let value = params.filtros[key];
            if (value === null || value === '') {
                delete params.filtros[key];
            }
        }

        return this.client.get(this.uri, params).pipe(map((result: any) => {
            this.total = (result?.meta?.total) || 0;
            this.data.next(result.data);

            this.currentData = result.data;

            return result;
        })).toPromise();
    }

    public clearFilters() {
        for (let key in this.filtros) {
            if (this.filtros[key]) {
                this.filtros[key] = null;
            }
        }
        Object.assign(this.filtros, this.defaultFilters);
        this.refreshData();
    }

    public canClearFilters(): boolean {
        for (let key in this.filtros) {
            if (this.filtros[key]) {
                return true;
            }
        }
        return false;
    }
}

