import { IBaseUser } from "./IBaseUser";

export interface IUser extends IBaseUser {
    profileImage: string;
    role?: string;
}
