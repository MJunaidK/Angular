 import { Injectable } from '@angular/core';
 import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.action'
import { Store } from '@ngrx/store';


export interface AuthResponseData{
     kind: string;
     idToken: string;
     email: string;
     refrehToken: string;
     expiresIn: string;
     localId: string; 
     registered?: boolean;
 }   

 @Injectable({
    providedIn: 'root'
 })
 export class AuthService{

     //user = new BehaviorSubject<User>(null);

     private tokenExpirationTime:any;

    constructor(private http: HttpClient, private router: Router,private store:Store<fromApp.AppState>){

    }
    signUp(email: string, password: string ){
        return  this.http.post<AuthResponseData>('URL_SIGN_UP_FIREBASE',
         {
             email: email,
             password: password,
             returnSecureToken: true
         }
        )
        .pipe(catchError(this.handleError), tap(resData => {
         // this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
         this.handleAuthentication('test@test.com', '206027','jgdywuet7376djvhe', 1234567);
        })) 
    }


    login(email: string, password: string ){
        console.log(environment.apikey);
       return this.http.post<AuthResponseData>('FIRBASE_LOGIN_URL',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        )
        .pipe(catchError(this.handleError),tap(resData => {
            //this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            this.handleAuthentication('test@test.com', '206027','jgdywuet7376djvhe', 1234567);
          }))  
    }

    logout(){
        //this.user.next(null);
        this.store.dispatch(new AuthActions.Logout());
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTime){
            clearTimeout(this.tokenExpirationTime);
        }
        this.tokenExpirationTime =null;
    }

    autoLogin(){
        const userData:{email: string;id: string; _token: string, _tokenExpirationDate: string}  = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return ;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if(loadedUser.token){
            //this.user.next(loadedUser);
            this.store.dispatch(new AuthActions.Login({
              email:  loadedUser.email,
              userId: loadedUser.id,
              token: loadedUser.token,
              expirationDate:   new Date(userData._tokenExpirationDate)
            }))
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number){
       this.tokenExpirationTime =  setTimeout( () =>{
            this.logout()
        }, expirationDuration)
    }


    private handleAuthentication(email: string, userId: string,token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000); 
        const user =  new User(email, userId, token,expirationDate);
       // this.user.next(user);
       this.store.dispatch(new AuthActions.Login({
        email:  email,
        userId: userId,
        token:  token,
        expirationDate:  expirationDate
      }))
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse){
        return of({'kind':'', 'idToken':'jgdywuet7376djvhe', 'email':'test@test.com', 'refrehToken':'jgdywuet7376djvhe','expiresIn': '1234567', 'localId':'206027'});
        let errorMessage = 'An unknown error has ocurred !';
        if(!errorRes.error || errorRes.error.error){
            return throwError(errorMessage);
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

        return throwError(errorMessage);
    }
 }