import { useState, useEffect } from "react";

export default function App() {
  const [players, setPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem("players");
      const data = saved ? JSON.parse(saved) : [];
      return data.length ? data : [{ name: "Ash", chips: 75, bank: 0 }];
    } catch {
      return [{ name: "Ash", chips: 75, bank: 0 }];
    }
  });

  const [newPlayer, setNewPlayer] = useState("");

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  const addPlayer = () => {
    if (!newPlayer) return;
    setPlayers([...players, { name: newPlayer, chips: 75, bank: 0 }]);
    setNewPlayer("");
  };

const sortedPlayers = [...players].sort((a, b) => b.chips - a.chips);
  return (
    <div style={{ padding: 20 }}>
      <h1>PTP Poker Dashboard</h1>

      <input
        value={newPlayer}
        onChange={(e) => setNewPlayer(e.target.value)}
        placeholder="Player name"
      />
      <button onClick={addPlayer}>Add Player</button>

      <button onClick={() => {
  const updated = players.map(p => ({ ...p, bank: 0 }));
  setPlayers(updated);
}}>
  New Day (Reset Bank)
</button>

<button onClick={() => {
  setPlayers(players.map(p => ({...p, chips: 75, bank: 0 })));
}}>
  Reset Season
</button>


 <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Chips</th>
      <th>Bank</th>
      <th>Total</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {sortedPlayers.map((p, i) => {
      const realIndex = players.findIndex(player => player.name === p.name);

      return (
        <tr
          key={i}
          style={{
            textAlign: "center",
            opacity: p.chips === 0 ? 0.5 : 1
          }}
        >
          <td>
            {i + 1}
          </td>

          <td>{p.name}</td>
          <td>{p.chips}</td>
          <td>{p.bank}</td>
          <td style={{ fontWeight: "bold" }}>{p.chips + p.bank}</td>

          <td>
            <button onClick={() => {
              const updated = [...players];
              updated[realIndex].chips += 5;
              setPlayers(updated);
            }}>+5</button>

            <button onClick={() => {
              const updated = [...players];
              updated[realIndex].chips = Math.max(0, updated[realIndex].chips - 5);
              setPlayers(updated);
            }}>-5</button>

            <button onClick={() => {
              const updated = [...players];
              updated[realIndex].bank += 5;
              setPlayers(updated);
            }}>+B</button>

            <button onClick={() => {
              const updated = [...players];
              updated[realIndex].bank = Math.max(0, updated[realIndex].bank - 5);
              setPlayers(updated);
            }}>-B</button>

            <button onClick={() => {
              const updated = [...players];
              updated[realIndex].chips += updated[realIndex].bank;
              updated[realIndex].bank = 0;
              setPlayers(updated);
            }}>💰</button>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
    </div>
    );
}