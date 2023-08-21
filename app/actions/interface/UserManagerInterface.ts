export interface UserDataOutputInterface {
    id: number;
    name: string;
    email: string;
}

export interface UserInsertActionParamsInterface {
    permissionId: string;
}

export interface UserInsertActionDataInterface {
    name: string;
    email: string;
}