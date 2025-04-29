import { Component, OnInit } from '@angular/core';
import { MunroService } from '../../shared/services/munros.service';
import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'app-mountain-manager',
	templateUrl: './mountain-manager.component.html',
	standalone: false,
})
export class MountainManagerComponent implements OnInit {
	constructor(private munroService: MunroService, private userService: UserService) {}

	ngOnInit() {}
}

