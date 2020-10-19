import {Ingredient} from '../..//shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions'

export interface AppState{
    shoppingList: State
}

export interface State{
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
}

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions){
    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:   
            return {
                ... state , 
                ingredients: [ ...state.ingredients, action.payload]  
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            let payload: Ingredient[] = this.action.payload || []
            return {
                ... state,
                ingredients: [ ...state.ingredients, ...payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
              const ingredient = state.ingredients[1]; 
              const updatedIngredient = {
                  ... ingredient,
                  ingredient
              } 
                return {
                    ...state, 
                    ingredients: []
                }    
        case ShoppingListActions.DELETE_INGREDIENT:
                return {
                    ... state,
                    ingredients: state.ingredients.filter( (ig, index) => {
                        return index != action.payload
                    })
                }        
            
        default: 
            return state;    
    }
}