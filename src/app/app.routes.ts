import { Routes } from '@angular/router';
import { RecipeCardComponent } from './recipe-cards/recipe-cards.component'; 
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { SearchComponent } from './search-page/search-page.component';
import { TestComponent } from './test/test.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: RecipeCardComponent }, // Default route
  { path: 'search', component: SearchComponent },
  { path: 'new', component: NewRecipeComponent},
  { path: 'test', component: TestComponent},
  { path: 'favorites', component: FavoritesComponent},
];
