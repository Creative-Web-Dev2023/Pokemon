const MaxPokemon = 151;
const listWrapper = document.getElementById('list-wrapper');
const searchInput = document.getElementById('search-input');
const numberFilter = document.getElementById('number');
const nameFilter = document.getElementById('name');
const notFoundMessage = document.getElementById('not-found-message');
const loadingDiv = document.getElementById('loadscreen-div'); // Loading Screen is always here

let allPokemonsWithId = [];

document.addEventListener("DOMContentLoaded", async () => {
    loadingDiv.classList.toggle('d-none'); // Immediately show the loading screen
    await fetchPokemons();
    renderPokemons(allPokemonsWithId);
    setTimeout(() => {
        loadingDiv.classList.toggle('d-none');
    }, 3000); 
})

async function fetchPokemons() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await response.json();
    const allPokemons = data.results;
    allPokemons.forEach((pokemon, index) => {
        const id = index + 1;
        allPokemonsWithId.push({ ...pokemon, id });
    });
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
                <p class="body3-fonts">${pokemon.name}</p>
            </div>
        `;
        listItem.addEventListener('click', () => window.location.href = `details.html?pokemonId=${pokemonId}`); // Redirect to details page
        listWrapper.appendChild(listItem); // Add the Pokemon to the list   
    });
}

searchInput.addEventListener('input', filterPokemons); // Add the event listener to the input element

function filterPokemons() {   // Filter the Pokémon by the search input
    const searchValue = searchInput.value.toLowerCase(); //
    let filteredPokemons;
    if (numberFilter.checked) {
        filteredPokemons = allPokemonsWithId.filter(pokemon => // If number filter is checked, perform exact ID match
            pokemon.id.toString() === searchValue
        );
    } else {
        filteredPokemons = allPokemonsWithId.filter(pokemon => // If name filter is checked, perform name search
            pokemon.name.startsWith(searchValue)
        );
    }
    renderPokemons(filteredPokemons);
    if (filteredPokemons.length === 0) {  // If filteredPokemons is empty, show the not found message
        notFoundMessage.style.display = 'block';   // 
    } else {
        notFoundMessage.style.display = 'none'; // If filteredPokemons is not empty, hide the not found message
    }
}

function sortNumber(){
    allPokemonsWithId.sort((x,y) =>{
       const xId =parseInt(x.url.split("/")[6]); // Split the url and get the id
       const yId =parseInt(y.url.split("/")[6]); // parsing from x, now is Y
       return xId - yId; // Compare the ids numerically
    });
    renderPokemons(allPokemonsWithId);
}

async function fetchPokemonById(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();
    return pokemon;
}
