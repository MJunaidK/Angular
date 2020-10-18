import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";

export const ADD_INGREDIENT = "ADD_INGREDIENT";
export const ADD_INGREDIENTS = "ADD_INGREDIENTS";
export const UPDATE_INGREDIENT = "UPDATE_INGREDIENT";
export const DELETE_INGREDIENT = "DELETE_INGREDIENT";

export class AddIngredient implements Action {
    readonly type: string = ADD_INGREDIENT;
    
    constructor(public payload: Ingredient){
        
    }
    
}

export class AddIngredients implements Action {
    readonly type: string = ADD_INGREDIENTS;
    payload: Ingredient[]
    constructor(public payloads: Ingredient[]){
        this.payload = payloads || [];
    }
    
}

interface IPayload{
    index: number;
    ingredient: Ingredient
}

export class UpdateIngredient implements Action {
    readonly type: string = UPDATE_INGREDIENT;
 
    constructor(public payload: { index:number, ingredient: Ingredient}){}
    
    }
    


export class DeleteIngredient implements Action {
    readonly type: string = DELETE_INGREDIENT;
    
    constructor(public payload: number){
       
    }
}    

export type ShoppingListActions =  AddIngredient | AddIngredients | UpdateIngredient | DeleteIngredient;