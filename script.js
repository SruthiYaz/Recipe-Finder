const apiKey = "2c5260fbaaab48548f813524144c9082"; 
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// fallback image
const defaultImg = "https://d29fhpw069ctt2.cloudfront.net/clipart/101307/preview/iammisc_Dinner_Plate_with_Spoon_and_Fork_preview_6a8b.png";

const sampleRecipes = [
  { id:1, title:"Chicken Biryani", image:defaultImg, sourceUrl:"https://www.indianhealthyrecipes.com/chicken-biryani/" },
  { id:2, title:"Paneer Butter Masala", image:defaultImg, sourceUrl:"https://www.indianhealthyrecipes.com/paneer-butter-masala/" },
  { id:3, title:"Masala Dosa", image:defaultImg, sourceUrl:"https://www.indianhealthyrecipes.com/masala-dosa-recipe/" }
];

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkModeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Search
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchRecipes(query);
});

async function fetchRecipes(query) {
  resultsDiv.innerHTML = "<p>Loading...</p>";
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=9&apiKey=${apiKey}`
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
    const imgSrc = recipe.image || defaultImg;
    return `
      <div class="recipe-card">
        <img src="${imgSrc}" alt="${recipe.title}">
        <div class="recipe-content">
          <h3>${recipe.title}</h3>
          <button onclick="openRecipeModal(${recipe.id})">View Recipe</button>
        </div>
      </div>
    `;
  }).join("");
}

// Modal HTML
const modalHTML = `
<div id="recipe-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:1000;justify-content:center;align-items:center;">
  <div style="position:relative;width:90%;max-width:800px;background:white;border-radius:15px;padding:20px;overflow-y:auto;max-height:90%;">
    <button onclick="closeRecipeModal()" style="position:absolute;top:10px;right:10px;z-index:10;padding:5px 10px;font-size:1.2rem;">✖</button>
    <h2 id="modal-title"></h2>
    <img id="modal-img" src="" alt="" style="width:100%;border-radius:10px;margin:15px 0;">
    <p id="modal-summary"></p>
    <a id="modal-link" href="#" target="_blank" style="display:inline-block;margin-top:10px;padding:10px 14px;background:#ff6f61;color:white;border-radius:8px;text-decoration:none;">View Full Recipe</a>
  </div>
</div>
`;
document.body.insertAdjacentHTML("beforeend", modalHTML);

const recipeModal = document.getElementById("recipe-modal");
const modalTitle = document.getElementById("modal-title");
const modalImg = document.getElementById("modal-img");
const modalSummary = document.getElementById("modal-summary");
const modalLink = document.getElementById("modal-link");

async function openRecipeModal(id) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    );
    const data = await response.json();

    modalTitle.textContent = data.title || "Untitled Recipe";
    modalImg.src = data.image || defaultImg;
    modalImg.alt = data.title || "Recipe image";
    modalSummary.innerHTML = data.summary || "<em>No summary available.</em>";

    if (data.sourceUrl) {
      modalLink.href = data.sourceUrl;
      modalLink.style.display = "inline-block";
    } else {
      modalLink.style.display = "none";
    }

    recipeModal.style.display = "flex";
  } catch {
    alert("⚠️ Could not load recipe details.");
  }
}

function closeRecipeModal() {
  recipeModal.style.display = "none";
}
