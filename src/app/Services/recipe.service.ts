import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';



export interface Ingredient {
  Ingredient_ID: number;
  Recipe_ID: number;
  Name: string;
  Quantity: number;
  Unit: string;
}

export interface Step {
  Step_ID: number;
  Recipe_ID: number;
  Step_Number: number;
  Instruction: string;
}

export interface Recipe {
  details: {
    Recipe_ID: number;
    Name: string;
    Servings: number;
    Prep_Time: string;
    Cook_Time: string;
    Total_Time: string;
    favorite: boolean;
  };
  ingredients: Ingredient[];
  steps: Step[];
}


@Injectable({ providedIn: 'root' })
export class RecipeService {
  
  private apiUrl = 'http://localhost:3000/api'; // replace with your API URL
  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/allrecipes`);
  }

  getRecipeDetail(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/getrecipe/${id}`)
                .pipe(catchError((error) => throwError(() => new Error('Error fetching recipe details'))));
  }

  searchRecipes(searchTerm: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes/search/${searchTerm}`);
  }

  addRecipe(recipe: Recipe): Observable<any> {
    return this.http.post(`${this.apiUrl}/addrecipe`, recipe)
      .pipe(catchError((error) => throwError(() => new Error('Error adding recipe'))));
  }
  
  updateRecipe(recipe: Recipe): Observable<any> {
    const url = `${this.apiUrl}/update/${recipe.details.Recipe_ID}`; // Use the recipe's ID
    return this.http.put(url, recipe) // Use PUT for updates
      .pipe(
        catchError(error => {
          console.error('Error updating recipe:', error); 
          return throwError(() => new Error('Error updating recipe'));
        })
      );
  }


  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleterecipe/${id}`, {responseType: 'text' });
  }


  toggleFavorite(recipeId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/recipes/favorite/${recipeId}`, null) // Send a PUT request to the endpoint
      .pipe(
        catchError(error => {
          console.error('Error toggling favorite status:', error);
          return throwError(() => new Error('Error toggling favorite status'));
        })
      );
  }

  getFavoriteRecipes(): Observable<Recipe[]> {
      return this.http.get<Recipe[]>(`${this.apiUrl}/favorites`);
  }

  
}