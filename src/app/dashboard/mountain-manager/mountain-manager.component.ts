import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Munro } from '../../shared/models/Munro';
import { MunroService } from '../../shared/services/munros.service';
import { UserService } from '../../shared/services/user.service';
import { combineLatest } from 'rxjs';

@Component({
	selector: 'app-mountain-manager',
	templateUrl: './mountain-manager.component.html',
	standalone: false,
})
export class MountainManagerComponent implements OnInit {
	constructor(private munroService: MunroService, private userService: UserService, private http: HttpClient) {}

	munrosLoading: boolean = false;
	activeTab = 0;

	private _allMunros: Array<Munro> = [];
	private _completedMunros: Array<Munro> = [];
	private _uncompletedMunros: Array<Munro> = [];

	tabs = [];

	ngOnInit() {
		this.munrosLoading = true;

		combineLatest([
			this.munroService.getMunros(),
			this.munroService.getUserCompletedMunros(this.userService.userId),
		]).subscribe(([allMunros, completedMunroIds]) => {
			const completedIds = Array.isArray(completedMunroIds) ? completedMunroIds : [];

			this._allMunros = allMunros.map((munroData: Munro) => {
				const munro = new Munro(munroData);
				if (completedIds.includes(munro._id)) {
					munro.completed = true;
				}
				return munro;
			});

			this.syncMunroLists();
			this.updateTabs();
			this.munrosLoading = false;
		});
	}

	updateTabs() {
		this.tabs = [
			{ label: 'All', count: () => this._allMunros.length },
			{ label: 'Complete', count: () => this._completedMunros.length },
			{ label: 'Incomplete', count: () => this._uncompletedMunros.length },
		];
	}

	munroCompletedUpdated(munro: Munro, completed: boolean) {
		this.munroService.updateCompletedMunros();
		munro.completed = completed;

		this.syncMunroLists();
		this._allMunros = [...this._allMunros];
		this.updatedUserCompleted();
	}

	updatedUserCompleted() {
		this.munroService
			.updatedUserCompletedMunros(
				this.userService.userId,
				this._completedMunros.map(item => item._id),
			)
			.subscribe();
	}

    onImageSelect(event: any, munro: Munro) {
        const file = event.target.files[0];

        if (file) {
          const formData = new FormData();
          formData.append('image', file, file.name);

          // Send the form data (with the image file) to your API to upload the image
          this.http.post(`http://localhost:3000/api/munros/${munro._id}/image`, formData)
            .subscribe(response => {
              console.log('Image uploaded successfully:', response);
              // Update the munro with the new image URL if needed
              munro.image_url = response['image_url'];  // Adjust according to API response
            }, error => {
              console.error('Error uploading image:', error);
            });
        }
      }

	get displayMunros(): Array<Munro> {
		switch (this.activeTab) {
			case 0:
				return this._allMunros;
			case 1:
				return this._completedMunros;
			case 2:
				return this._uncompletedMunros;
			default:
				return this._allMunros;
		}
	}

	get allMunros(): Array<Munro> {
		return this._allMunros;
	}

	get completedMunros(): Array<Munro> {
		return this._completedMunros;
	}

	get uncompletedMunros(): Array<Munro> {
		return this._uncompletedMunros;
	}

	private syncMunroLists() {
		this._completedMunros = [...this._allMunros.filter(item => item.completed)];
		this._uncompletedMunros = [...this._allMunros.filter(item => !item.completed)];
	}
}

