const express = require('express');
const mysql = require('mysql2'); // Import mysql2 instead of mysql
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Crucial for parsing JSON request bodies


// Database connection details (replace with your own)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // Replace with your MySQL password
    database: 'recipe_book'
});

// API endpoint to get all recipes with ingredients and steps
app.get('/api/allrecipes', (req, res) => {
  connection.query('SELECT * FROM recipes', (error, recipeResults) => {
    if (error) throw error;

    const allRecipesWithDetails = [];

    // Use async/await to handle nested queries
    (async function fetchRecipeDetails() {
      for (const recipe of recipeResults) {
        try {
          const ingredientQuery = `SELECT * FROM Ingredients WHERE Recipe_ID = ${recipe.Recipe_ID}`;
          const stepQuery = `SELECT * FROM Steps WHERE Recipe_ID = ${recipe.Recipe_ID}`;

          // Use Promise.all to wait for both queries to finish
          const [ingredientsResults, stepsResults] = await Promise.all([
            new Promise((resolve, reject) => {
              connection.query(ingredientQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
              });
            }),
            new Promise((resolve, reject) => {
              connection.query(stepQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
              });
            })
          ]);

          const recipeWithDetails = {
            details: recipe,
            ingredients: ingredientsResults,
            steps: stepsResults,
          };

          allRecipesWithDetails.push(recipeWithDetails);
        } catch (error) {
          console.error('Error fetching details for recipe ID:', recipe.Recipe_ID, error);
          // Optionally, you can decide how to handle errors here (e.g., continue with other recipes or break)
        }
      }
      // After all recipes have been processed, send the response
      res.json(allRecipesWithDetails);
    })();
  });
});

// --------------------------------------------
// Search API endpoint to get recipes by name
// --------------------------------------------
app.get('/api/recipes/search/:name', (req, res) => {   
  const searchTerm = req.params.name; 
  const recipeQuery = `SELECT * FROM recipes WHERE Name LIKE '%${searchTerm}%'`;

  // Use prepared statements to avoid SQL injection attacks   
  connection.query(recipeQuery, [], (error, recipeResults) => {     
    if (error) throw error;

    const allRecipesWithDetails = [];

    // Use async/await to handle nested queries
    (async function fetchRecipeDetails() {
      for (const recipe of recipeResults) {
        try {
          const ingredientQuery = `SELECT * FROM Ingredients WHERE Recipe_ID = ${recipe.Recipe_ID}`;
          const stepQuery = `SELECT * FROM Steps WHERE Recipe_ID = ${recipe.Recipe_ID}`;

          // Use Promise.all to wait for both queries to finish
          const [ingredientsResults, stepsResults] = await Promise.all([
            new Promise((resolve, reject) => {
              connection.query(ingredientQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
              });
            }),
            new Promise((resolve, reject) => {
              connection.query(stepQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
              });
            })
          ]);

          const recipeWithDetails = {
            details: recipe,
            ingredients: ingredientsResults,
            steps: stepsResults,
          };

          allRecipesWithDetails.push(recipeWithDetails);
        } catch (error) {
          console.error('Error fetching details for recipe ID:', recipe.Recipe_ID, error);
          // Optionally, you can decide how to handle errors here (e.g., continue with other recipes or break)
        }
      }
      // After all recipes have been processed, send the response
      res.json(allRecipesWithDetails);
    })();
  });
});

// --------------------------------------------
// API endpoint to get recipe details by Recipe_ID
// --------------------------------------------
app.get('/api/getrecipe/:id', (req, res) => {
    const recipeID = req.params.id;
    const recipeQuery = `SELECT * FROM recipes WHERE Recipe_ID = ?`;
  
    connection.query(recipeQuery, [recipeID], (error, recipeResults) => {
      if (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // If no recipe found for the given ID, return a 404 Not Found response
        if (recipeResults.length === 0) {
          return res.status(404).json({ error: 'Recipe not found' });
        }
  
        const recipe = recipeResults[0];
        // Use the retrieved Recipe_ID to get ingredients and steps
        const ingredientsQuery = `SELECT * FROM Ingredients WHERE Recipe_ID = ?`;
        const stepsQuery = `SELECT * FROM Steps WHERE Recipe_ID = ?`;
  
        connection.query(ingredientsQuery, [recipeID], (error, ingredientsResults) => {
          if (error) {
            console.error('Error fetching ingredients:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            connection.query(stepsQuery, [recipeID], (error, stepsResults) => {
              if (error) {
                console.error('Error fetching steps:', error);
                res.status(500).json({ error: 'Internal Server Error' });         } 
              else {
          // Combine recipe, ingredients, and steps into a single JSON response**
                const response = {
                  details: recipe,
                  ingredients: ingredientsResults,
                  steps: stepsResults
                };
                res.json(response);
              }
            });
          }
        });
      }
    });
  }); 


