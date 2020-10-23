import {Actions, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.action';

export class AuthEffects{
    
    constructor(private action$: Actions){}

    authLogin = this.action$.pipe(
        ofType(AuthActions.LOGIN_START)
    )


}