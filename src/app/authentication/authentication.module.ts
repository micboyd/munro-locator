import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
	declarations: [],
	imports: [BrowserModule],
	providers: [provideHttpClient()],
	bootstrap: [],
})
export class AppModule {}