app.get('/api/recipes/full', (req, res) => {  
    const recipeQuery = 'SELECT * FROM Recipes';
  
    connection.query(recipeQuery, (error, recipeResults) => {
      if (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
    
        const allRecipesWithDetails = [];
    
        // Use async/await to handle nested queries
        (async function fetchRecipeDetails() {
          for (const recipe of recipeResults) {
            try {
              const ingredientQuery = `SELECT * FROM Ingredients WHERE Recipe_ID = ${recipe.Recipe_ID}`;
              const stepQuery = `SELECT * FROM Steps WHERE Recipe_ID = ${recipe.Recipe_ID}`;
  
              // Use Promise.all to wait for both queries to finish
              const [ingredientsResults, stepsResults] = await Promise.all([
                new Promise((resolve, reject) => {
                  connection.query(ingredientQuery, (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                  });
                }),
                new Promise((resolve, reject) => {
                  connection.query(stepQuery, (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                  });
                })
              ]);
  
              const recipeWithDetails = {
                ...recipe,
                ingredients: ingredientsResults,
                steps: stepsResults,
              };
  
              allRecipesWithDetails.push(recipeWithDetails);
            } catch (error) {
              console.error('Error fetching details for recipe ID:', recipe.Recipe_ID, error);
              // Optionally, you can decide how to handle errors here (e.g., continue with other recipes or break)
            }
          }
          // After all recipes have been processed, send the response
          res.json(allRecipesWithDetails);
        })(); 
      }
    });
  }); 

  
// --------------------------------------------
// POST endpoint to add a new recipe
// --------------------------------------------
app.post('/api/addrecipe', (req, res) => {
  const newRecipe = req.body;

  // Start a transaction for data integrity
  connection.beginTransaction(async (err) => {
      if (err) {
          return handleError(res, err, "Failed to begin transaction");
      }

      try {
          // Insert recipe details
          const recipeInsertResult = await executeQuery(
              'INSERT INTO Recipes (Name, Servings, Prep_Time, Cook_Time, Total_Time) VALUES (?, ?, ?, ?, ?)',
              [
                  newRecipe.Name,
                  newRecipe.Servings,
                  newRecipe.Prep_Time,
                  newRecipe.Cook_Time,
                  newRecipe.Total_Time,
              ]
          );

          const recipeId = recipeInsertResult.insertId;

          // Insert ingredients
          for (const ingredient of newRecipe.ingredients) {
              await executeQuery(
                  'INSERT INTO Ingredients (Recipe_ID, Name, Quantity, Unit) VALUES (?, ?, ?, ?)',
                  [recipeId, ingredient.Name, ingredient.Quantity, ingredient.Unit]
              );
          }

          // Insert steps
          for (let i = 0; i < newRecipe.steps.length; i++) {
              await executeQuery(
                  'INSERT INTO Steps (Recipe_ID, Step_Number, Instruction) VALUES (?, ?, ?)',
                  [recipeId, i + 1, newRecipe.steps[i].Instruction]
              );
          }

          // Commit the transaction
          connection.commit((err) => {
              if (err) {
                  return handleError(res, err, "Failed to commit transaction");
              }
              res.json({ message: 'Recipe added successfully', recipeId });
          });
      } catch (err) {
          connection.rollback(() => {
              handleError(res, err, "Transaction rolled back");
          });
      }
  });
});

// Error handling helper function
function handleError(res, err, message) {
  console.error(message, err);
  res.status(500).json({ error: message });
}

// Query execution helper function with async/await
function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
          if (err) reject(err);
          else resolve(result);
      });
  });
}

