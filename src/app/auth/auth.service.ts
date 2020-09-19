 import { Injectable } from '@angular/core';
 import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { User } from './user.model';


export interface AuthResponseData{
     kind: string;
     idToken: string;
     email: string;
     refrehToken: string;
     refreshToken: string;
     expiresIn: string;
     localId: string; 
     registered?: boolean;
 }   

 @Injectable({
    providedIn: 'root'
 })
 export class AuthService{

     user = new Subject<User>();

    constructor(private http: HttpClient){

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
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })) 
    }


    login(email: string, password: string ){
       return this.http.post<AuthResponseData>('FIRBASE_LOGIN_URL',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        )
        .pipe(catchError(this.handleError),tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
          }))  
    }


    private handleAuthentication(email: string, userId: string,token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user =  new User(email, userId, token,expirationDate);
        this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse){
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