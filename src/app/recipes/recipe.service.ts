import {Recipe} from './recipe.model';
import { EventEmitter, Output, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {

  @Output() recipeSelected = new EventEmitter<Recipe>();
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

    constructor(private slService: ShoppingListService){

    }  

    getRecipes(){
        return this.recipes.slice();
    }  

    addIngredientToShoppingList(ingredients: Ingredient[]){
  this.slService.addIngredients(ingredients);
    }

} 