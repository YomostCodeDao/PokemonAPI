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

async function displayPokemon(pokemonArray) {
    const pokemonList = document.getElementById('pokemon-list');
    for (const pokemon of pokemonArray) {
        try {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonDetails = await pokemonResponse.json();

            const id = pokemon.url.split('/').filter(Boolean).pop(); // Lấy ID từ URL
            const detailUrl = `https://restfulpokemon.netlify.app/${pokemon.name}`; // Sửa lỗi trong URL

            const pokemonElement = document.createElement('div');
            pokemonElement.className = 'card';
            pokemonElement.setAttribute('data-url', detailUrl); // Sử dụng attribute để lưu URL
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
            pokemonElement.addEventListener('click', clickCard); // Thêm sự kiện click
            pokemonList.appendChild(pokemonElement);
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
        }
    }
}

function clickCard(event) {
    const card = event.currentTarget; // Lấy thẻ card được nhấn
    const detailUrl = card.getAttribute('data-url'); // Lấy URL từ attribute
    window.open(detailUrl, '_blank'); // Mở URL trong tab mới
}


function getMore() {
    offset += limit;
    fetchPokemonData(offset, limit);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPokemonData(offset, limit);
});
