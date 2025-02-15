let offset = 0
let limit = 36

async function fetchPokemonData(offset, limit, clearList = false) {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (clearList) {
            document.getElementById('pokemon-list').innerHTML = '';
        }

        displayPokemon(data.results);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}


async function displayPokemon(pokemonArray) {
    const pokemonList = document.getElementById('pokemon-list');
    for (const pokemon of pokemonArray) {
        try {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonDetails = await pokemonResponse.json();

            const id = pokemon.url.split('/').filter(Boolean).pop(); 
            const detailUrl = `https://restfulpokemon.netlify.app/${pokemon.name}`;

            const pokemonElement = document.createElement('div');
            pokemonElement.className = 'card';
            pokemonElement.setAttribute('data-url', detailUrl); 
            pokemonElement.innerHTML = `                
                <div class="id">#${id}</div>
                <img src="${pokemonDetails.sprites.front_default}" alt="Image of ${pokemon.name}" style="width:100%">
                <div class="container-mini">
                    <h3><b>${pokemon.name}</b></h3>
                    <p class="type-list">
                        ${pokemonDetails.types.map(type => `
                            <span class="type ${type.type.name.toLowerCase()}">
                                ${type.type.name}
                            </span>
                        `).join(' ')}
                    </p>
                </div>
            `;
            pokemonElement.addEventListener('click', clickCard); 
            pokemonList.appendChild(pokemonElement);
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
        }
    }
}

function clickCard(event) {
    const card = event.currentTarget; 
    const detailUrl = card.getAttribute('data-url'); 
    window.open(detailUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search');
    searchInput.addEventListener('input', searchPokemon);
});

function searchPokemon() {
    const query = document.querySelector('.search').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const nameElement = card.querySelector('h3 b');
        if (nameElement) {
            const name = nameElement.textContent.toLowerCase();
            card.style.display = name.includes(query) ? 'block' : 'none';
        }
    });
}

function getMore() {
    offset += limit;
    fetchPokemonData(offset, limit);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPokemonData(offset, limit);
});
