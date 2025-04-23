import { IBaseUser } from "./IBaseUser";

export interface IAuthUser extends IBaseUser {
    password: string;
}
