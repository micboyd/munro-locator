import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-search',
    templateUrl: 'search.component.html',
    standalone: false,
})
export class SearchComponent implements OnInit {

    @Output() searchTerm = new EventEmitter<string>();

    searchControl: FormControl = new FormControl('');

    ngOnInit() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged()
            )
            .subscribe(value => {
                this.searchTerm.emit(value ?? '');
            });
    }
}