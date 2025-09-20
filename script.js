const apiKey = "2c5260fbaaab48548f813524144c9082"; 
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const darkModeToggle = document.getElementById("dark-mode-toggle");

const sampleRecipes = [
  { id:1, title:"Chicken Biryani", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/chicken-biryani/", extendedIngredients: [{name: "chicken"}, {name: "milk"}] },
  { id:2, title:"Paneer Butter Masala", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/paneer-butter-masala/", extendedIngredients: [{name: "paneer"}, {name: "cream"}] },
  { id:3, title:"Masala Dosa", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/masala-dosa-recipe/", extendedIngredients: [{name: "rice"}, {name: "egg"}] }
];

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkModeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchRecipes(query);
});

// Trigger search on Enter key
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) fetchRecipes(query);
  }
});

// Get allergens from ingredients
function getAllergens(ingredients) {
  const allergenMap = {
    milk: "🥛",
    cream: "🥛",
    egg: "🥚",
    fish: "🐟",
    shellfish: "🦐",
    peanut: "🥜",
    "tree nut": "🌰",
    wheat: "🌾",
    soy: "🌱"
  };

  const allergensFound = [];
  ingredients.forEach(ing => {
    const name = ing.name.toLowerCase();
    Object.keys(allergenMap).forEach(allergen => {
      if (name.includes(allergen) && !allergensFound.includes(allergen)) {
        allergensFound.push(allergen);
      }
    });
  });

  return allergensFound.map(allergen => ({
    emoji: allergenMap[allergen],
    tooltip: allergen.charAt(0).toUpperCase() + allergen.slice(1) + " Allergen"
  }));
}

async function fetchRecipes(query) {
  resultsDiv.innerHTML = "<p>Loading...</p>";
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=9&addRecipeInformation=true&apiKey=${apiKey}`
    );
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

function displayResults(recipes) {
  resultsDiv.innerHTML = recipes.map(recipe => {
    const imgSrc = recipe.image || "https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png";
    const url = recipe.sourceUrl || "#";

    const ingredients = recipe.extendedIngredients || [];
    const allergens = getAllergens(ingredients);
    const allergenHTML = allergens.map(a => `<span class="allergen" title="${a.tooltip}">${a.emoji}</span>`).join('');

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
