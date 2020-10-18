import {Recipe} from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions'; 
@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  
   private recipes: Recipe[] = [
        new Recipe('A Test Recipe', 'This is simply a test',
         'https://media-cdn.tripadvisor.com/media/photo-s/15/06/7b/64/india-non-veg-thali.jpg'
         ,[
           new Ingredient("Meat", 1),
           new Ingredient("Veggie",10)
         ]),
        new Recipe('Another  Test Recipe ', 'This is simply a test', 'https://media-cdn.tripadvisor.com/media/photo-s/15/06/7b/64/india-non-veg-thali.jpg',
        [new Ingredient("Meat more", 1),
        new Ingredient("Veggie more",10)])
      ];

    constructor(private slService: ShoppingListService,
                  private store: Store<{ shoppingList: {ingredients: Ingredient[]}}>){

    }  

    getRecipes(){
        return this.recipes.slice();
    }  

    getRecipe(index: number){
      return this.recipes[index];
    }


    addIngredientToShoppingList(ingredients: Ingredient[]){
    //this.slService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe){
      this.recipes.push(recipe);
      this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe){
      this.recipes[index] = newRecipe;
      this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
      this.recipes.splice(index, 1);
      this.recipesChanged.next(this.recipes.slice());
    }

    setRecipes(recipes: Recipe[]){
      this.recipes = recipes;
      this.recipesChanged.next(this.recipes.slice());
    }


} 