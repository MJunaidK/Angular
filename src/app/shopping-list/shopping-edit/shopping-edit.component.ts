import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm; 
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

 // @ViewChild('nameInput') nameInputRef: ElementRef;
 // @ViewChild('amountInput') amountInputRef: ElementRef;
  //@Output() ingredientAdded = new EventEmitter<Ingredient>();
   


  constructor(private store: Store<fromShoppingList.AppState>) { }
  
                ngOnInit() {
                  this.subscription=this.store.select('shoppingList')
                    .subscribe(
                      data => {
                        if(data.editedIngredientIndex > -1){
                          this.editedItem= data.editedIngredient;
                          this.editMode =true;
                          this.slForm.setValue({
                                 name: this.editedItem.name,
                                 amount: this.editedItem.amount
                           });
                        }else{
                          this.editMode = false;
                        }
                      }
                    );
              
                  // this.subscription=this.shoppingListService.startedEditing.subscribe(
                  //   (index: number) => {
                  //     this.editMode = true;
                  //     this.editedItemIndex = index;
                  //     this.editedItem = this.shoppingListService.getIngredientsByIndex(this.editedItemIndex);
                  //     this.slForm.setValue({
                  //       name: this.editedItem.name,
                  //       amount: this.editedItem.amount
                  //     })
                  //   }
                  // );
                }

  onAddItem(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    //const ingName = this.nameInputRef.nativeElement.value;
    //const ingAmount = this.amountInputRef.nativeElement.value;
 
    //this.ingredientAdded.emit(newIngredient);
    if(this.editMode){
     // this.slService.updateIngredient(this.editedItemIndex, newIngredient);
     this.store.dispatch(
       new ShoppingListActions.UpdateIngredient(newIngredient)
     )
    }else{
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
      //this.slService.addIngredient(newIngredient);
    }
    this.editMode= false;
    form.reset();
   
  }

  onClear(){
      this.slForm.reset();
      this.editMode=false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onDelete(){
    //this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredient()
    )
    this.onClear();
  }


}
