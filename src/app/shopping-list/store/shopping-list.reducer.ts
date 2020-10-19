import * as ShoppingActions from './shopping-list.actions';

import { Ingredient } from '../../shared/ingredient.model';
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
        new Ingredient('Apples',5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
}

export function shoppingListReducer(state = initialState, action: ShoppingActions.ShoppingListActions){

    switch(action.type){
        case ShoppingActions.ADD_INGREDIENT:
            return{
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingActions.ADD_INGRDIENTS:
            return{
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingActions.UPDATE_INGREDIENT:
            const ingredient= state.ingredients[state.editedIngredientIndex];
            const updatedIngredient= {  // copy all the properties of the old ingredient to updated in an immutable way
                ...ingredient, 
                ...action.payload
            }
            const ingredients = [...state.ingredients];
            ingredients[state.editedIngredientIndex] = updatedIngredient;
            return{
                ...state,
                ingredients: ingredients,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        case ShoppingActions.DELETE_INGREDIENT:
            const oldIngredients = [...state.ingredients];
            oldIngredients.splice(state.editedIngredientIndex,1);
            return{
                ...state,
                ingredients: oldIngredients,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        case ShoppingActions.START_EDIT:
            const editedIngredient = {...state.ingredients[action.payload]};
            return{
                ...state,
                editedIngredient: editedIngredient,
                editedIngredientIndex: action.payload
            }
        case ShoppingActions.STOP_EDIT:
            return{
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            }                     
        default:
            return state;    
    }
return state;
}