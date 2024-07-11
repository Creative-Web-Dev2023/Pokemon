const MaxPokemon = 151;
const listWrapper = document.getElementById("list-wrapper");
const searchInput = document.getElementById("search-input");
const numberFilter = document.getElementById("number");
const nameFilter = document.getElementById("name");
const notFoundMessage = document.getElementById("not-found-message");
const loadingDiv = document.getElementById("loadscreen-div"); // Loading Screen is always here
const loadingSpinner = document.getElementById("loading-spinner");
let limit = 70;
let offset = 0;
let allPokemonsWithId = [];

window.onload = async () => { // Wait for the window to be fully loaded
 if (loadingDiv) {
    loadingDiv.classList.toggle("d-none"); // Immediately show the loading screen
 }
 await fetchPokemons(); // Fetch the Pokémon data
 renderPokemons(allPokemonsWithId); // Render the Pokémon list
 setTimeout(() => {
    if (loadingDiv) {
        loadingDiv.classList.toggle("d-none"); // Hide the loading screen after 3 seconds
    }
 }, 3000);
};

async function fetchPokemons() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  const allPokemons = data.results;
  allPokemons.forEach((pokemon, index) => {
    const id = index + 1;
    allPokemonsWithId.push({ ...pokemon, id });
  });
}

function renderPokemons(pokemons) {
  listWrapper.innerHTML = "";
  pokemons.forEach((pokemon, index) => {
    const pokemonId = pokemon.url.split("/")[6]; // Hole die Pokemon-ID aus der URL
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = getPokemonHtml(pokemonId,capitalizeFirstLetter(pokemon.name) );
    listItem.addEventListener("click",() => (window.location.href = `details.html?pokemonId=${pokemonId}`));// Weiterleitung zur Detailseite 
    listWrapper.appendChild(listItem); // Füge das Pokemon zur Liste hinzu
  });
}

function getPokemonHtml(pokemonId, pokemonName) {
  return `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonId}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" alt="${pokemonName}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">${pokemonName}</p>
        </div>
    `;
}

function capitalizeFirstLetter(string) {// This function capitalizes the first letter of a given string
  return string.charAt(0).toUpperCase() + string.slice(1); // Capitalize the first letter of the string
}

searchInput.addEventListener("input", filterPokemons); // Add the event listener to the input element

function filterPokemons() {
  const searchValue = searchInput.value.toLowerCase(); 
  let filteredPokemons;
  if (numberFilter.checked) {
    filteredPokemons = allPokemonsWithId.filter(// If number filter is checked, perform exact ID match
      (pokemon) => pokemon.id.toString() === searchValue);
  } else {
    filteredPokemons = allPokemonsWithId.filter((pokemon) => pokemon.name.startsWith(searchValue)
    );
  }
  renderPokemons(filteredPokemons);
  if (filteredPokemons.length === 0) {// If filteredPokemons is empty, show the not found message
     notFoundMessage.style.display = "block"; //
  } else {
     notFoundMessage.style.display = "none"; // If filteredPokemons is not empty, hide the not found message
  }
}

function loadMorePokemon() {
    showLoadingSpinner();
    offset += limit;
    fetchPokemons().then(() => {
      renderPokemons(allPokemonsWithId);
      hideLoadingSpinner();
    });
  }
  
function sortNumber() {
  allPokemonsWithId.sort((x, y) => {
    const xId = parseInt(x.url.split("/")[6]); // Split the url and get the id
    const yId = parseInt(y.url.split("/")[6]); // parsing from x, now is Y
    return xId - yId; // Compare the ids numerically
  });
  renderPokemons(allPokemonsWithId);
}

async function fetchPokemonById(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();
  return pokemon;
}

function showLoadingSpinner() {
  if (loadingSpinner) {
    loadingSpinner.classList.remove("d-none");
  }
}

function hideLoadingSpinner() {
  if (loadingSpinner) {
    loadingSpinner.classList.add("d-none");
  }
}
