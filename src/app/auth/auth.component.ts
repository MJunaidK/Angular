import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'

})
export class AuthComponent implements OnDestroy{
    isLoginMode =true;
    isLoading =false;
    error: string = null;
    @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;
    private closeSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver){}
    

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode ;
    }

    onHandleError(){
        this.error = null;
    }

    onSubmit(form : NgForm){

        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>;

        if(! form.valid){
            return ;
        }
        this.isLoading =true;
        if(this.isLoginMode){
            authObs = this.authService.login(email, password);
        }else{
            authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe(
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
        ); 
        
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
    }

}