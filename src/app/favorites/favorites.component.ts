import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeService } from '../Services/recipe.service';
import { RecipeCardComponent } from '../recipe-cards/recipe-cards.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RecipeCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favoriteRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    
  }
}
