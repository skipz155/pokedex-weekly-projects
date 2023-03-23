const pokeContainer = document.querySelector(".pokemon-container");
const pokeNumber = 15;

// Pobieram pojedynczego stworka z api
const getPokemons = async function (id) {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const result = await fetch(url);
	const pokemon = await result.json();
	createPokeCard(pokemon);
};

// wykorzystuje funkcję getPokemons do pobrania wybranej liczby stworków (i)
const fetchPokemons = async function () {
	for (let i = 1; i <= pokeNumber; i++) {
		await getPokemons(i);
	}
};

fetchPokemons();

// tworzę elementy HTMLa dla karty pod stworki
function createPokeCard(pokemon) {
	const pokemonEl = document.createElement("div");
	pokemonEl.classList.add("pokemon");

	//nazwa pokemona z dużej litery
	const pokeName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
	const pokeSprite = pokemon.sprites.front_default;

	//mapowanie - po typach -- niektóre mają więcej niż jeden typ
	const pokeTypes = pokemon.types.map((element) => element.type.name);

	const pokeInnerHTML = `
    
    <div class="pokeImg-container">
        <img src="${pokeSprite}"/>
    </div>
    <div class="pokeInfo-container">
        <span class="poke-id">#${pokemon.id.toString().padStart(3, "0")}</span>
        <p class="poke-name">${pokeName}</p>
        <p class="poke-type">Type: ${pokeTypes}</p>
    </div>
    `;

	pokemonEl.innerHTML = pokeInnerHTML;

	pokeContainer.appendChild(pokemonEl);
}
