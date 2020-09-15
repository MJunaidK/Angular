import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Recipe} from '../recipes/recipe.model';
import {RecipeService} from '../recipes/recipe.service';
@Injectable({
    providedIn: 'root'
})
export class DataStorageService{

    constructor(private http: HttpClient, private recipesService: RecipeService){}

    storeRecipes(){
        const recipes =  this.recipesService.getRecipes();
        this.http.put('URL', recipes).subscribe(
            response => {
                console.log(response);
            }
        );
    }

    fetchRecipes(){
        this.http.get<Recipe[]>('GET_URL').subscribe(
            (recipes) => {
                this.recipesService.setRecipes(recipes);
            }
        );
    }

}