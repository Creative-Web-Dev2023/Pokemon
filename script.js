const MaxPokemon = 200;
const listWrapper = document.getElementById("list-wrapper");
const searchInput = document.getElementById("search-input");
const numberFilter = document.getElementById("number");
const nameFilter = document.getElementById("name");
const notFoundMessage = document.getElementById("not-found-message");
const loadingDiv = document.getElementById("loadscreen-div");
const loadMoreButton = document.getElementById("load-more-button"); // Load More Button
let limit = 70;
let offset = 0;
let allPokemonsWithId = [];

window.onload = async () => {
  init();
};

function init() {
  if (loadingDiv) {
    loadingDiv.classList.toggle("d-none");
  }
  fetchPokemons().then(() => {
    renderPokemons(allPokemonsWithId.slice(0, limit));
    setTimeout(() => {
      if (loadingDiv) {
        loadingDiv.classList.toggle("d-none");
      }
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
  let filteredPokemons;
  if (numberFilter.checked) {
    filteredPokemons = allPokemonsWithId.filter(
      (pokemon) => pokemon.id.toString() === searchValue
    );
  } else {
    filteredPokemons = allPokemonsWithId.filter((pokemon) => pokemon.name.startsWith(searchValue));
  }
  listWrapper.innerHTML = "";
  renderPokemons(filteredPokemons);
  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

loadMoreButton.addEventListener("click", loadMorePokemon);

function loadMorePokemon() {
  offset += limit;
  const nextPokemons = allPokemonsWithId.slice(offset, offset + limit);
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
  const loadingSpinner = document.getElementById("loading-spinner");
  if (action === 'show') {
    loadingSpinner.classList.remove('d-none');
  } else if (action === 'hide') {
    loadingSpinner.classList.add('d-none');
  }
}
