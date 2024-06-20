import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Component Imports
import { RecipeCardComponent } from './recipe-cards/recipe-cards.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchComponent } from './search-page/search-page.component';
import { FavoritesComponent } from './favorites/favorites.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ 
    RecipeCardComponent,
    NavbarComponent,
    SearchComponent,
    FavoritesComponent,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-hello-app';
}