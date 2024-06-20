import { Component, OnInit } from '@angular/core';
import { RecipeService, Recipe } from './recipe.service';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-recipe-list', 
  standalone: true,
  imports: [NgFor, HttpClientModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  providers: [RecipeService]
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipeService.getRecipes()
      .subscribe(recipes => this.recipes = recipes);
  }
}