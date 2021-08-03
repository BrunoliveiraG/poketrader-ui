import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../common/pokemon';
import { map } from 'rxjs/operators';
import { Trade } from '../common/trade';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private basePokemonUrl = 'https://pokeapi.co/api/v2/pokemon';
  private baseLocalUrl = 'http://localhost:8080/trades'

  constructor(private httpClient: HttpClient) { }

  //Returns an observable, Map the JSON data from Spring Data REST to Pokemon array
  getPokemonList() {
    return this.httpClient.get<Pokemon[]>(`${this.basePokemonUrl}/?limit=2000`);
  }

  getPokemon(pokemonNameOrId: any){
    return this.httpClient.get<Pokemon>(`${this.basePokemonUrl}/${pokemonNameOrId}`);
  }

  saveTradeList(tradeList1: Trade[]) {
    return this.httpClient.post(this.baseLocalUrl, tradeList1);
  }

  getAllTradeLists(){
    return this.httpClient.get<Trade[]>(`${this.baseLocalUrl}`);
  }

  
}