// Update a recipe
app.put('/api/update/:id', (req, res) => {
  const recipeId = req.params.id;
  const updatedRecipe = req.body;

  // Use transactions (similar to your POST endpoint)
  connection.beginTransaction(async (err) => {
    if (err) return handleError(res, err, "Failed to begin transaction");

    try {
      // Update recipe details (use prepared statements to avoid SQL injection)
      await executeQuery(
          'UPDATE Recipes SET Name = ?, Servings = ?, Prep_Time = ?, Cook_Time = ?, Total_Time = ? WHERE Recipe_ID = ?',
          [
              updatedRecipe.details.Name,
              updatedRecipe.details.Servings,
              updatedRecipe.details.Prep_Time,
              updatedRecipe.details.Cook_Time,
              updatedRecipe.details.Total_Time,
              recipeId,
          ]
      );
      console.log("Recipe Updated");


      // Delete existing ingredients and steps (again, prepared statements)
      await executeQuery('DELETE FROM Ingredients WHERE Recipe_ID = ?', [recipeId]);
      await executeQuery('DELETE FROM Steps WHERE Recipe_ID = ?', [recipeId]);

      // Insert ingredients
      for (const ingredient of updatedRecipe.ingredients) {
          await executeQuery(
              'INSERT INTO Ingredients (Recipe_ID, Name, Quantity, Unit) VALUES (?, ?, ?, ?)',
              [recipeId, ingredient.Name, ingredient.Quantity, ingredient.Unit]
          );
      }

      // Insert steps
      for (let i = 0; i < updatedRecipe.steps.length; i++) {
          await executeQuery(
              'INSERT INTO Steps (Recipe_ID, Step_Number, Instruction) VALUES (?, ?, ?)',
              [recipeId, i + 1, updatedRecipe.steps[i].Instruction]
          );
      }

      connection.commit((err) => {
        if (err) return handleError(res, err, "Failed to commit transaction");
        res.json({ message: 'Recipe updated successfully' });
      });
    } catch (err) {
      connection.rollback(() => {
        handleError(res, err, "Transaction rolled back");
      });
    }
  });
});


// API endpoint to delete a recipe and its associated steps and ingredients
app.delete('/api/deleterecipe/:id', (req, res) => {
  const recipeId = req.params.id;

  // Use transactions to ensure that either all or none of the queries are executed
  connection.beginTransaction(error => {
    if (error) {
      throw error;
    }

    // Delete steps associated with the recipe
    connection.query(`DELETE FROM Steps WHERE Recipe_ID = ?`, recipeId, (error, results) => {
      if (error) {
        return connection.rollback(() => {
          throw error;
        });
      }

      // Delete ingredients associated with the recipe
      connection.query(`DELETE FROM Ingredients WHERE Recipe_ID = ?`, recipeId, (error, results) => {
        if (error) {
          return connection.rollback(() => {
            throw error;
          });
        }

        // Finally, delete the recipe itself
        connection.query(`DELETE FROM Recipes WHERE Recipe_ID = ?`, recipeId, (error, results) => {
          if (error) {
            return connection.rollback(() => {
              throw error;
            });
          }

          connection.commit(error => {
            if (error) {
              return connection.rollback(() => {
                throw error;
              });
            }

            res.send(`Recipe with ID ${recipeId} deleted successfully`);
          });
        });
      });
    });
  });
});

app.put('/api/recipes/favorite/:recipeId', (req, res) => {
  const recipeId = req.params.recipeId;

  // 1. Get current favorite status (using prepared statements to prevent SQL injection)
  const selectQuery = 'SELECT favorite FROM Recipes WHERE Recipe_ID = ?';
  connection.query(selectQuery, [recipeId], (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
          return res.status(404).json({ message: 'Recipe not found' });
      }

      const currentFavorite = results[0].favorite;

      // 2. Toggle the favorite status
      const newFavorite = !currentFavorite;

      // 3. Update the database
      const updateQuery = 'UPDATE Recipes SET favorite = ? WHERE Recipe_ID = ?';
      connection.query(updateQuery, [newFavorite, recipeId], (error, updateResults) => {
          if (error) throw error;

          res.json({ 
              message: 'Favorite status toggled successfully', 
              recipeId: recipeId, 
              favorite: newFavorite 
          });
      });
  });
});

app.get('/api/favorites', (req, res) => {
  connection.query('SELECT * FROM recipes WHERE favorite = 1', (error, recipeResults) => {
    if (error) throw error;

    const allRecipesWithDetails = [];

    // Use async/await to handle nested queries
    (async function fetchRecipeDetails() {
      for (const recipe of recipeResults) {
        try {
          const ingredientQuery = `SELECT * FROM Ingredients WHERE Recipe_ID = ${recipe.Recipe_ID}`;
          const stepQuery = `SELECT * FROM Steps WHERE Recipe_ID = ${recipe.Recipe_ID}`;

          // Use Promise.all to wait for both queries to finish
          const [ingredientsResults, stepsResults] = await Promise.all([
            new Promise((resolve, reject) => {
              connection.query(ingredientQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
              });
            }),
            new Promise((resolve, reject) => {
              connection.query(stepQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
              });
            })
          ]);

          const recipeWithDetails = {
            details: recipe,
            ingredients: ingredientsResults,
            steps: stepsResults,
          };

          allRecipesWithDetails.push(recipeWithDetails);
        } catch (error) {
          console.error('Error fetching details for recipe ID:', recipe.Recipe_ID, error);
          // Optionally, you can decide how to handle errors here (e.g., continue with other recipes or break)
        }
      }
      // After all recipes have been processed, send the response
      res.json(allRecipesWithDetails);
    })();
  });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
