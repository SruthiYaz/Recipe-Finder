const apiKey = "uwu"; // 🔑 Replace with your Spoonacular key
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const darkModeToggle = document.getElementById("dark-mode-toggle");

const sampleRecipes = [
  { id:1, title:"Chicken Biryani", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/chicken-biryani/" },
  { id:2, title:"Paneer Butter Masala", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/paneer-butter-masala/" },
  { id:3, title:"Masala Dosa", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/masala-dosa-recipe/" }
];

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkModeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Search Button
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchRecipes(query);
});

// Fetch Recipes
async function fetchRecipes(query) {
  resultsDiv.innerHTML = "<p>Loading...</p>";
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=9&addRecipeInformation=true&apiKey=${apiKey}`);
    const data = await response.json();

    if (!response.ok || !data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p>⚠️ API limit reached or no results. Showing sample recipes.</p>";
      displayResults(sampleRecipes);
      return;
    }

    displayResults(data.results);
  } catch {
    resultsDiv.innerHTML = "<p>⚠️ Network/API error. Showing sample recipes.</p>";
    displayResults(sampleRecipes);
  }
}

// Display Recipes
function displayResults(recipes) {
  resultsDiv.innerHTML = recipes.map(recipe => {
    const imgSrc = recipe.image || "https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png";
    const url = recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replace(/ /g,"-")}-${recipe.id}`;
    return `
      <div class="recipe-card">
        <img src="${imgSrc}" alt="${recipe.title}">
        <div class="recipe-content">
          <h3>${recipe.title}</h3>
          <a href="${url}" target="_blank">View Recipe</a>
        </div>
      </div>
    `;
  }).join("");
}
