import { useState } from "react";

export default function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");
    return saved ? JSON.parse(saved) : [{name: "Ashton", chips: 75, bank = 0, powerupsused: 0}];
  });
  import { useEffect } from "react";
  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);
  const [newPlayer, setNewPlayer] = useState("");

  const addPlayer = () => {
    if (!newPlayer) return;
    setPlayers([...players, { name: newPlayer, chips: 75, bank: 0 }]);
    setNewPlayer("");
  };

  const updateChips = (index, amount) => {
    const updated = [...players];
    updated[index].chips += amount;
    if (updated[index].chips < 0) updated[index].chips = 0;
    setPlayers(updated);
  };

  const updateBank = (index, amount) => {
    const updated = [...players];
    updated[index].bank += amount;
    if (updated[index].bank < 0) updated[index].bank = 0;
    setPlayers(updated);
  };

  const cashOut = (index) => {
    const updated = [...players];
    updated[index].chips += updated[index].bank;
    updated[index].bank = 0;
    setPlayers(updated);
  };

  const sortedPlayers = [...players].sort((a, b) => b.chips - a.chips);
  <h2>{index + 1}. {player.name}</h2>

  return (
    <div style={{ padding: 20, background: "black", minHeight: "100vh", color: "white" }}>
      <h1>🐷 PTP Poker Dashboard</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Player name"
        />
        <button onClick={addPlayer}>Add Player</button>
        <button onClick={() => setPlayers([])}>RESET ALL PLAYERS</button>
      </div>

      <button onClick={() => {
        const updated = players.map(p => ({ ...p, bank: 0}));
        setPlayers(updated);
      }}>New day(resets bank)</button>

      <button onClick={() => {
        const updated = [...players];
        updated[index].powerupsused += 1;
        setPlayers(updated);
      }}>Used power up</button>

      {sortedPlayers.map((player, index) => (
        <div key={index} style={{ marginBottom: 15, border: "1px solid gray", padding: 10 }}>
          <h2>{player.name}</h2>
          <p>Chips: {player.chips}</p>
          <p>Bank: {player.bank}</p>

          <button onClick={() => updateChips(index, 5)}>+5</button>
          <button onClick={() => updateChips(index, -5)}>-5</button>

          <button onClick={() => updateBank(index, 5)}>+5 Bank</button>
          <button onClick={() => updateBank(index, -5)}>-5 Bank</button>

          <button onClick={() => cashOut(index)}>Cash Out</button>
        </div>
      ))}
    </div>
  );
}