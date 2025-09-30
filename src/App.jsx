import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
        const data = await res.json();

        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            const resPoke = await fetch(pokemon.url);
            const pokeData = await resPoke.json();
            return pokeData;
          })
        );

        setPokemons(detailedPokemons);
      } catch (error) {
        console.error("Error al cargar pokémon:", error);
      }
    }

    fetchPokemons();
  }, []);

  // Pantalla negra con JSON resumido
  if (selectedPokemon) {
    const simpleData = {
      id: selectedPokemon.id,
      name: selectedPokemon.name,
      height: selectedPokemon.height,
      weight: selectedPokemon.weight,
      types: selectedPokemon.types.map((t) => t.type.name),
    };

    return (
      <div className="black-screen">
        <pre>{JSON.stringify(simpleData, null, 2)}</pre>
      </div>
    );
  }

  // Grid con los Pokémon
  return (
    <div className="grid">
      {pokemons.map((p) => (
        <div
          key={p.id}
          className="card"
          onClick={() => setSelectedPokemon(p)}
        >
          <img src={p.sprites.front_default} alt={p.name} className="image" />
          <h2 className="name">{p.name}</h2>
        </div>
      ))}
    </div>
  );
}
