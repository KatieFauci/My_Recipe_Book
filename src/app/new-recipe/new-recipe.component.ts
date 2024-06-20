import { Component } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../Services/recipe.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.css'],
})
export class NewRecipeComponent {
  addRecipeForm: FormGroup;

  constructor(private fb: FormBuilder, private recipeService: RecipeService, private dialog: MatDialog, private router: Router) {
    this.addRecipeForm = this.fb.group({
      Name: ['', Validators.required],
      Servings: ['', Validators.required],
      Prep_Time: this.fb.group({
        value: ['', Validators.required],
        unit: ['minutes', Validators.required]
      }),
      Cook_Time: this.fb.group({
        value: ['', Validators.required],
        unit: ['minutes', Validators.required]
      }),
      Total_Time: this.fb.group({
        value: ['', Validators.required],
        unit: ['minutes', Validators.required]
      }),
      ingredients: this.fb.array([this.newIngredient()]), // Start with one ingredient
      steps: this.fb.array([this.newStep()]) // Start with one step
    });
  }

  get ingredients() {
    return this.addRecipeForm.get('ingredients') as FormArray;
  }

  get steps() {
    return this.addRecipeForm.get('steps') as FormArray;
  }

  newIngredient(): FormGroup {
    return this.fb.group({
      Name: ['', Validators.required],
      Quantity: ['', Validators.required],
      Unit: ['']
    });
  }

  newStep(): FormGroup {
    return this.fb.group({
      Instruction: ['', Validators.required]
    });
  }

  addIngredient() {
    this.ingredients.push(this.newIngredient());
    console.log('Ingredient added', this.ingredients.value);
  }

  removeIngredient(i: number) {
    this.ingredients.removeAt(i);
  }

  addStep() {
    this.steps.push(this.newStep());
  }

  removeStep(i: number) {
    this.steps.removeAt(i);
  }

  onSubmit() {
    console.log("Submit clicked");
    if (this.addRecipeForm.valid) {
      const newRecipeData = this.addRecipeForm.value;
      console.log(newRecipeData);
  
      // Transform time properties into strings
      const transformedRecipeData = {
        ...newRecipeData,
        Prep_Time: `${newRecipeData.Prep_Time.value} ${newRecipeData.Prep_Time.unit}`,
        Cook_Time: `${newRecipeData.Cook_Time.value} ${newRecipeData.Cook_Time.unit}`,
        Total_Time: `${newRecipeData.Total_Time.value} ${newRecipeData.Total_Time.unit}`,
      };
  
      this.recipeService.addRecipe(transformedRecipeData).subscribe(
        (response) => {
          console.log('Recipe added:', response);
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: 'Recipe Added',
              message: 'The recipe has been added successfully.',
              isSuccess: true,
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'viewAllRecipes') {
              this.router.navigate(['/']);
            } else if (result === 'addNewRecipe') {
              this.addRecipeForm.reset();
            }
          });
        },
        (error) => {
          console.error('Error adding recipe:', error);
          this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: 'Error Adding Recipe',
              message: 'An error occurred while adding the recipe.',
              isSuccess: false,
            },
          });
        }
      );
    } else {
      const missingFields: any[] = [];
      Object.keys(this.addRecipeForm.controls).forEach((key) => {
        if (this.addRecipeForm.controls[key].hasError('required')) {
          missingFields.push(key);
        }
      });
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Invalid Form',
          message: `The following fields are required: ${missingFields.join(', ')}`,
          isSuccess: false,
        },
      });
    }
  }
}
