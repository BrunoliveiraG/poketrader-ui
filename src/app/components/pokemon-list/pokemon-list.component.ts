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
  trainerName1: string;
  trainerName2: string;


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
      {index: 1, name: "", baseExperience:"", url:"" },
      {index: 2, name: "", baseExperience:"", url:""  },
      {index: 3, name: "", baseExperience:"", url:""  },
      {index: 4, name: "", baseExperience:"", url:""  },
      {index: 5, name: "", baseExperience:"", url:""  },
      {index: 6, name: "", baseExperience:"", url:""  }
  ];
    this.pokeListTest2 = [
      {index: 1, name: "", baseExperience:"", url:"" },
      {index: 2, name: "", baseExperience:"", url:""  },
      {index: 3, name: "", baseExperience:"", url:""  },
      {index: 4, name: "", baseExperience:"", url:""  },
      {index: 5, name: "", baseExperience:"", url:""  },
      {index: 6, name: "", baseExperience:"", url:""  }
    ];
  }

  listPokemons(){
    this.pokemonService.getPokemonList().subscribe(
      (data: any) => {
        this.pokemons = data.results;
      }
    )
  }


  async addPokemonToTrade(pokemonName: string, dropDown: number){
    let pokemon: Pokemon;
    if(pokemonName){
      pokemon = await this.searchPokemon(pokemonName);

      if(dropDown == 1 && this.pokeListIndex1 < 6){
        this.pokeListTest1[this.pokeListIndex1].name = pokemon.name;
        this.pokeListTest1[this.pokeListIndex1].baseExperience = pokemon.base_experience;
        this.pokeListTest1[this.pokeListIndex1].url = pokemon.sprites.front_default;
        console.log(pokemon.sprites.front_default);
        this.pokemonToTrade1.push(pokemon);
        this.pokeListIndex1 +=1;
      }
      else if(dropDown == 2 && this.pokeListIndex2 < 6){
        this.pokeListTest2[this.pokeListIndex2].name = pokemon.name;
        this.pokeListTest2[this.pokeListIndex2].baseExperience = pokemon.base_experience;
        this.pokeListTest2[this.pokeListIndex2].url = pokemon.sprites.front_default;
        this.pokemonToTrade2.push(pokemon);
        this.pokeListIndex2 +=1;
      }
      
    }
  }

  buildTestListWithoutElement(dropDown: number, index: number){
    index -=1;
    if(dropDown == 1){
      for (let i = index; i < 5; i++) {
        this.pokeListTest1[i].name = this.pokeListTest1[i+1].name;
        this.pokeListTest1[i].baseExperience = this.pokeListTest1[i+1].baseExperience;
        this.pokeListTest1[i].url = this.pokeListTest1[i+1].url;
      }
      this.pokeListTest1[5].name = "";
      this.pokeListTest1[5].baseExperience = "";
      this.pokeListTest1[5].url = ""; 
    }
    else if(dropDown == 2){
      for (let i = index; i < 5; i++) {
        this.pokeListTest2[i].name = this.pokeListTest2[i+1].name;
        this.pokeListTest2[i].baseExperience = this.pokeListTest2[i+1].baseExperience;
        this.pokeListTest2[i].url = this.pokeListTest2[i+1].url;
      }
      this.pokeListTest2[5].name = "";
      this.pokeListTest2[5].baseExperience = "";
      this.pokeListTest2[5].url = "";
    }
    
  }

  async removePokemonFromTrade(dropDown: number, pokemonName: string, index: number){
    let pokemon: Pokemon;
    pokemon = await this.searchPokemon(pokemonName);
    if(dropDown == 1){
      this.pokemonToTrade1.splice(this.pokemonToTrade1.indexOf(pokemon), 1);
      this.buildTestListWithoutElement(dropDown, index);
      this.pokeListIndex1 -= 1;
    }
    else if(dropDown == 2){
      this.pokemonToTrade2.splice(this.pokemonToTrade2.indexOf(pokemon), 1);
      this.buildTestListWithoutElement(dropDown, index);
      this.pokeListIndex2 -= 1;
    }
  }

  async searchPokemon(nameOrId: any){
    let pokemonLocal: Pokemon;
    
    pokemonLocal = await this.pokemonService.getPokemon(nameOrId).toPromise();
    return pokemonLocal;
  }

  clearTradeList(){
    this.pokemonToTrade1.splice(0,this.pokemonToTrade1.length);
    this.pokemonToTrade2.splice(0,this.pokemonToTrade2.length);
  }

  saveTradeList(userName1: string){
    var tradeList: Trade[] = [];

    if( this.pokemonToTrade1 && this.pokemonToTrade2){
      var tradeLocal1 = new Trade();
      tradeLocal1.pokemonList = this.pokemonToTrade1;
      tradeLocal1.userName = userName1;
      tradeList.push(tradeLocal1);
      var tradeLocal2 = new Trade();
      tradeLocal2.pokemonList = this.pokemonToTrade2;
      tradeList.push(tradeLocal2);
      
    }
    this.pokemonService.saveTradeList(tradeList).subscribe(() => {
      this.clearTradeList();
      this.listTrades();
      this.clearPokeLists();
      this.pokeListIndex1 = 0;
      this.pokeListIndex2 = 0;
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