import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CompletedMunro } from '../../../shared/models/CompletedMunro';
import { Munro } from '../../../shared/models/Munro';
import { MunroService } from '../../../shared/services/munros.service';
import { UserService } from '../../../shared/services/user.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-munro',
	templateUrl: './munro.component.html',
	standalone: false,
})
export class MunroComponent implements OnInit {
	munroId: string | null = null;

	private _completedMunroLoading: boolean = true;
	private _selectedMunro: Munro;
	private _completedMunro: CompletedMunro;
    isEditing = false;

	constructor(private userService: UserService, private munroService: MunroService, private route: ActivatedRoute) {}

	faChevronLeft = faChevronLeft;

	get completedMunroLoading(): boolean {
		return this._completedMunroLoading;
	}

	get selectedMunro(): Munro {
		return this._selectedMunro;
	}

	get completedMunro(): CompletedMunro {
		return this._completedMunro;
	}

	ngOnInit() {
		this._completedMunroLoading = true;
		this.munroId = this.route.snapshot.paramMap.get('id');
		this._selectedMunro = this.munroService.allMunros.find(item => item._id === this.munroId);

		this.munroService
			.getUserCompletedMunroSingle(this.userService.userId, this.munroId)
			.subscribe({
				next: completedMunro => {
                    this._completedMunro = completedMunro;
                    this._completedMunroLoading = false;
				},
				error: () => {
					this._completedMunro = null;
                    this._completedMunroLoading = false;
				},
			});
	}

    munroData = {
      dateCompleted: new Date('2025-04-20'),
      notes: 'Amazing views at the summit. Weather cleared just in time.',
      rating: 4,
      summitImage: 'https://via.placeholder.com/400x200?text=Summit+Photo'
    };

    editedData = { ...this.munroData };

    startEdit() {
      this.editedData = { ...this.munroData };
      this.isEditing = true;
    }

    cancelEdit() {
      this.isEditing = false;
    }

    saveEdit() {
      this.munroData = { ...this.editedData };
      this.isEditing = false;
    }
}

