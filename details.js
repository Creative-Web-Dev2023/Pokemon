document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search); // Get the URL search parameters
    const pokemonId = urlParams.get('pokemonId'); // Get the pokemonId from the URL
    if (pokemonId) {
        const pokemon = await fetchPokemonById(parseInt(pokemonId, 10)); // Ensure pokemonId is parsed 
        displayPokemonDetails(pokemon); // Display the Pokemon details
        document.getElementById('leftArrow').addEventListener('click', async () => { // Add an event listener to the left arrow
            if (pokemon.id > 1) { // Check if the ID is greater than 1 to avoid negative IDs
                await navigatePokemon(pokemon.id, -1); // Navigate to the previous Pokemon
            }
        }); 
        document.getElementById('rightArrow').addEventListener('click', async () => { // Add an event listener to the right arrow
            await navigatePokemon(pokemon.id, +1);  // Navigate to the next Pokemon
        }); 
    }
});

async function fetchPokemonById(id) { // Function to fetch a Pokemon by ID
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`); // Fetch the Pokemon data from the API
    const pokemon = await response.json();   // Convert the response to JSON
    return pokemon;       // Return the Pokemon data
}

function displayPokemonDetails(pokemon) {  // Function to display the Pokemon details
    setBasicPokemonDetails(pokemon);  //   Set the basic Pokemon details
    setPokemonStats(pokemon);    // Set the Pokemon stats
}

function setBasicPokemonDetails(pokemon) {
    document.querySelector(".name").textContent = pokemon.name;  // Set the Pokemon name
    document.querySelector(".pokemon-id-wrap p").textContent = `#${pokemon.id}`; // Set the Pokemon ID
    document.querySelector(".detail-img-wrapper img").src = pokemon.sprites.other['official-artwork'].front_default;  // Set the Pokemon image
    const types = pokemon.types.map(typeInfo => typeInfo.type.name);   // Get the Pokemon types
    const typeElements = document.querySelectorAll(".type");   // Get the type elements
    typeElements.forEach((element, index) => {  // Iterate over the type elements
        if (types[index]) {
            element.textContent = types[index];  // Set the text content of the element to the type
            element.style.backgroundColor = getContrastingColor(getTypeColor(types[index]));  // Set the background color of the element to the contrasting color of the type
        } else {
            element.textContent = '';  // Set the text content of the element to an empty string
        }
    });
    document.querySelector(".weight").textContent = `${pokemon.weight / 10} kg`;  // Set the weight of the Pokemon
    document.querySelector(".height").textContent = `${pokemon.height / 10} m`;   // Set the height of the Pokemon
    const moveName = pokemon.moves[0]?.move.name || 'N/A';   // Get the first move name or set it to 'N/A' if it doesn't exist
    document.querySelector(".move").textContent = moveName.charAt(0).toUpperCase() + moveName.slice(1).toLowerCase(); // Set the move name
    document.querySelector(".pokemon-description").textContent = pokemon.species.name; // Set the Pokemon description	
    const primaryTypeColor = getTypeColor(types[0]); // Get the color of the first type
    document.querySelector(".detail-card-detail-wrapper").style.backgroundColor = primaryTypeColor; // Set background color of the card to the first type color
}

function setPokemonStats(pokemon) {
    const stats = pokemon.stats;  // Get the Pokemon stats
    const statElements = document.querySelectorAll(".stats-wrap"); // Get the stat elements
    statElements.forEach(statElement => {   // Iterate over the stat elements
        const statName = statElement.getAttribute("data-stat").toLowerCase().replace("-", "_"); // Get the stat name and convert it to lowercase and replace '-' with '_'
        const mappedStatName = statNameMapping[statName]; // Get the mapped stat name
        const statValue = stats.find(stat => stat.stat.name === statName)?.base_stat || 0;  // Get the stat value or set it to 0 if it doesn't exist

        if (mappedStatName) {
            statElement.querySelector("p.body3-fonts").textContent = `${mappedStatName}: ${statValue}`; // Set the text content of the element to the mapped stat name and value
            const progressBar = statElement.querySelector("progress");  // Get the progress bar element
            progressBar.value = statValue;   // Set the value of the progress bar
            progressBar.max = 100; // Set the max value of the progress bar
            progressBar.style.setProperty('--progress-bar-color', getTypeColor(pokemon.types[0].type.name)); // Set the color of the progress bar
        }
    });
}

const statNameMapping = {  // Object to map the stat names
    hp: "HP",
    attack: "ATTACK",
    defense: "DEFENSE",
    "special-attack": "SPECIAL ATTACK", 
    "special-defense": "SPECIAL DEFENSE", 
    speed: "SPEED"
};

function getTypeColor(type) {  // Function to get the color of a type
    const typeColors = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0"
    };
    return typeColors[type] || "#777"; // Return a default color if no match is found
}

function getContrastingColor(color) { // Function to get a contrasting color
    const contrastColors = {
        "#A8A878": "#6A6A5E",
        "#F08030": "#D2691E",
        "#6890F0": "#4682B4",
        "#F8D030": "#D4AF37",
        "#78C850": "#556B2F",
        "#98D8D8": "#76A5AF",
        "#C03028": "#8B0000",
        "#A040A0": "#6B3A8C",
        "#E0C068": "#B8860B",
        "#A890F0": "#9370DB",
        "#F85888": "#FF69B4",
        "#A8B820": "#6B8E23",
        "#B8A038": "#8B6914",
        "#705898": "#483D8B",
        "#7038F8": "#4B0082",
        "#705848": "#4E4E32",
        "#B8B8D0": "#696969"
    };
    return contrastColors[color] || "#333"; // Return a default color if no match is found
}

async function navigatePokemon(currentId, direction) {
    const newId = parseInt(currentId, 10) + direction; // Ensure currentId is parsed as a base-10 integer
    if (newId > 0) {
        try {
            const newPokemon = await fetchPokemonById(newId);  // Fetch the new Pokemon
            displayPokemonDetails(newPokemon); // Display the new Pokemon details
            window.history.pushState(null, null, `?pokemonId=${newId}`); // Update the URL with the new Pokemon ID
        } catch (error) {
            console.error("Error fetching Pokemon:", error);
        }
    }
}
