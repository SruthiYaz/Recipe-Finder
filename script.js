const apiKey = "2c5260fbaaab48548f813524144c9082"; 
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const darkModeToggle = document.getElementById("dark-mode-toggle");

const sampleRecipes = [
  { 
    id:1, title:"Chicken Biryani", 
    image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", 
    sourceUrl:"https://www.indianhealthyrecipes.com/chicken-biryani/", 
    ingredients: ["chicken", "milk", "rice"] 
  },
  { 
    id:2, title:"Paneer Butter Masala", 
    image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", 
    sourceUrl:"https://www.indianhealthyrecipes.com/paneer-butter-masala/", 
    ingredients: ["paneer", "cream", "butter"] 
  },
  { 
    id:3, title:"Masala Dosa", 
    image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", 
    sourceUrl:"https://www.indianhealthyrecipes.com/masala-dosa-recipe/", 
    ingredients: ["rice", "egg", "oil"] 
  }
];

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkModeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchRecipes(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) fetchRecipes(query);
  }
});

// Allergen mapping
const allergenMap = {
  milk: "🥛",
  cream: "🥛",
  egg: "🥚",
  fish: "🐟",
  shellfish: "🦐",
  peanut: "🥜",
  "tree nut": "🌰",
  wheat: "🌾",
  soy: "🌱",
  butter: "🧈",
  cheese: "🧀"
};

// Get allergen emojis for a recipe
function getAllergenEmojis(ingredients) {
  if (!ingredients) return [];
  const found = [];
  ingredients.forEach(item => {
    const lower = item.toLowerCase();
    for (const allergen in allergenMap) {
      if (lower.includes(allergen) && !found.includes(allergen)) {
        found.push(allergen);
      }
    }
  });
  return found.map(a => `<span class="allergen" title="${a.charAt(0).toUpperCase() + a.slice(1)} allergen">${allergenMap[a]}</span>`).join('');
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

    // Map API results to have 'ingredients' array
    const recipes = data.results.map(r => ({
      title: r.title,
      image: r.image,
      sourceUrl: r.sourceUrl,
      ingredients: r.extendedIngredients ? r.extendedIngredients.map(i => i.name) : []
    }));

    displayResults(recipes);
  } catch {
    resultsDiv.innerHTML = "<p>⚠️ Network/API error. Showing sample recipes.</p>";
    displayResults(sampleRecipes);
  }
}

function displayResults(recipes) {
  resultsDiv.innerHTML = recipes.map(recipe => {
    const imgSrc = recipe.image || "https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png";
    const url = recipe.sourceUrl || "#";
    const allergensHTML = getAllergenEmojis(recipe.ingredients);

    return `
      <div class="recipe-card">
        <img src="${imgSrc}" alt="${recipe.title}">
        <div class="recipe-content">
          <h3>${recipe.title}</h3>
          <div class="allergens">${allergensHTML}</div>
          <a href="${url}" target="_blank" class="view-recipe-btn">View Recipe</a>
        </div>
      </div>
    `;
  }).join("");
}
