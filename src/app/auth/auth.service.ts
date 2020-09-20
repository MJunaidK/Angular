 import { Injectable } from '@angular/core';
 import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';


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

     user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient, private router: Router){

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
        this.user.next(null);
        this.router.navigate(['/auth']);
    }


    private handleAuthentication(email: string, userId: string,token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000); 
        const user =  new User(email, userId, token,expirationDate);
        this.user.next(user);
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