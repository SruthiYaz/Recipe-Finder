const apiKey = "2c5260fbaaab48548f813524144c9082"; 
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Modal elements
const recipeModal = document.getElementById("recipe-modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalImg = document.getElementById("modal-img");
const modalSummary = document.getElementById("modal-summary");
const modalLink = document.getElementById("modal-link");

const sampleRecipes = [
  { id:1, title:"Chicken Biryani", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/chicken-biryani/" },
  { id:2, title:"Paneer Butter Masala", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/paneer-butter-masala/" },
  { id:3, title:"Masala Dosa", image:"https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png", sourceUrl:"https://www.indianhealthyrecipes.com/masala-dosa-recipe/" }
];

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkModeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Search button
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchRecipes(query);
});

// Fetch recipes
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

// Display recipe cards
function displayResults(recipes) {
  resultsDiv.innerHTML = recipes
    .map((recipe) => {
      const imgSrc =
        recipe.image ||
        "https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png";
      return `
        <div class="recipe-card">
          <img src="${imgSrc}" alt="${recipe.title}">
          <div class="recipe-content">
            <h3>${recipe.title}</h3>
            <button onclick="openRecipeModal(${recipe.id})">View Recipe</button>
          </div>
        </div>
      `;
    })
    .join("");
}

async function openRecipeModal(id) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    );
    const data = await response.json();

    modalTitle.textContent = data.title || "Untitled Recipe";

    modalImg.src =
      data.image ||
      "https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png";
    modalImg.alt = data.title || "Recipe image";

    modalSummary.innerHTML =
      data.summary || "<em>Summary unavailable.</em>";

    if (data.sourceUrl) {
      modalLink.href = data.sourceUrl;
      modalLink.style.display = "inline-block";
    } else {
      modalLink.style.display = "none";
    }

    recipeModal.style.display = "flex";
  } catch (err) {
    alert("⚠️ Could not load recipe details.");
  }
}


// Close modal
closeModal.addEventListener("click", () => {
  recipeModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === recipeModal) recipeModal.style.display = "none";
});
