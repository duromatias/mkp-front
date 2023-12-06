import { MatPaginatorIntl } from "@angular/material/paginator";

export function CustomPaginator() {
    const customPaginatorIntl = new MatPaginatorIntl();
    customPaginatorIntl.itemsPerPageLabel = 'Ítems por página:';
    customPaginatorIntl.nextPageLabel = "Siguiente";
    customPaginatorIntl.previousPageLabel = "Anterior";
    customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        let numeroRegistrosSuperior : string = "";
        if(((page*pageSize)+pageSize) > length) {
            numeroRegistrosSuperior = length.toString();
        }
        else{
            numeroRegistrosSuperior = ((page*pageSize)+pageSize).toString();
        }

        return `${(page*pageSize)+1} – ${numeroRegistrosSuperior} de ${length}`;
    };
    return customPaginatorIntl;
}