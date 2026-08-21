const URL_POKEAPI = "https://pokeapi.co/api/v2/pokemon/";

let pokemonAtual = null;

const campoBusca = document.getElementById("pokemonBusca");
const botaoBuscar = document.getElementById("btnBuscar");
const mensagem = document.getElementById("mensagem");

const resultadoPokemon = document.getElementById("resultadoPokemon");
const pokemonImagem = document.getElementById("pokemonImagem");
const pokemonNome = document.getElementById("pokemonNome");
const pokemonTipo = document.getElementById("pokemonTipo");
const pokemonAltura = document.getElementById("pokemonAltura");
const pokemonPeso = document.getElementById("pokemonPeso");
const botaoSalvar = document.getElementById("btnSalvar");
const listaPokemons = document.getElementById("listaPokemons");

// Esconde o resultado inicialmente
resultadoPokemon.style.display = "none";

// Buscar Pokémon na PokeAPI
async function buscarPokemon() {

    const nome = campoBusca.value.trim().toLowerCase();

    if (!nome) {
        mensagem.textContent = "Digite o nome de um Pokémon.";
        return;
    }

    mensagem.textContent = "Buscando Pokémon...";

    try {

        const resposta = await fetch(URL_POKEAPI + nome);

        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado.");
        }

        const dados = await resposta.json();

        pokemonAtual = dados;

        pokemonNome.textContent =
            dados.name.charAt(0).toUpperCase() + dados.name.slice(1);

        pokemonTipo.textContent =
            dados.types.map(tipo => tipo.type.name).join(", ");

        pokemonAltura.textContent =
            (dados.height / 10) + " m";

        pokemonPeso.textContent =
            (dados.weight / 10) + " kg";

        pokemonImagem.src =
            dados.sprites.other["official-artwork"].front_default;

        pokemonImagem.alt = dados.name;

        resultadoPokemon.style.display = "block";

        mensagem.textContent = "Pokémon encontrado!";

    } catch (erro) {

        pokemonAtual = null;

        resultadoPokemon.style.display = "none";

        mensagem.textContent = erro.message;
    }
}

// Botão Buscar
botaoBuscar.addEventListener("click", buscarPokemon);

// Permitir buscar apertando Enter
campoBusca.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        buscarPokemon();
    }

});

// Salvar Pokémon no nosso banco de dados
async function salvarPokemon() {

    if (!pokemonAtual) {
        mensagem.textContent = "Primeiro busque um Pokémon.";
        return;
    }

    const pokemon = {
        nome: pokemonAtual.name,
        tipo: pokemonAtual.types
            .map(tipo => tipo.type.name)
            .join(", "),
        altura: pokemonAtual.height / 10,
        peso: pokemonAtual.weight / 10,
        imagem: pokemonAtual.sprites.other["official-artwork"].front_default
    };

    mensagem.textContent = "Salvando Pokémon...";

    try {

        const resposta = await fetch("http://localhost:8080/pokemons", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(pokemon)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao salvar o Pokémon.");
        }

        mensagem.textContent = "Pokémon salvo com sucesso!";

        listarPokemons();
        

    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "Não foi possível salvar o Pokémon.";
    }
}

// Listar Pokémon salvos no banco
async function listarPokemons() {

    try {

        const resposta = await fetch("http://localhost:8080/pokemons");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os Pokémon.");
        }

        const pokemons = await resposta.json();

        listaPokemons.innerHTML = "";

        pokemons.forEach(pokemon => {

            const card = document.createElement("div");

            card.classList.add("pokemon-salvo");

            card.innerHTML = `
                <img src="${pokemon.imagem}" alt="${pokemon.nome}">

                <h3>${pokemon.nome}</h3>

                <p>Tipo: ${pokemon.tipo}</p>
                <p>Altura: ${pokemon.altura} m</p>
                <p>Peso: ${pokemon.peso} kg</p>
            `;

            listaPokemons.appendChild(card);
        });

    } catch (erro) {

        console.error(erro);

        listaPokemons.innerHTML =
            "<p>Não foi possível carregar os Pokémon salvos.</p>";
    }
}

// Botão Salvar
botaoSalvar.addEventListener("click", salvarPokemon);

listarPokemons();