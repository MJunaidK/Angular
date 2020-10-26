import { User } from '../user.model';
import * as AuthActions from './auth.action';
export interface State{
    user: User;
    authError: string,
    loading: false
}

const initialState = {

    user: null,
    authError: null

}
export function authReducer(state, action: AuthActions.AuthActions){

    switch(action.type){
        case AuthActions.AUTHENTICATE_SUCCESS:
            const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate)
            return {
                ...state,
                user: user,
                authError: null,
                loading: false
            }
        case AuthActions.LOGOUT:
            return{
                ...state,
                User: null
            }
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:    
            return {
                ... state,
                user: null,
                authError: null,
                loading: true
            } 
        case AuthActions.AUTHENTICATE_FAIL:
            return {
                ... state,
                user: null,
                authError: action.payload,
                loading: false
            }
        case AuthActions.CLEAR_ERROR:
            return {
                ... state,
                authError: null
            };                     
        default:
            return state    
    }
    return state;
}