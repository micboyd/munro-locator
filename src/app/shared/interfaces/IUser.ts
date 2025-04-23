import { CompletedMunro } from '../models/CompletedMunro';
import { IBaseUser } from './IBaseUser';

export interface IUser extends IBaseUser {
	userLoading: boolean;
	fullName: string;
	profileImage: string;
	bio: string;
	completedMunros: CompletedMunro[];
}

