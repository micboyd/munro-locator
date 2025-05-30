import { CompletedMunro } from '../models/CompletedMunro';
import { IBaseUser } from './IBaseUser';

export interface IUser extends IBaseUser {
	userLoading: boolean;
	profileImage: string;
	bio: string;
	completedMunros: CompletedMunro[];
}

