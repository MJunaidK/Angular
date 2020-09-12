import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

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
  eidtedItem: Ingredient;

 // @ViewChild('nameInput') nameInputRef: ElementRef;
 // @ViewChild('amountInput') amountInputRef: ElementRef;
  //@Output() ingredientAdded = new EventEmitter<Ingredient>();
   


  constructor(private slService: ShoppingListService) { }
  
  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number)=> {
         this.editMode = true;
         this.editedItemIndex = index;
         this.eidtedItem = this.slService.getIngredient(this.editedItemIndex);
         this.slForm.setValue({
           name: this.eidtedItem.name,
           amount: this.eidtedItem.amount
         })
      }
    );
  }

  onAddItem(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    //const ingName = this.nameInputRef.nativeElement.value;
    //const ingAmount = this.amountInputRef.nativeElement.value;
 
    //this.ingredientAdded.emit(newIngredient);
    if(this.editMode){
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    }else{
      this.slService.addIngredient(newIngredient);
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
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }


}
