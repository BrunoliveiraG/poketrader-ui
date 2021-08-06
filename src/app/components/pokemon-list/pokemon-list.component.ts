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
  pokeListTest1: any[];
  pokeListTest2: any[];
  pokeListIndex1: number = 0;
  pokeListIndex2: number = 0;


  constructor(
    private pokemonService: PokemonService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.clearPokeLists();
    this.listPokemons();
    this.listTrades();

  }

  clearPokeLists(){
    this.pokeListTest1 = [
      {index: "1", name: ""},
      {index: "2", name: ""},
      {index: "3", name: ""},
      {index: "4", name: ""},
      {index: "5", name: ""},
      {index: "6", name: ""}
  ];
    this.pokeListTest2 = [
      {index: "1", name: ""},
      {index: "2", name: ""},
      {index: "3", name: ""},
      {index: "4", name: ""},
      {index: "5", name: ""},
      {index: "6", name: ""}
  ];
  }

  listPokemons(){
    this.pokemonService.getPokemonList().subscribe(
      (data: any) => {
        this.pokemons = data.results;
      }
    )
  }


  addPokemonToTrade(pokemonName: string, dropDown: number){
    var pokemon = new Pokemon();
    if(pokemonName){
      pokemon =  this.searchPokemon(pokemonName);
      if(dropDown == 1 && this.pokeListIndex1 < 6){
        this.pokeListTest1[this.pokeListIndex1].name = pokemonName;
        this.pokemonToTrade1.push(pokemon);
        this.pokeListIndex1 +=1;
      }
      else if(dropDown == 2 && this.pokeListIndex2 < 6){
        this.pokeListTest2[this.pokeListIndex2].name = pokemonName;
        this.pokemonToTrade2.push(pokemon);
        this.pokeListIndex2 +=1;
      }
      
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
      this.clearPokeLists();
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