const pokeContainer = document.querySelector(".pokemon-container");

const SearchElement = document.getElementById("search-input");
const loader = document.querySelector(".loader");
const loaderBackground = document.querySelector(".loader-background");
const pokeNumber = 151;

const toggleDisplay = async function (x) {
	if (x.style.display === "none") {
		x.style.display = "";
	} else {
		x.style.display = "none";
	}
};

const toggleImgSize = async function (x) {
	if (x.style.width === "250px") {
		x.style.width = "";
		x.style.height = "";
	} else {
		x.style.width = "250px";
		x.style.height = "250px";
	}
};

// Pobieram pojedynczego stworka z api
const getPokemons = async function (id) {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const result = await fetch(url);
	const pokemon = await result.json();

	let characteristicCalc = id % 31;

	if (id % 31 == 0) characteristicCalc += 1;

	const urlC = `https://pokeapi.co/api/v2/characteristic/${characteristicCalc}`;

	const resultC = await fetch(urlC, { method: "HEAD" })
		.then((response) => {
			if (response.ok) {
				return fetch(urlC);
			} else if (response.status === 404) {
				return fetch(`https://pokeapi.co/api/v2/characteristic/1`);
			} else {
				return "error";
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
	const characteristic = await resultC.json();

	await createPokeCard(pokemon, characteristic);
	return pokemon;
};

// wykorzystuje funkcję getPokemons do pobrania wybranej liczby stworków (i)
const fetchPokemons = async function () {
	toggleDisplay(pokeContainer);
	for (let i = 1; i <= pokeNumber; i++) {
		await getPokemons(i);
	}
	toggleDisplay(pokeContainer);
	toggleDisplay(loader);
	toggleDisplay(loaderBackground);
	createSearchFilter();
};

fetchPokemons();

// tworzę elementy HTMLa dla karty pod stworki
async function createPokeCard(pokemon, characteristic) {
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
	const pokeAbilities = pokemon.abilities.map(
		(element) => element.ability.name
	);

	const pokeStatsAll = [{}];
	for (let i = 0; i < 6; i++) {
		const pokeStats = new Map(Object.entries(pokemon.stats[i]));

		const pokeStatsName = new Map(Object.entries(pokemon.stats[i].stat));

		pokeStatsAll.push({ pokeStatsName: pokeStatsName.get("name") });
		pokeStatsAll.push({ pokeStats: pokeStats.get("base_stat") });
	}
	//console.log(pokeStatsAll);

	const pokeDescriptions = characteristic.descriptions[7].description || "none"; //7 desc to angielski

	const pokeInnerHTML = `
    
    <div class="pokeImg-container">
        <img src="${pokeSprite}"/>
    </div>
    <div class="pokeInfo-container">
        <span class="poke-id">#${pokeID}</span>
        <p class="poke-name">${pokeName}</p>
        <p class="poke-type">Type: ${pokeTypes}</p>
		<p class="poke-ability" style="display:none" >Abilities: ${pokeAbilities} </p>
		<p class="poke-description" style="display:none" >Description: ${pokeDescriptions} </p>
		<table class="poke-stats"  style="display:none" >
			<tr>
				<td>
				${JSON.stringify(pokeStatsAll[1].pokeStatsName)}
				</td>
				<td>
				${JSON.stringify(pokeStatsAll[2].pokeStats)}
				</td>
			</tr>
			<tr>
				<td>
				${JSON.stringify(pokeStatsAll[3].pokeStatsName)}
				</td>
				<td>
				${JSON.stringify(pokeStatsAll[4].pokeStats)}
				</td>
			</tr>
			<tr>
				<td>
				${JSON.stringify(pokeStatsAll[5].pokeStatsName)}
				</td>
				<td>
				${JSON.stringify(pokeStatsAll[6].pokeStats)}
				</td>
			</tr>
			<tr>
				<td>
				${JSON.stringify(pokeStatsAll[7].pokeStatsName)}
				</td>
				<td>
				${JSON.stringify(pokeStatsAll[8].pokeStats)}
				</td>
			</tr>
			<tr>
				<td>
				${JSON.stringify(pokeStatsAll[9].pokeStatsName)}
				</td>
				<td>
				${JSON.stringify(pokeStatsAll[10].pokeStats)}
				</td>
			</tr>
			<tr>
				<td>
				${JSON.stringify(pokeStatsAll[11].pokeStatsName)}
				</td>
				<td>
				${JSON.stringify(pokeStatsAll[12].pokeStats)}
				</td>
			</tr>
		
	</table>
		
    </div>
    `;

	pokemonEl.innerHTML = pokeInnerHTML;

	pokeContainer.appendChild(pokemonEl);
}

//wyszukiwarka po nazwie -- ustawionej jako id elementu + po ID - numerze pokemona
const createSearchFilter = async function () {
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

async function detailedPokeCard() {
	document.addEventListener("click", (event) => {
		//console.log(event.target.closest(".pokemon")); //ultra przydatne - wybiera najbliższego diva do klikniętego elementu
		if (event.target.closest(".pokemon") != null) {
			const parent = event.target.closest(".pokemon");
			const pokeImg = parent.childNodes[1];
			const nodes = parent.childNodes[3].childNodes;
			toggleDisplay(nodes[7]);
			toggleDisplay(nodes[9]);
			toggleDisplay(nodes[11]);

			toggleImgSize(pokeImg);
		}
	});
}
detailedPokeCard();
