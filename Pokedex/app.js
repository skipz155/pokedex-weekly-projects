const pokeContainer = document.querySelector(".pokemon-container");
const SearchElement = document.getElementById("search-input");
const pokeNumber = 151;

// Pobieram pojedynczego stworka z api
const getPokemons = async function (id) {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const result = await fetch(url);
	const pokemon = await result.json();
	createPokeCard(pokemon);
	return pokemon;
};

// wykorzystuje funkcję getPokemons do pobrania wybranej liczby stworków (i)
const fetchPokemons = async function () {
	for (let i = 1; i <= pokeNumber; i++) {
		await getPokemons(i);
	}
	createSearchFilter();
};

fetchPokemons();

// tworzę elementy HTMLa dla karty pod stworki
function createPokeCard(pokemon) {
	const pokemonEl = document.createElement("div");
	const pokeID = pokemon.id.toString().padStart(3, "0"); //#001 ...
	pokemonEl.classList.add("pokemon");
	pokemonEl.classList.add(`${pokeID}`);

	//nazwa pokemona z dużej litery
	const pokeName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
	const pokeSprite = pokemon.sprites.front_default;
	pokemonEl.setAttribute("id", pokeName);

	//mapowanie - po typach -- niektóre mają więcej niż jeden typ
	const pokeTypes = pokemon.types.map((element) => element.type.name);

	const pokeInnerHTML = `
    
    <div class="pokeImg-container">
        <img src="${pokeSprite}"/>
    </div>
    <div class="pokeInfo-container">
        <span class="poke-id">#${pokeID}</span>
        <p class="poke-name">${pokeName}</p>
        <p class="poke-type">Type: ${pokeTypes}</p>
    </div>
    `;

	pokemonEl.innerHTML = pokeInnerHTML;

	pokeContainer.appendChild(pokemonEl);
}

//wyszukiwarka po nazwie -- ustawionej jako id elementu + po ID - numerze pokemona
const createSearchFilter = function () {
	const cards = document.querySelectorAll(".pokemon");
	SearchElement.addEventListener("keyup", (event) => {
		const val = event.target.value.toLowerCase();
		cards.forEach((card) => {
			if (card.id.toLowerCase().includes(val)) {
				card.style.display = "";
			} else if (card.className.includes(val)) {
				card.style.display = "";
			} else {
				card.style.display = "none";
			}
		});
	});
};
