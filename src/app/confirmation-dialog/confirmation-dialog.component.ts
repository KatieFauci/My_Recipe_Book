import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css', 
  imports: [CommonModule],
})
export class ConfirmationDialogComponent {
  title: string;
  message: string;
  isSuccess: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.message = data.message;
    this.isSuccess = data.isSuccess;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
  
  onAddAnotherRecipeClick(): void {
    this.dialogRef.close('addNewRecipe');
  }
  
  onViewAllRecipesClick(): void {
    this.dialogRef.close('viewAllRecipes');
  }
}