const apiKey = "2c5260fbaaab48548f813524144c9082"; 
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// 🌸 fetch 3 random allergen-free recipes on page load
window.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  fetchRandomRecipes(); // 👈 this line auto-loads random recipes
});

async function fetchRandomRecipes() {
  resultsDiv.innerHTML = "<p>Loading random allergen-free recipes...</p>";
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?number=12&diet=gluten free&intolerances=peanut,tree nut,dairy,lactose&sort=random&apiKey=${apiKey}`
    );
    const data = await response.json();

    if (!response.ok || !data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p>⚠️ Couldn’t load recipes. Showing sample ones.</p>";
      displayResults(sampleRecipes);
      return;
    }

    // pick 3 random recipes from the fetched list
    const randomRecipes = data.results.sort(() => 0.5 - Math.random()).slice(0, 3);

    // fetch full info for allergen detection
    const detailedRecipes = await Promise.all(
      randomRecipes.map(async recipe => {
        try {
          const res = await fetch(
            `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false&apiKey=${apiKey}`
          );
          return await res.json();
        } catch {
          return recipe;
        }
      })
    );

    displayResults(detailedRecipes);
  } catch (err) {
    console.error("API error:", err);
    resultsDiv.innerHTML = "<p>⚠️ Network/API error. Showing sample recipes.</p>";
    displayResults(sampleRecipes);
  }
}
