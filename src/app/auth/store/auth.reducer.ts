import { User } from '../user.model';
import * as AuthActions from './auth.action';
export interface State{
    user: User;
}

const initialState = {

    user: null

}
export function authReducer(state, action: AuthActions.AuthActions){

    switch(action.type){
        case AuthActions.LOGIN:
            const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate)
            return {
                ...state,
                user: user
            }
        case AuthActions.LOGOUT:
            return{
                ...state,
                User: null
            }
        default:
            return state    
    }
    return state;
}