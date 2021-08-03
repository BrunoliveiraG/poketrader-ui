import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { HttpClientModule } from '@angular/common/http';
import { PokemonService } from './services/pokemon.service';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    AppComponent,
    PokemonListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    BrowserAnimationsModule,
    TableModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [PokemonService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
