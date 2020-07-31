import { Component, OnInit } from '@angular/core';
import {Recipe } from '../recipe.model'  

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is simply a test', 'https://media-cdn.tripadvisor.com/media/photo-s/15/06/7b/64/india-non-veg-thali.jpg'),
    new Recipe('A Test Recipe', 'This is simply a test', 'https://media-cdn.tripadvisor.com/media/photo-s/15/06/7b/64/india-non-veg-thali.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
