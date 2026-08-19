package pokedex.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pokedex.entity.PokemonEntity;
import pokedex.repository.PokemonRepository;

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
}
