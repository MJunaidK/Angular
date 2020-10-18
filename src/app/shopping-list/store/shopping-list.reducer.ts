import {Ingredient} from '../..//shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions'

const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ]
}

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions){
    switch(action.type){
        case 'ADD_INGREDIENT':   
            return {
                ... state , 
                ingredients: [ ...state.ingredients, action.payload]  
            };
        case 'ADD_INGREDIENTS':
            let payload: Ingredient[] = this.action.payload || []
            return {
                ... state,
                ingredients: [ ...state.ingredients, ...payload]
            }    
        default: 
            return state;    
    }
}