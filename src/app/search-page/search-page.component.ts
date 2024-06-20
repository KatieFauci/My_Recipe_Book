// search.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For using ngModel
import { RecipeService } from '../Services/recipe.service';
import { RecipeCardComponent } from '../recipe-cards/recipe-cards.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RecipeCardComponent, CommonModule, HttpClientModule], 
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  searchResults: any[] = [];  // Using 'any[]' for flexibility 

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    // Optional: If you want to display all recipes initially
    this.recipeService.getRecipes().subscribe(recipes => this.searchResults = recipes);
  }

  searchRecipes() {
    // Clear Search Results
    this.searchResults = [];

    if (this.searchTerm.trim() !== '') {
      this.recipeService.searchRecipes(this.searchTerm).subscribe(
        (recipes) => {
          this.searchResults = recipes;
          console.log('Search Results:', this.searchResults);
        },
        (error) => {
          console.error('Error fetching search results:', error);
          // Handle errors gracefully (e.g., display an error message)
        }
      );
    } else {
      this.searchResults = []; // Clear results if search term is empty
    }
  }
}