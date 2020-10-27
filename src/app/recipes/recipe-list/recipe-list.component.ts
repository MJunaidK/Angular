import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import {Recipe } from '../recipe.model'  
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[];



  constructor(private recipeService: RecipeService,
                private router: Router,
                private route: ActivatedRoute,
                private store: Store<fromApp.AppState> ) { }
  

  ngOnInit(): void {

    this.store.select('recipes').
      pipe(
        map(
          recipeState => recipeState.recipes
        )
      ).subscribe(
        (recipes: Recipe[]) => {
          this.recipes= recipes;
        }
      )
   /*this.subscription= this.recipeService.recipesChanged.subscribe(
      (recipes:Recipe[]) => {
        this.recipes= recipes;
      }
    )
    this.recipes = this.recipeService.getRecipes();*/
  }

  ngOnDestroy(): void {
   // this.subscription.unsubscribe();
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }

    

}
