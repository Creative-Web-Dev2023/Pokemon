const MaxPokemon = 151;
const listWrapper = document.getElementById('list-wrapper');
const searchInput = document.getElementById('search-input');
const numberFilter = document.getElementById('number');
const nameFilter =document.getElementById('name');
const notFoundMessage = document.getElementById('not-found-message');

let allPokemons = [];

async function fetchPokemons() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await response.json();
    allPokemons = data.results;
    renderPokemons(allPokemons);
    }

function renderPokemons(pokemons) {
    listWrapper.innerHTML = '';
    pokemons.forEach((pokemon, index) => {
        const pokemonId = pokemon.url.split('/')[6]; // Get the pokemon id from the url
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonId}</p>
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" alt="${pokemon.name}" />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>
        `;
        listWrapper.appendChild(listItem); // Add the Pokemon to the list   
    });
}
function filterPokemons() {
    const searchValue = searchInput.value.toLowerCase();
    const filteredPokemons = allPokemons.filter(pokemon => pokemon.name.startsWith(searchValue));
    renderPokemons(filteredPokemons);
    if (filteredPokemons.length === 0) {  // If filteredPokemons is empty, show the not found message
        notFoundMessage.style.display = 'block';   // 
    } else {
        notFoundMessage.style.display = 'none'; // If filteredPokemons is not empty, hide the not found message
    }
}

searchInput.addEventListener('input', filterPokemons); // Add the event listener to the input element

fetchPokemons();


function sortNumber() {
    allPokemons.sort((x, y) => {
        const xId =parseInt(x.url.split('/')[6]); // Split the url and get the id
        const yId = parseInt(x.url.split('/')[6]);
        return xId - yId; // Compare the ids numerically
    });
}

   