import { RolInterface } from "./rol.model";

export interface UsuarioInterface {
    calle             : string | null;
    codigo_postal     : string | null;
    direccion         : string | null;
    direccionCompleta : string | null;
    dni               : string | null;
    email             : string;
    id                : number;
    latitud           : string | null;
    localidad         : string | null;
    longitud          : string | null;
    nombre            : string;
    apellido          : string | null;
    numero            : string | null;
    provincia         : string | null;
    telefono          : string | null;
    telefonoContacto  : string;
    estado_civil_id   : string | null;
    sexo              : string | null;
    uso_vehiculo      : string | null;
    
    
    rol_id: number;
    rol?: RolInterface;

    onboarding_user:{
        user_personal_data : {
            first_name: string,
            last_name: string,
        },
        business: any
    };
}