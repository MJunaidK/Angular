import { Component, OnInit, OnDestroy } from '@angular/core';
import {Ingredient} from '../shared/ingredient.model'
import { ShoppingListService } from './shopping-list.service';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']

})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Observable<{ingredients:Ingredient[]}>;
  private idChangeSub: Subscription;
  

  constructor(private slService: ShoppingListService, private loggingService: LoggingService,
                private store: Store<{ shoppingList: { ingredients: Ingredient[] }}>) { }

  ngOnInit(): void {
   
   this.ingredients = this.store.select('shoppingList');
    // this.ingredients=  this.slService.getIngredients();
   // this.idChangeSub = this.slService.ingredientsChanged.subscribe(
   //   (ingredients: Ingredient[]) => {
   //     this.ingredients = ingredients;
   //   }
   // )
   // this.loggingService.printLog('Hello from Shopping lsi component ngOninit');
  }

  ngOnDestroy(): void{
    this.idChangeSub.unsubscribe();
  }

  onEditItem(index: number){
  this.slService.startedEditing.next(index);
  }


}
