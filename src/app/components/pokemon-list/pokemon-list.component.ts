import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
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

  pokemonNames: Pokemon[] = [];
  selectedPokemonName1: string;
  selectedPokemonName2: string;
  pokemonTradeList1: Pokemon[] = [];
  pokemonTradeList2: Pokemon[] = [];

  // trades result list
  resultList: Result[] = [];

  trainerName1: string;
  trainerName2: string;


  constructor(
    private pokemonService: PokemonService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.listPokemonNames();
    this.listTrades();
    this.clearAllStoredTrades();

  }

  // list all pokemon names through the external api to fill the dropdown
  listPokemonNames(){
    this.pokemonService.getPokemonList().subscribe(
      (data: any) => {
        this.pokemonNames = data.results;
      }
    )
  }

  async addPokemonToTradeList(pokemonName: string, dropDown: number){  
    if(pokemonName){
      if(dropDown == 1 && this.pokemonTradeList1.length < 6){
        this.pokemonTradeList1 = await this.pushPokemonToList(this.pokemonTradeList1, pokemonName);
      }
      else if(dropDown == 2 && this.pokemonTradeList2.length < 6){
        this.pokemonTradeList2 = await this.pushPokemonToList(this.pokemonTradeList2, pokemonName);
      }
      else{
        this.messageService.add({
          severity: 'error',
          summary: 'Maximum of 6 pokemon per list'
        });
      } 
    }else{
      this.messageService.add({
        severity: 'error',
        summary: 'Select a pokemon'
      });
    }
      
  }

  async pushPokemonToList(pokemonList: Pokemon[], pokemonName: string){
    let pokemon: Pokemon;
    pokemon = await this.searchPokemon(pokemonName);
    pokemon.indexNumber = pokemonList.length;
    pokemonList.push(pokemon);
    return pokemonList;
  }

  async removePokemonFromTrade(dropDown: number, pokemonIndex: number){
    if(dropDown == 1){
      this.pokemonTradeList1.splice(pokemonIndex, 1);
    }
    else if(dropDown == 2){
      this.pokemonTradeList2.splice(pokemonIndex, 1);
    }
    this.updatePokemonIndex(dropDown);
  }

  // updates lists indexes after a pokemon is removed 
  updatePokemonIndex(dropDown: number){
    if(dropDown == 1){
      for(let i = 0; i < this.pokemonTradeList1.length; i++){
        this.pokemonTradeList1[i].indexNumber = i;
      }
    }
    else if(dropDown ==2){
      for(let i = 0; i < this.pokemonTradeList2.length; i++){
        this.pokemonTradeList2[i].indexNumber = i;
      }
    }
  }

  async searchPokemon(nameOrId: any){
    let pokemonLocal: Pokemon;  
    pokemonLocal = await this.pokemonService.getPokemon(nameOrId).toPromise();
    return pokemonLocal;
  }

  saveTradeList(userName1: string, userName2: string){
    if( this.checkPokemonLists() && this.checkUserNames(userName1, userName2)){
      this.pokemonService.saveTradeList(this.buildTradeToBackend(userName1, userName2)).subscribe(() => {
        this.listTrades();
        this.getVerdictMessage();
      });
    } 
  }

  checkPokemonLists(){
    if(!(this.pokemonTradeList1.length>0) || !(this.pokemonTradeList2.length>0)){
      this.messageService.add({
        severity: 'error',
        summary: 'Empty trade List!'
      });
      return false;
    }
    return true;  
  }

  checkUserNames(userName1: string, userName2: string){
    if(!userName1 || !userName2){
      this.messageService.add({
        severity: 'error',
        summary: 'Missing trader name!'
      });
      return false;
    }
    return true;  
  }

  // builds trade object for backend format
  buildTradeToBackend(userName1: string, userName2: string){
    var tradeList: Trade[] = [];
    var tradeLocal1 = new Trade();
    var tradeLocal2 = new Trade();
    tradeLocal1.pokemonList = this.pokemonTradeList1;
    tradeLocal2.pokemonList = this.pokemonTradeList2;
    tradeLocal1.userName = userName1;
    tradeLocal2.userName = userName2;
    tradeList.push(tradeLocal1);   
    tradeList.push(tradeLocal2);
    return tradeList;
  }

  // list trade results
  async listTrades(){
    this.resultList = await this.pokemonService.getAllTradeLists().toPromise();   
  }

  async getVerdictMessage(){
    await this.listTrades();
    if(this.resultList[this.resultList.length-1].verdict == "Good Trade!"){
      this.messageService.add({
        severity: 'success',
        summary: 'Good Trade!'
      });
    }
    else if(this.resultList[this.resultList.length-1].verdict == "Bad Trade!"){
      this.messageService.add({
        severity: 'error',
        summary: 'Bad Trade!'
      });
    }
  }

  clearTradeList(){
    this.pokemonTradeList1.splice(0,this.pokemonTradeList1.length);
    this.pokemonTradeList2.splice(0,this.pokemonTradeList2.length);
  }

  async clearAllStoredTrades(){
    await this.pokemonService.removeAllStoredTrades().toPromise();
    await this.listTrades();
  }

}