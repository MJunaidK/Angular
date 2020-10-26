import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';
import * as  AuthActions from '../auth/store/auth.action';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'

})
export class AuthComponent implements OnDestroy, OnInit{
    isLoginMode =true;
    isLoading =false;
    error: string = null;
    @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;
    private closeSub: Subscription;
    private storeSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver, private store:Store<fromApp.AppState>){}
   
    ngOnInit(): void {
       this.storeSub = this.store.select('auth').subscribe(
           authState => {
               if(authState){
               this.isLoading = authState.loading
               this.error = authState.authError
               }
               if(this.error){
                   this.showErrorAlert(this.error)
               }
           }
       )
    }
    

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode ;
    }

    onHandleError(){
        this.store.dispatch(new AuthActions.ClearError());
    }

    onSubmit(form : NgForm){

        const email = form.value.email;
        const password = form.value.password;

      //  let authObs: Observable<AuthResponseData>;

        if(! form.valid){
            return ;
        }
        this.isLoading =true;
        if(this.isLoginMode){
           // authObs = this.authService.login(email, password);
           this.store.dispatch(
               new AuthActions.LoginStart({email: email, password: password})
           )

        }else{
           
           // authObs = this.authService.signUp(email, password);
           this.store.dispatch(new AuthActions.SignupStart(({email: email, password: password})))
        }

        /*authObs.subscribe(
            resData => { 
                console.log(resData);
                this.isLoading =false; 
                this.router.navigate(['/recipes'])

            },
            errorMessage => { 
                this.error = errorMessage; 
                this.isLoading =false; 
                this.showErrorAlert(errorMessage);
            }   
        ); */ 
        
        form.reset();
    }

    private showErrorAlert(message: string){
        // const alertCmp = new AlertComponent();
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef= this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        })

    }


    ngOnDestroy(): void {
        if(this.closeSub){
            this.closeSub.unsubscribe();
        }

        if(this.storeSub){
            this.storeSub.unsubscribe();
        }


    }

}