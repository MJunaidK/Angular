import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import {DataStorageService} from '../shared/data-storage.service' 
import * as fromApp from '../store/app.reducer'; 
import * as AuthActions from '../auth/store/auth.action';
import * as fromAuth from '../auth/store/auth.reducer';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{

    isAuthenticated = false;
    private userSub: Subscription;
    authState: Observable<fromAuth.State>

    constructor(private dataStorageService: DataStorageService,
                    private authService: AuthService, private store:Store<fromApp.AppState>){}
    
    ngOnInit(): void {
        this.authState =this.store.select('auth');  
        /*
        this.userSub = this.store.select('auth')
       .pipe(
           map((authState) => {
               return authState.user
           })
       ).
       subscribe( user =>{
        this.isAuthenticated = !!user;
        console.log(!user);
        console.log(!!user);
       });
         */
    }

    onSaveData(){
        this.dataStorageService.storeRecipes();
    }
    
    onFetchData(){
        this.dataStorageService.fetchRecipes().subscribe()
    }

    onLogOut(){
        this.store.dispatch(new AuthActions.Logout);
        //this.authService.logout();
    }

    ngOnDestroy(): void {
       this.userSub.unsubscribe(); 
    }
}