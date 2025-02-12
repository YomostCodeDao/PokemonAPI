let offset = 0
let limit = 36

async function fetchPokemonData(offset, limit) {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayPokemon(data.results);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}

function displayPokemon(pokemonArray) {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonArray.forEach(async (pokemon, index) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonDetails = await pokemonResponse.json();

        const id = pokemon.url.split('/').filter(Boolean).pop();

        const pokemonElement = document.createElement('div');
        pokemonElement.className = 'card';
        pokemonElement.innerHTML = `
            <div class="id">#${id}</div>
            <img src="${pokemonDetails.sprites.front_default}" alt="Image of ${pokemon.name}" style="width:100%">
            <div class="container-mini">
                <h3><b>${pokemon.name}</b></h3>
                <p class="type-list">${pokemonDetails.types.map(type => `<span class="type ${type.type.name.toLowerCase()}">${type.type.name}</span>`).join('')}</p>
            </div>
        `;
        pokemonList.appendChild(pokemonElement);
    });
}


function getMore() {
    offset += limit;
    fetchPokemonData(offset, limit);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPokemonData(offset, limit);
});
