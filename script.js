const apiKey = "2c5260fbaaab48548f813524144c9082"; // 🔑 Replace with your Spoonacular key
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const cuisineSelect = document.getElementById("cuisineSelect");
const recipesDiv = document.getElementById("recipes");

searchBtn.addEventListener("click", () => {
  let query = searchInput.value.trim();
  let cuisine = cuisineSelect.value;
  fetchRecipes(query, cuisine);
});

async function fetchRecipes(query) {
  resultsDiv.innerHTML = "<p>Loading...</p>";
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=9&apiKey=${apiKey}`
    );
    const data = await response.json();
    console.log("API Response:", data);

    // If API fails or no results
    if (!response.ok || !data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p>⚠️ API limit reached or no results. Showing sample recipes.</p>";
      displayResults(sampleRecipes);
      return;
    }

    displayResults(data.results);

  } catch (error) {
    console.error("Fetch error:", error);
    resultsDiv.innerHTML = "<p>⚠️ Network/API error. Showing sample recipes.</p>";
    displayResults(sampleRecipes);
  }
}

  resultsDiv.innerHTML = recipes.map(recipe => {
    // If recipe.image is missing, use default
    const imgSrc = recipe.image 
      ? recipe.image 
      : "https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png";

    return `
      <div class="recipe-card">
        <img src="${imgSrc}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <a href="https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}" 
           target="_blank">View Recipe</a>
      </div>
    `;
  }).join("");



function displayRecipes(recipes, query, cuisine) {
  recipesDiv.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    let message = "<p>No recipes found.";
    if (cuisine) message += ` Try searching with different ingredients for ${cuisine} cuisine.`;
    else if (query) message += ` Try searching with simpler ingredients like 'chicken', 'rice', or 'paneer'.`;
    message += "</p>";
    recipesDiv.innerHTML = message;
    return;
  }

  recipes.forEach((recipe) => {
    const div = document.createElement("div");
    div.classList.add("recipe");
    div.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}">
      <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
    `;
    recipesDiv.appendChild(div);
  });
}
