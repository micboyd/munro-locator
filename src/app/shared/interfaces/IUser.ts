import { CompletedMunro } from "../models/CompletedMunro";
import { IBaseUser } from "./IBaseUser";

export interface IUser extends IBaseUser {
    fullName: string;
    profileImage: string;
    bio: string;
    completedMunros: CompletedMunro[]
}
