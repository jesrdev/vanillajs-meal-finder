//--DOM elements
const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const singleMealEl = document.getElementById("single-meal");

//--Event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});

//--Functions

//Fetch meal from API with keywords
function searchMeal(e) {
  e.preventDefault();

  //Clear Single meal section
  singleMealEl.innerHTML = "";

  //Get search term
  const term = search.value;

  //Check for empty field
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `
        <h2>Search result for \'${term}\': </h2>
        `;

        if (data.meals === null) {
          resultHeading.innerHTML =
            "<p>There are no search results. Try again!</p>";
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                    <div class="meal-info" data-mealid="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            `
            )
            .join("");
        }
      });
    //Clear search text
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

//Fetch meal by id
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

//Fetch random meal
function getRandomMeal() {
  //Clear meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

//Add meal to dom
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} -- ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealEl.innerHTML = `
    <article class="single-meal">
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
         <div class="single-meal-info">
            ${meal.strCategory ? `<h4>${meal.strCategory}</h4>` : ""}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
         </div>
         <div class="main">
            <p>${meal.strInstructions}</p>
            <h3>Ingredients</h3>
            <ul>
                ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
            </ul>
         </div>
    </article>
  `;
}
