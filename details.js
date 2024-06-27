let pokemonId;


async function initialisierePokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search); // Get the URL search parameters
    pokemonId = urlParams.get('pokemonId');   // Get the Pokémon ID from the URL search parameters
    if (pokemonId) {
        pokemonId = parseInt(pokemonId, 10); // Parse the Pokémon ID as an integer
        const pokemon = await fetchPokemonById(pokemonId);  // Fetch the Pokémon data by ID
        if (pokemon) {
            displayPokemonDetails(pokemon);
            setupNavigation();
        } else {
            console.error("Fehler beim Abrufen der Pokémon-Daten");
        }
    }
}


async function fetchPokemonById(id) {
    try {  // Try to fetch the Pokémon data from the API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {  // Check if the response is not OK
            throw new Error(`Error fetching Pokémon with ID ${id}`); // Throw an error with a message
        }
        const pokemon = await response.json(); // Parse the response JSON
        return pokemon;
    } catch (error) {
        console.error(error);
        return null;  // Return null if an error occurred
    }
}


function displayPokemonDetails(pokemon) {
    console.log(pokemon);
    setBasicPokemonDetails(pokemon);
    setPokemonStats(pokemon);
}


function setBasicPokemonDetails(pokemon) {
    setPokemonVisualDetails(pokemon);
    setPokemonTypeDetails(pokemon);
}


function setPokemonVisualDetails(pokemon) {
    updateElementText("name", capitalizeFirstLetter(pokemon.name)); //  Set the text content of the element to the capitalized Pokémon name
    updateElementText("pokeId", `#${pokemon.id}`); // Set the text content of the element to the Pokémon ID
    updateElementSrc(".detail-img-wrapper img", pokemon.sprites.other['official-artwork'].front_default); // Set the src attribute of the image element to the Pokémon sprite URL
    updateElementText("weight", `${pokemon.weight / 10} kg`); // Set the text content of the element to the Pokémon weight in kg
    updateElementText("height", `${pokemon.height / 10} m`); // Set the text content of the element to the Pokémon height in m
    const moveName = pokemon.moves[0]?.move.name || 'N/A'; // Get the name of the first move or default to 'N/A'
    updateElementText("move", capitalizeFirstLetter(moveName)); // Set the text content of the element to the capitalized move name
    updateElementText("pokemon-description", pokemon.species.name); // Set the text content of the element to the Pokémon species name
}


function setPokemonTypeDetails(pokemon) {
    const types = pokemon.types.map(typeInfo => typeInfo.type.name);
    const typeElements = document.querySelectorAll(".type");
    typeElements.forEach((element, index) => {
        if (types[index]) {
            element.textContent = types[index];
            element.style.backgroundColor = getContrastingColor(getTypeColor(types[index]));
        } else {
            element.textContent = '';
        }
    });
    const primaryTypeColor = getTypeColor(types[0]);
    document.querySelector(".detail-card-detail-wrapper").style.backgroundColor = primaryTypeColor; // Set the background color of the detail card to the primary type color
}


function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}


function updateElementSrc(elementSelector, src) {
    const element = document.querySelector(elementSelector);
    if (element) {
        element.src = src;
    }
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(); // Capitalize the first character of the string and make the rest lowercase
}


function setPokemonStats(pokemon) {
    const stats = pokemon.stats;
    const statElements = document.getElementsByClassName("stats-wrap");
    Array.from(statElements).forEach(statElement => {  // Convert the HTMLCollection to an array and iterate over each element
        const statName = statElement.getAttribute("data-stat").toLowerCase(); // Get the stat name from the data-stat attribute of the element
        const mappedStatName = statNameMapping[statName];  // Get the mapped stat name from the statNameMapping object
        const statValue = stats.find(stat => stat.stat.name === statName)?.base_stat || 0; // Find the stat value for the current stat name or default to 0
        if (mappedStatName) {
            statElement.getElementsByClassName("body3-fonts")[0].textContent = `${mappedStatName}: ${statValue}`; //  Set the text content of the element to the stat name and value
            const progressBar = statElement.getElementsByTagName("progress")[0];  // Get the progress bar element
            progressBar.value = statValue;  // Set the progress bar value to the stat value
            progressBar.max = 100;  // Set the maximum value of the progress bar to 100
            progressBar.style.setProperty('--progress-bar-color', getTypeColor(pokemon.types[0].type.name));
        }
    });
}


const statNameMapping = {
    hp: "HP",
    attack: "ATTACK",
    defense: "DEFENSE",
    "special-attack": "SPECIAL ATTACK",
    "special-defense": "SPECIAL DEFENSE",
    speed: "SPEED"
};


function getTypeColor(type) {
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
    return typeColors[type] || "#777";
}


function getContrastingColor(color) {
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
    return contrastColors[color] || "#333";
}

function setupNavigation() {
    const leftArrow = document.getElementById('leftArrow');
    const rightArrow = document.getElementById('rightArrow');
    if (leftArrow) {
        leftArrow.onclick = async () => {  // Add an event listener to the left arrow
            if (pokemonId > 1) {  // Prevent navigating to Pokémon with ID 0
                await navigatePokemon(pokemonId, -1); // Navigate to the previous Pokémon
            }
        };
    }
    if (rightArrow) {
        rightArrow.onclick = async () => { // Add an event listener to the right arrow
            await navigatePokemon(pokemonId, 1); // Navigate to the next Pokémon
        };
    }
}

async function navigatePokemon(currentId, direction) { // Navigate to the Pokémon with the specified ID
    const newId = currentId + direction;  // Calculate the new Pokémon ID
    if (newId > 0) {    // Prevent navigating to Pokémon with ID 0
        const newPokemon = await fetchPokemonById(newId);  // Fetch the new Pokémon data
        if (newPokemon) {
            displayPokemonDetails(newPokemon);
            window.history.pushState(null, null, `?pokemonId=${newId}`); // Update the URL with the new Pokémon ID
            pokemonId = newId;
        } else {
            console.error("Failed to fetch new Pokémon data"); // Log an error message if the new Pokémon data could not be fetched
        }
    }
}

document.addEventListener("DOMContentLoaded", initialisierePokemonDetails);  // Initialize the Pokémon details page when the DOM content has been loaded


