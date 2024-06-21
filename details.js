document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('pokemonId');
    if (pokemonId) {
        const pokemon = await fetchPokemonById(pokemonId);
        displayPokemonDetails(pokemon);
        document.getElementById('leftArrow').addEventListener('click', () => navigatePokemon(pokemonId, -1));
        document.getElementById('rightArrow').addEventListener('click', () => navigatePokemon(pokemonId, 1));
    }
});

async function fetchPokemonById(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();
    return pokemon;
}

function displayPokemonDetails(pokemon) {
    setBasicPokemonDetails(pokemon);
    setPokemonStats(pokemon);
}

function setBasicPokemonDetails(pokemon) {
    document.querySelector(".name").textContent = pokemon.name;
    document.querySelector(".pokemon-id-wrap p").textContent = `#${pokemon.id}`;
    document.querySelector(".detail-img-wrapper img").src = pokemon.sprites.other['official-artwork'].front_default;
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
    document.querySelector(".weight").textContent = `${pokemon.weight / 10} kg`;
    document.querySelector(".height").textContent = `${pokemon.height / 10} m`;
    const moveName = pokemon.moves[0]?.move.name || 'N/A';
    document.querySelector(".move").textContent = moveName.charAt(0).toUpperCase() + moveName.slice(1).toLowerCase();
    document.querySelector(".pokemon-description").textContent = pokemon.species.name;
    const primaryTypeColor = getTypeColor(types[0]);
    document.querySelector(".detail-card-detail-wrapper").style.backgroundColor = primaryTypeColor; // Set background color of the card to the first type color
}

function setPokemonStats(pokemon) {
    const stats = pokemon.stats;
    const statElements = document.querySelectorAll(".stats-wrap");
    statElements.forEach(statElement => {
        const statName = statElement.getAttribute("data-stat").toLowerCase().replace("-", "_");
        const mappedStatName = statNameMapping[statName];
        const statValue = stats.find(stat => stat.stat.name === statName)?.base_stat || 0;

        if (mappedStatName) {
            statElement.querySelector("p.body3-fonts").textContent = `${mappedStatName}: ${statValue}`;
            const progressBar = statElement.querySelector("progress");
            progressBar.value = statValue;
            progressBar.max = 100; // Setzt das Maximum für die Fortschrittsbalken
            progressBar.style.setProperty('--progress-bar-color', getTypeColor(pokemon.types[0].type.name));
        }
    });
}

const statNameMapping = {
    hp: "HP",
    attack: "ATTACK",
    defense: "DEFENSE",
    "special_attack": "SPECIAL ATTACK",
    "special_defense": "SPECIAL DEFENSE",
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
    const newId = parseInt(currentId) + direction;
    if (newId > 0) {
        try {
            const newPokemon = await fetchPokemonById(newId);
            displayPokemonDetails(newPokemon);
            window.history.pushState(null, null, `?pokemonId=${newId}`);
        } catch (error) {
            console.error("Error fetching Pokemon:", error);
        }
    }
}
