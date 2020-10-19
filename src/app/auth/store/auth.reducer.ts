import { User } from '../user.model';
export interface State{
    user: User;
}

const initialState = {

    user: null

}
export function authReducer(state, action){
    return state;
}