import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Pokemon } from 'src/app/common/pokemon';
import { Result } from 'src/app/common/result';
import { Trade } from 'src/app/common/trade';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})


export class PokemonListComponent implements OnInit {

  pokemons: Pokemon[] = [];
  selectedPokemonName1: string;
  selectedPokemonName2: string;
  pokemonToTrade1: Pokemon[] = [];
  pokemonToTrade2: Pokemon[] = [];
  listName: string;
  resultList: Result[] = [];


  constructor(
    private pokemonService: PokemonService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.listPokemons();
    this.listTrades();
  }

  listPokemons(){
    this.pokemonService.getPokemonList().subscribe(
      (data: any) => {
        this.pokemons = data.results;
      }
    )
  }


  addPokemonToTrade1(pokemonName: string){
    var pokemon = new Pokemon();
    if(pokemonName){
      pokemon =  this.searchPokemon(pokemonName);
      this.pokemonToTrade1.push(pokemon);
    }
  }

  addPokemonToTrade2(pokemonName: string){
    var pokemon = new Pokemon();
    if(pokemonName){
      pokemon =  this.searchPokemon(pokemonName);
      this.pokemonToTrade2.push(pokemon);
    }
  }

  searchPokemon(nameOrId: any){
    var pokemonLocal = new Pokemon();
    
    this.pokemonService.getPokemon(nameOrId).subscribe(
      (data: any) => {
        pokemonLocal.name = data.name;
        pokemonLocal.experience = data.base_experience;
      }
    )
    return pokemonLocal;
  }

  clearTradeList(){
    this.pokemonToTrade1.splice(0,this.pokemonToTrade1.length);
    this.pokemonToTrade2.splice(0,this.pokemonToTrade2.length);
  }

  saveTradeList(){
    var tradeList: Trade[] = [];

    if( this.pokemonToTrade1 && this.pokemonToTrade2){
      var tradeLocal1 = new Trade();
      tradeLocal1.pokemonList = this.pokemonToTrade1;
      tradeList.push(tradeLocal1);
      var tradeLocal2 = new Trade();
      tradeLocal2.pokemonList = this.pokemonToTrade2;
      tradeList.push(tradeLocal2);
    }
    this.pokemonService.saveTradeList(tradeList).subscribe(() => {
      this.clearTradeList();
      this.listTrades();
      this.messageService.add({
        severity: 'success',
        summary: 'Trade list added succesfully'
      });
    });
  }


  listTrades(){
    this.pokemonService.getAllTradeLists().subscribe(
      (data: any) => {
        console.log(data);
        this.resultList = data;
        console.log(this.resultList);
      }
    )
  }

}