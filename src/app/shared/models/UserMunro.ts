import { CompletedMunro } from './CompletedMunro';
import { Munro } from './Munro';

export class UserMunro extends Munro {
	completed: boolean;
	completedDetails: CompletedMunro | null;

	constructor(munro: Munro, completed: boolean, completedDetails: CompletedMunro | null) {
		super(munro);
		this.completed = completed;
		this.completedDetails = completedDetails;
	}
}

