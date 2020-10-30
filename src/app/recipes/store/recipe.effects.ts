import { Actions, Effect, ofType } from '@ngRx/effects';
import {switchMap, map, tap, withLatestFrom, switchMapTo} from 'rxjs/operators';
import * as RecipesAction from './recipe.action'; 
import {HttpClient} from '@angular/common/http'; 
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable() 
export class RecipeEffects{

    recipes: Recipe[];

    constructor(private action$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>){}

    @Effect() 
    fetchRecipes = this.action$.pipe(
        ofType(RecipesAction.FETCH_RECIPES),
        switchMap(() => {
            recipes: [ new Recipe('A Test Recipe', 'This is simply a test',
            'https://media-cdn.tripadvisor.com/media/photo-s/15/06/7b/64/india-non-veg-thali.jpg'
            ,[
              new Ingredient("Meat", 1),
              new Ingredient("Veggie",10)
            ]),
           new Recipe('Another  Test Recipe ', 'This is simply a test', 'https://media-cdn.tripadvisor.com/media/photo-s/15/06/7b/64/india-non-veg-thali.jpg',
           [new Ingredient("Meat more", 1),
           new Ingredient("Veggie more",10)])]
            return this.recipes;
            //return this.http.get<Recipe[]>('GET_URL')
        })
    )
      /*  map(recipes =>{
                return recipes.map(recipe => {
                    return  {...recipe, ingredients: recipe.ingredients ? recipe.ingredients: []};
                });
            }),
        map( recipes => {
            return new RecipesAction.SetRecipes(recipes); 
        })  
        )  */ 
        
    
    @Effect({dispatch: false})
    storeRecipes = this.action$.pipe(
        ofType(RecipesAction.STORE_RECIPE),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
            return   this.http.put('URL', recipesState.recipes)
        })
        )
        
         

    
}