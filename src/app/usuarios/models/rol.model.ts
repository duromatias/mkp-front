import { AccesoInterface } from "src/app/auth/models/acceso.model";

export const enum ROLES {
    ADMINISTRADOR = 1,
    USUARIO_AGENCIA = 2,
    USUARIO_PARTICULAR = 3,
    USUARIO_SIN_LOGIN = 4,
};

export interface RolInterface {
    id: number;
    descripcion: string;

    accesos?: AccesoInterface[];
}