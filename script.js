const apiKey = "2c5260fbaaab48548f813524144c9082"; 
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const darkModeToggle = document.getElementById("dark-mode-toggle");

const sampleRecipes = [
  { id:1, title:"Chicken Biryani", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/chicken-biryani/" },
  { id:2, title:"Paneer Butter Masala", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/paneer-butter-masala/" },
  { id:3, title:"Masala Dosa", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/masala-dosa-recipe/" }
];

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkModeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Search on button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchRecipes(query);
});

// Search on Enter key
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) fetchRecipes(query);
  }
});

// Fetch recipes
async function fetchRecipes(query) {
  resultsDiv.innerHTML = "<p>Loading...</p>";
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=9&addRecipeInformation=false&apiKey=${apiKey}`
    );
    const data = await response.json();

    if (!response.ok || !data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p>⚠️ API limit reached or no results. Showing sample recipes.</p>";
      displayResults(sampleRecipes);
      return;
    }

    // Fetch full info for each recipe to get allergens
    const detailedRecipes = await Promise.all(
      data.results.map(async recipe => {
        try {
          const res = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false&apiKey=${apiKey}`);
          const fullInfo = await res.json();
          return fullInfo;
        } catch {
          return recipe; // fallback to basic recipe if detailed fetch fails
        }
      })
    );

    displayResults(detailedRecipes);
  } catch {
    resultsDiv.innerHTML = "<p>⚠️ Network/API error. Showing sample recipes.</p>";
    displayResults(sampleRecipes);
  }
}

// Map common allergens to emojis
function getAllergenEmojis(recipeInfo) {
  const emojis = [];
  const ingredients = recipeInfo.extendedIngredients || [];

  const ingredientNames = ingredients.map(i => i.name.toLowerCase());

  if (ingredientNames.some(n => n.includes("milk") || n.includes("cheese") || n.includes("cream"))) emojis.push(`<span title="Dairy 🥛">🥛</span>`);
  if (ingredientNames.some(n => n.includes("egg"))) emojis.push(`<span title="Egg 🥚">🥚</span>`);
  if (ingredientNames.some(n => n.includes("peanut") || n.includes("peanuts"))) emojis.push(`<span title="Peanut 🥜">🥜</span>`);
  if (ingredientNames.some(n => n.includes("wheat") || n.includes("flour") || n.includes("bread"))) emojis.push(`<span title="Gluten 🌾">🌾</span>`);
  if (ingredientNames.some(n => n.includes("fish") || n.includes("salmon") || n.includes("tuna"))) emojis.push(`<span title="Fish 🐟">🐟</span>`);
  if (ingredientNames.some(n => n.includes("shellfish") || n.includes("shrimp") || n.includes("crab"))) emojis.push(`<span title="Shellfish 🦐">🦐</span>`);

  return emojis.join(" ");
}

// Display recipes
function displayResults(recipes) {
  resultsDiv.innerHTML = recipes.map(recipe => {
    const imgSrc = recipe.image || "https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png";
    const url = recipe.sourceUrl || "#";

    const allergenHTML = getAllergenEmojis(recipe);

    return `
      <div class="recipe-card">
        <img src="${imgSrc}" alt="${recipe.title}">
        <div class="recipe-content">
          <h3>${recipe.title}</h3>
          <div class="allergens">${allergenHTML}</div>
          <a href="${url}" target="_blank" class="view-recipe-btn">View Recipe</a>
        </div>
      </div>
    `;
  }).join("");
}
