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

  const sortedPlayers = [...players].sort(
    (a, b) => (b.chips + b.bank) - (a.chips + a.bank)
  );

  const topProfit = Math.max(
    ...players.map((p) => p.chips + p.bank - 75)
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>🏆 PTP Poker Dashboard</h1>

      {/* ADD PLAYER */}
      <input
        value={newPlayer}
        onChange={(e) => setNewPlayer(e.target.value)}
        placeholder="Player name"
      />
      <button onClick={addPlayer}>Add Player</button>

      {/* RESET BUTTONS */}
      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => {
            const updated = players.map((p) => ({ ...p, bank: 0 }));
            setPlayers(updated);
          }}
        >
          New Day (Reset Bank)
        </button>

        <button
          onClick={() => {
            const updated = players.map((p) => ({
              ...p,
              chips: 75,
              bank: 0,
            }));
            setPlayers(updated);
          }}
        >
          Reset Season
        </button>
      </div>

      {/* TABLE */}
      <table
        style={{
          width: "100%",
          marginTop: 20,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Chips</th>
            <th>Bank</th>
            <th>Total</th>
            <th>Profit</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedPlayers.map((p, i) => {
            const realIndex = players.findIndex(
              (player) => player.name === p.name
            );

            const total = p.chips + p.bank;
            const profit = total - 75;

            return (
              <tr
                key={i}
                style={{
                  textAlign: "center",
                  opacity: p.chips === 0 ? 0.5 : 1,
                }}
              >
                {/* POSITION */}
                <td>
                  {i + 1}
                </td>

                {/* NAME */}
                <td>{p.name}</td>

                {/* CHIPS */}
                <td>{p.chips}</td>

                {/* BANK */}
                <td>{p.bank}</td>

                {/* TOTAL */}
                <td style={{ fontWeight: "bold" }}>{total}</td>

                {/* PROFIT */}
                <td
                  style={{
                    color: profit >= 0 ? "lime" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {profit}
                </td>

                {/* ACTIONS */}
                <td>
                  <button
                    onClick={() => {
                      const updated = [...players];
                      updated[realIndex].chips += 5;
                      setPlayers(updated);
                    }}
                  >
                    +5
                  </button>

                  <button
                    onClick={() => {
                      const updated = [...players];
                      updated[realIndex].chips = Math.max(
                        0,
                        updated[realIndex].chips - 5
                      );
                      setPlayers(updated);
                    }}
                  >
                    -5
                  </button>

                  <button
                    onClick={() => {
                      const updated = [...players];
                      updated[realIndex].bank += 5;
                      setPlayers(updated);
                    }}
                  >
                    +B
                  </button>

                  <button
                    onClick={() => {
                      const updated = [...players];
                      updated[realIndex].bank = Math.max(
                        0,
                        updated[realIndex].bank - 5
                      );
                      setPlayers(updated);
                    }}
                  >
                    -B
                  </button>

                  <button
                    onClick={() => {
                      const updated = [...players];
                      updated[realIndex].chips +=
                        updated[realIndex].bank;
                      updated[realIndex].bank = 0;
                      setPlayers(updated);
                    }}
                  >
                    💰
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}