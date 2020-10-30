import {Actions, Effect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.action';
import {switchMap, catchError, map, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData{
    kind: string;
    idToken: string;
    email: string;
    refrehToken: string;
    expiresIn: string;
    localId: string; 
    registered?: boolean;
} 

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000); 
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
            email:  email,
            userId: userId,
            token: token,
            expirationDate: expirationDate,
            redirect: true
          })  
}

const handleError = (errorRes) => {

    
    let errorMessage = 'An unknown error has ocurred !';
    if(!errorRes.error || errorRes.error.error){
        return of(new AuthActions.AuthenticateFail(errorMessage))
    }
    switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
           errorMessage: 'This email exists already'; 
           break;
        case 'EMAIL_NOT_FOUND':
           errorMessage: 'This email does not exist'; 
           break;
        case 'INAVLID_PASSWORD':
           errorMessage: 'This password is not correct'; 
           break;   
    }


}

@Injectable()
export class AuthEffects{
    
    constructor(private action$: Actions, private http: HttpClient, private router: Router, private authService: AuthService){}
    
    @Effect()
    authSignUp= this.action$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            
    

            return this.http.post<AuthResponseData>('FIRBASE_LOGIN_URL',
            {
                email: signupAction.payload.email,
                password: signupAction.payload.password,
                returnSecureToken: true
            }
            )
            .pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                }),
                map(resData => {
                     return handleAuthentication(+resData.expiresIn,resData.email,resData.localId,resData.idToken)
                    
                }),
                catchError(
                    (errorRes) => {
                        // for local to worl commenting the erro and sending back the hardcoded user obect
                        handleAuthentication(13462346,'test@test.com','206027','36546t24'); 
                    return handleError(errorRes);
               }),
            )
               
        })
        
    )
    
    @Effect()
    authLogin = this.action$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            // for local to work commenting the erro and sending back the hardcoded user obect
            return of(handleAuthentication(13462346,'test@test.com','206027','36546t24')); 
            //return of();

            return this.http.post<AuthResponseData>('http://localhost:8080',
            {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            }
            )
            .pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                }),
                map(resData => {
                     return handleAuthentication(+resData.expiresIn,resData.email,resData.localId,resData.idToken)
                    
                }),
                catchError(errorRes => {
                    // for local to worl commenting the erro and sending back the hardcoded user obect
                    handleAuthentication(13462346,'test@test.com','206027','36546t24'); 
                    return handleError(errorRes);
               }),
            )
               
        })
    )

    @Effect({dispatch: false})
    authRedirect = this.action$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccesAction: AuthActions.AuthenticateSuccess) => {
            if(authSuccesAction.payload.redirect){
               this.router.navigate(['/']);
            }
        })
    )

    

    @Effect()
    autoLogin = this.action$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData:{email: string;id: string; _token: string, _tokenExpirationDate: string}  = JSON.parse(localStorage.getItem('userData'));
            if(!userData){
                return {type: 'DUMMY'}
            }
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
            if(loadedUser.token){
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                //this.user.next(loadedUser);
                return new AuthActions.AuthenticateSuccess({
                  email:  loadedUser.email,
                  userId: loadedUser.id,
                  token: loadedUser.token,
                  expirationDate:   new Date(userData._tokenExpirationDate),
                  redirect: false
                })
                
                //const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                //this.autoLogout(expirationDuration);
            }

            return {type: 'DUMMY'}
        })
    
        )

        @Effect({dispatch: false})
        authLogout = this.action$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth'])
        })
    )
    
}