import { Ingredient } from 'src/app/shared/ingredient.model';
import {Recipe} from '../recipe.model';
import * as RecipesActions from './recipe.action';

export interface State{
    recipes: Recipe[];
}

const initialState: State = {
    recipes: [ new Recipe('A Test Recipe', 'This is simply a test',
    'https://media-cdn.tripadvisor.com/media/photo-s/15/06/7b/64/india-non-veg-thali.jpg'
    ,[
      new Ingredient("Meat", 1),
      new Ingredient("Veggie",10)
    ]),
   new Recipe('Another  Test Recipe ', 'This is simply a test', 'https://media-cdn.tripadvisor.com/media/photo-s/15/06/7b/64/india-non-veg-thali.jpg',
   [new Ingredient("Meat more", 1),
   new Ingredient("Veggie more",10)])]
}

export function recipeReducer(state = initialState, action: RecipesActions.RecipesAction){
    
    switch(action.type){

        case RecipesActions.SET_RECIPES: 
            return {
                ...state,
                recipes: [ ...action.payload]
            }
        default:
            return state

    }
}