const pokeContainer = document.querySelector(".pokemon-container");
document.getElementById("search-input").addEventListener("keyup", search);
const pokeNumber = 15;

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
};

fetchPokemons();

// tworzę elementy HTMLa dla karty pod stworki
function createPokeCard(pokemon) {
	const pokemonEl = document.createElement("div");
	pokemonEl.classList.add("pokemon");
	pokemonEl.classList.add(`${pokemon.id}`);

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

async function search() {
	const value = document.getElementById("search-input").value;
	if (value.length > 0) {
		const pokemon = await getPokemons(value);
		const allpokemons = document.getElementsByClassName("pokemon");
		const pokeEl = document.getElementsByClassName(pokemon.id);
		console.log(value.length);

		for (i = 0; i < allpokemons.length; i++) {
			if (i == value - 1) {
				allpokemons[i].style.display = "";
			} else {
				allpokemons[i].style.display = "none";
			}
		}
	} else {
		//TODO: bring display back
	}
}
