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

const botaoAtualizar = document.getElementById("btnAtualizar");

const campoNome = document.getElementById("campoNome");
const campoTipo = document.getElementById("campoTipo");
const campoAltura = document.getElementById("campoAltura");
const campoPeso = document.getElementById("campoPeso");
const campoImagem = document.getElementById("campoImagem");

let pokemonEditandoId = null;

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

                <button onclick="editarPokemon(${pokemon.id})">
                 ✏️ Editar
                </button>

                <button onclick="deletarPokemon(${pokemon.id})">
                    🗑️ Excluir
                </button>
            `;

            listaPokemons.appendChild(card);
        });

    } catch (erro) {

        console.error(erro);

        listaPokemons.innerHTML =
            "<p>Não foi possível carregar os Pokémon salvos.</p>";
    }
}

// Deletar Pokémon
async function deletarPokemon(id) {

    const confirmar = confirm("Deseja realmente excluir este Pokémon?");

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(`http://localhost:8080/pokemons/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir o Pokémon.");
        }

        mensagem.textContent = "Pokémon excluído com sucesso!";

        listarPokemons();

    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "Não foi possível excluir o Pokémon.";
    }
}

// Editar Pokémon
async function editarPokemon(id) {

    try {

        const resposta = await fetch(`http://localhost:8080/pokemons/${id}`);

        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado.");
        }

        const pokemon = await resposta.json();

        console.log("Pokémon recebido:", pokemon);

        pokemonEditandoId = pokemon.id;

        campoNome.value = pokemon.nome;
        campoTipo.value = pokemon.tipo;
        campoAltura.value = pokemon.altura;
        campoPeso.value = pokemon.peso;
        campoImagem.value = pokemon.imagem;

        pokemonImagem.src = pokemon.imagem;
        pokemonImagem.alt = pokemon.nome;

        pokemonNome.textContent =
            pokemon.nome.charAt(0).toUpperCase() +
            pokemon.nome.slice(1);

        resultadoPokemon.style.display = "block";

        botaoSalvar.style.display = "none";
        botaoAtualizar.style.display = "inline-block";

        mensagem.textContent =
            "Edite os dados e clique em Atualizar Pokémon.";

    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "Não foi possível carregar o Pokémon.";
    }
}


// Atualizar Pokémon
async function atualizarPokemon() {

    if (!pokemonEditandoId) {
        mensagem.textContent = "Nenhum Pokémon selecionado para edição.";
        return;
    }

    const pokemonAtualizado = {

        nome: campoNome.value,
        tipo: campoTipo.value,
        altura: parseFloat(campoAltura.value),
        peso: parseFloat(campoPeso.value),
        imagem: campoImagem.value

    };

    console.log("Enviando PUT:", pokemonAtualizado);

    try {

        const resposta = await fetch(
            `http://localhost:8080/pokemons/${pokemonEditandoId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(pokemonAtualizado)
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao atualizar o Pokémon.");
        }

        mensagem.textContent =
            "Pokémon atualizado com sucesso!";

        pokemonEditandoId = null;

        botaoSalvar.style.display = "inline-block";
        botaoAtualizar.style.display = "none";

        listarPokemons();

    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "Não foi possível atualizar o Pokémon.";
    }
}

// Botão Salvar
botaoSalvar.addEventListener("click", salvarPokemon);

// Botão Atualizar
botaoAtualizar.addEventListener("click", atualizarPokemon);

// Carrega os Pokémon salvos
listarPokemons();