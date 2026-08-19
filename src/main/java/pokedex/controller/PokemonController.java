package pokedex.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pokedex.entity.PokemonEntity;
import pokedex.repository.PokemonRepository;
import java.util.List;

import java.util.Optional;

@RestController
@RequestMapping("/pokemons")
@CrossOrigin(origins = "*")

public class PokemonController {

    @Autowired
    private PokemonRepository pokemonRepository;

    @GetMapping
    public List<PokemonEntity> listarPokemons() {
        return pokemonRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PokemonEntity> buscarPokemon(@PathVariable Long id) {
        Optional<PokemonEntity> pokemon = pokemonRepository.findById(id);

        if (pokemon.isPresent()) {
            return ResponseEntity.ok(pokemon.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<PokemonEntity> criarPokemon(
            @RequestBody PokemonEntity pokemon) {

        PokemonEntity novoPokemon = pokemonRepository.save(pokemon);

        return ResponseEntity.ok(novoPokemon);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PokemonEntity> atualizarPokemon(
            @PathVariable Long id,
            @RequestBody PokemonEntity dadosPokemon) {

        Optional<PokemonEntity> pokemonExistente =
                pokemonRepository.findById(id);

        if (pokemonExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PokemonEntity pokemon = pokemonExistente.get();

        pokemon.setNome(dadosPokemon.getNome());
        pokemon.setTipo(dadosPokemon.getTipo());
        pokemon.setAltura(dadosPokemon.getAltura());
        pokemon.setPeso(dadosPokemon.getPeso());
        pokemon.setImagem(dadosPokemon.getImagem());

        PokemonEntity pokemonAtualizado =
                pokemonRepository.save(pokemon);

        return ResponseEntity.ok(pokemonAtualizado);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarPokemon(@PathVariable Long id) {

        if (!pokemonRepository.existsById(id)) {
            return  ResponseEntity.notFound().build();
        }

        pokemonRepository.deleteById(id);

        return ResponseEntity.ok("Pokemon deletado com sucesso!");
    }
}
