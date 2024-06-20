import { Component } from '@angular/core';
import { Recipe, RecipeService } from '../Services/recipe.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

  constructor(private recipeService: RecipeService) {}

  toggleFavorite() {
    this.recipeService.toggleFavorite(1)
      .subscribe(
        (error) => {
          // Handle error here
          console.error(error); 
        }
      );
  }
}
