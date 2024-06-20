import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeService, Ingredient, Step } from '../Services/recipe.service';
import { HttpClientModule } from '@angular/common/http';
import cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // For NgIf, NgFor, etc.
  templateUrl: './recipe-cards.component.html',
  styleUrls: [
    './recipe-cards.component.css',
  ],
  providers: [RecipeService]
})
export class RecipeCardComponent implements OnInit {
  @Input() recipeInput: string | null = null;
  @Input() favoriteRecipes: Recipe[] | null = null;

  recipes: Recipe[] = [];

  @ViewChild('editModalTemplate') editModalTemplate: TemplateRef<any> | undefined;
  isModalOpen = false;
  recipeToEdit: Recipe | null = null;
  recipeCopy: Recipe | null = null;

  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: TemplateRef<any> | undefined;
  recipeToDelete: Recipe | null = null;
  isDeleteModalOpen = false;
  
  
  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    if (this.favoriteRecipes){
      this.recipeService.getFavoriteRecipes().subscribe(
        (recipes) => {
          this.recipes = recipes;
        },
        (error) => {
          console.error('Error fetching favorite recipes:', error);
        }
      );
    } else if (typeof this.recipeInput === 'string') {
      this.recipeService.searchRecipes(this.recipeInput).subscribe(
        (recipes) => {
          this.recipes = recipes.sort((a, b) => a.details.Name.localeCompare(b.details.Name));
        },
        (error) => {
          console.error('Error fetching recipe details:', error);
          // Handle errors gracefully (e.g, display an error message)
        }
      );
    } else {
      this.recipeService.getRecipes().subscribe({
        next: (recipes) => {
          this.recipes = recipes.sort((a, b) => a.details.Name.localeCompare(b.details.Name));
        },
        error: (error) => {
          console.error('Error fetching recipe details:', error);
          console.error('Error message:', error.message);
          console.error('Error status:', error.status);
          console.error('Error response:', error.response);
        }
      });
    }
  }

  openEditModal(recipe: Recipe) {
    this.recipeToEdit = recipe; // Copy the recipe for editing
    this.recipeCopy = cloneDeep(recipe);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.recipeToEdit = null;
    this.recipeCopy = null;
  }

  @Output() editRecipe = new EventEmitter<Recipe>();
  @Output() deleteRecipe = new EventEmitter<Recipe>();

  onDelete(recipe: Recipe) {
    this.deleteRecipe.emit(recipe);
  }
  
  addNewIngredient() {
    if (this.recipeToEdit) {
    const newIngredient: Ingredient = {
      Ingredient_ID: 0, 
      Recipe_ID: 0,
      Name: '',
      Quantity: 0,
      Unit: ''
    };
    this.recipeToEdit.ingredients.push(newIngredient);
    }
  }

  removeIngredient(index: number) {
    if (this.recipeToEdit) {
      this.recipeToEdit.ingredients.splice(index, 1);
    }
  }

  addNewStep() {
    if (this.recipeToEdit) {
      const newStep: Step = {
        Step_ID: 0,
        Recipe_ID: 0,
        Step_Number: 0,
        Instruction: '',
      };
      this.recipeToEdit.steps.push(newStep);
    }
  }

  removeStep(index: number) {
    if (this.recipeToEdit) {
      this.recipeToEdit.steps.splice(index, 1);
      // Re-number remaining steps
      for (let i = index; i < this.recipeToEdit.steps.length; i++) {
        this.recipeToEdit.steps[i].Step_Number = i + 1;
      }
    }
  }

  onSubmit(recipe: Recipe) {
    this.recipeService.updateRecipe(recipe).subscribe(
      () => {
        console.log('Recipe updated successfully');
        this.closeModal();  // Close the modal after successful update
        // (Optional) Consider refreshing the recipe list
        this.refreshRecipes(); // Update the specific recipe in the array (more targeted)
      },
      error => {
        console.error('Error updating recipe:', error);
        // (Optional) Handle the error with an alert or message to the user
      }
    );
    
  }

  refreshRecipes() {
    // Check if filtering is active (recipeInput is not null)
    if (this.recipeInput) {
      this.recipeService.searchRecipes(this.recipeInput).subscribe(
        recipes => this.recipes = recipes
      );
    } else { // No filtering, fetch all recipes
      this.recipeService.getRecipes().subscribe(
        recipes => this.recipes = recipes
      );
    }
  }

  openDeleteConfirmationModal(recipe: Recipe) {
    this.recipeToDelete = recipe;
    this.isDeleteModalOpen = true;
  }

  closeDeleteConfirmationModal() {
    this.isDeleteModalOpen = false;
    this.recipeToDelete = null;
  }

  confirmDelete() {
    if (this.recipeToDelete) {
      this.recipeService.deleteRecipe(this.recipeToDelete.details.Recipe_ID).subscribe(
        () => {
          console.log('Recipe deleted successfully');
          this.refreshRecipes(); // Refresh the recipe list
          this.closeDeleteConfirmationModal();
        },
        error => {
          console.error('Error deleting recipe:', error);
          this.closeDeleteConfirmationModal(); // Close the modal even if there's an error
        }
      );
    }
  }

  toggleFavorite(recipe: Recipe) {
    this.recipeService.toggleFavorite(recipe.details.Recipe_ID).subscribe(() => {
      recipe.details.favorite = !recipe.details.favorite; // Update the favorite status locally
    }, error => {
      console.error('Error toggling favorite:', error);
      // (Optional) Show an error message to the user
    });
  }
}