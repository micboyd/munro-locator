import { Component, Input, OnInit } from '@angular/core';
import { Munro } from 'src/models/munro';

@Component({
  selector: 'app-munro',
  templateUrl: './munro.component.html',
  styleUrls: ['./munro.component.scss']
})
export class MunroComponent implements OnInit {

    @Input() munroInformation: Munro;

  constructor() { }

  ngOnInit(): void {
  }

}
