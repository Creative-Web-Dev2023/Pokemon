let pokemonId;

async function initialisierePokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    pokemonId = urlParams.get('pokemonId');
    if (pokemonId) {
        pokemonId = parseInt(pokemonId, 10);
        const pokemon = await fetchPokemonById(pokemonId);
        if (pokemon) {
            displayPokemonDetails(pokemon);
            setupNavigation();
        } else {
            console.error("Fehler beim Abrufen der Pokémon-Daten");
        }
    }
}

async function fetchPokemonById(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching Pokémon with ID ${id}`);
        }
        const pokemon = await response.json();
        return pokemon;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function displayPokemonDetails(pokemon) {
    setBasicPokemonDetails(pokemon);
    setPokemonStats(pokemon);
}

function setBasicPokemonDetails(pokemon) {
    setPokemonVisualDetails(pokemon);
    setPokemonTypeDetails(pokemon);
}

function setPokemonVisualDetails(pokemon) {
    updateElementText("name", capitalizeFirstLetter(pokemon.name));
    updateElementText("pokemon-id", `#${pokemon.id}`);
    updateElementSrc(".detail-img-wrapper img", pokemon.sprites.other['official-artwork'].front_default);
    updateElementText("weight", `${pokemon.weight / 10} kg`);
    updateElementText("height", `${pokemon.height / 10} m`);
    const moveName = pokemon.moves[0]?.move.name || 'N/A';
    updateElementText("move", capitalizeFirstLetter(moveName));
    updateElementText("pokemon-description", pokemon.species.name);
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
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
    document.querySelector(".detail-card-detail-wrapper").style.backgroundColor = primaryTypeColor;
}

function setPokemonStats(pokemon) {
    const stats = pokemon.stats;
    const statElements = document.getElementsByClassName("stats-wrap");
    Array.from(statElements).forEach(statElement => {
        const statName = statElement.getAttribute("data-stat").toLowerCase();
        const mappedStatName = statNameMapping[statName];
        const statValue = stats.find(stat => stat.stat.name === statName)?.base_stat || 0;

        if (mappedStatName) {
            statElement.getElementsByClassName("body3-fonts")[0].textContent = `${mappedStatName}: ${statValue}`;
            const progressBar = statElement.getElementsByTagName("progress")[0];
            progressBar.value = statValue;
            progressBar.max = 100;
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
        leftArrow.onclick = async () => {
            if (pokemonId > 1) {
                await navigatePokemon(pokemonId, -1);
            }
        };
    }

    if (rightArrow) {
        rightArrow.onclick = async () => {
            await navigatePokemon(pokemonId, 1);
        };
    }
}

async function navigatePokemon(currentId, direction) {
    const newId = currentId + direction;
    if (newId > 0) {
        const newPokemon = await fetchPokemonById(newId);
        if (newPokemon) {
            displayPokemonDetails(newPokemon);
            window.history.pushState(null, null, `?pokemonId=${newId}`);
            pokemonId = newId;
        } else {
            console.error("Failed to fetch new Pokémon data");
        }
    }
}

document.addEventListener("DOMContentLoaded", initialisierePokemonDetails);
