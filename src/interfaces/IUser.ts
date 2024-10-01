export interface ICredential {
    username: string;
    password: string;
}

export interface IUser {
    email: string;
    exp: number;
    expired: string | number;
    ispersistent: string | number;
    iat: number;
    iss: string;
    nameid: string;
    nbf?: number;
    unique_name: string;
    lastName:string;
    name:string,
    preferred_username:string,
}

export interface IUserFilter {
    user_id: string;
    status: string;
    stanag: string;
    country: string;
    udsGroup: string;
    shcGroup: string;
    missionGroup: string;
    license_expiration_date_start: string;
    license_expiration_date_end: string;
    creation_date_start: string;
    creation_date_end: string;
    user_rules: string;
    sort_by:string;
    sort:string,
    limit:string,
    offset:string
}
export interface IUserFilterView {
    
    stanag: string[] | string;
   
}