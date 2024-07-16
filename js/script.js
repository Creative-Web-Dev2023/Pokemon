const MaxPokemon = 200;
const listWrapper = document.getElementById("list-wrapper");
const searchInput = document.getElementById("search-input");
const numberFilter = document.getElementById("number");
const nameFilter = document.getElementById("name");
const notFoundMessage = document.getElementById("not-found-message");
const loadingDiv = document.getElementById("loadscreen-div");
const loadMoreButton = document.getElementById("load-more-button");
const backToTopButton = document.getElementById('back_to_top_button');
const scrollDownButton = document.getElementById('scroll_down_button');

let limit = 70;
let offset = 0;
let allPokemonsWithId = [];
let currentPokemons = [];

window.onload = async () => { 
  init();
};


function init() {
  showOrHideLoadingSpinner('show');
  fetchPokemons().then(() => {
    currentPokemons = allPokemonsWithId.slice(0, limit);
    renderPokemons(currentPokemons);
    setTimeout(() => {
      showOrHideLoadingSpinner('hide');
    }, 3000);
  });
}


async function fetchPokemons() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MaxPokemon}&offset=0`);
  const data = await response.json();
  const allPokemons = data.results;
  allPokemons.forEach((pokemon, index) => {
    const id = index + 1;
    allPokemonsWithId.push({ ...pokemon, id });
  });
}


function renderPokemons(pokemons) {
  pokemons.forEach((pokemon) => {
    const pokemonId = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = getPokemonHtml(pokemonId, capitalizeFirstLetter(pokemon.name));
    listItem.addEventListener("click", () => (window.location.href = `details.html?pokemonId=${pokemonId}`));
    listWrapper.appendChild(listItem);
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


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
searchInput.addEventListener("input", filterPokemons);


function filterPokemons() {
  const searchValue = searchInput.value.toLowerCase();
  const filteredPokemons = numberFilter.checked ? 
    allPokemonsWithId.filter(pokemon => pokemon.id.toString() === searchValue) : 
    allPokemonsWithId.filter(pokemon => pokemon.name.startsWith(searchValue));
  currentPokemons = filteredPokemons;
  listWrapper.innerHTML = "";
  renderPokemons(filteredPokemons);
  notFoundMessage.style.display = filteredPokemons.length === 0 ? "block" : "none";
}
if (loadMoreButton) {
  loadMoreButton.addEventListener("click", loadMorePokemon);
}


function loadMorePokemon() {
  offset += limit;
  const nextPokemons = allPokemonsWithId.slice(offset, offset + limit);
  currentPokemons = [...currentPokemons, ...nextPokemons];
  renderPokemons(nextPokemons);
}


function sortNumber() {
  allPokemonsWithId.sort((x, y) => {
    const xId = parseInt(x.url.split("/")[6]);
    const yId = parseInt(y.url.split("/")[6]);
    return xId - yId;
  });
  listWrapper.innerHTML = "";
  renderPokemons(allPokemonsWithId.slice(0, offset + limit));
}


async function fetchPokemonById(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();
  return pokemon;
}


function showOrHideLoadingSpinner(action) {
  if (action === 'show') {
    loadingDiv.classList.remove('d-none');
  } else if (action === 'hide') {
    loadingDiv.classList.add('d-none');
  }
}




