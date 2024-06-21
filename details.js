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
    steel: "#B8B8D0",
    dark: "#EE99AC",
  };

  function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
      element.style[cssProperty] = value;
    });
  }
  
  function setTypeBackgroundColor(pokemon){
    const mainType = pokemon.types[0].type.name;
    const color = typeColors[mainType];
    if (!color) {
        console.warn(`Color not defined for type: ${mainType}`);
        return;
      }
    
      const detailMainElement = document.getElementById("detail-main");
      setElementStyles([detailMainElement], "backgroundColor", color);
      setElementStyles([detailMainElement], "borderColor", color);
      setElementStyles(document.querySelectorAll(".power-wrapper > p"),"backgroundColor",color);
      setElementStyles(document.querySelectorAll(".stats-wrap p.stats"),"color",color);
      setElementStyles(document.querySelectorAll(".stats-wrap .progress-bar"),"color",color);
    
      const rgbaColor = rgbaFromHex(color);
      const styleTag = document.createElement("style");
      styleTag.innerHTML = `
        .stats-wrap .progress-bar::-webkit-progress-bar {
            background-color: rgba(${rgbaColor}, 0.5);
        }
        .stats-wrap .progress-bar::-webkit-progress-value {
            background-color: ${color};
        }
      `;
      document.head.appendChild(styleTag);
    }
  
