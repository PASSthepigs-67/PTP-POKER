import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");

  // LOAD PLAYERS
  const fetchPlayers = async () => {
    const { data } = await supabase.from("players").select("*");
    if (data) setPlayers(data);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // ADD PLAYER
  const addPlayer = async () => {
    if (!newPlayer) return;

    await supabase.from("players").insert([
      { name: newPlayer, chips: 75, bank: 0 }
    ]);

    setNewPlayer("");
    fetchPlayers();
  };

  // SORT BY TOTAL
  const sortedPlayers = [...players].sort(
    (a, b) => (b.chips + b.bank) - (a.chips + a.bank)
  );

  const topProfit = Math.max(
    ...players.map((p) => p.chips + p.bank - 75),
    0
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
          onClick={async () => {
            for (const p of players) {
              await supabase
                .from("players")
                .update({ bank: 0 })
                .eq("id", p.id);
            }
            fetchPlayers();
          }}
        >
          New Day (Reset Bank)
        </button>

        <button
          onClick={async () => {
            for (const p of players) {
              await supabase
                .from("players")
                .update({ chips: 75, bank: 0 })
                .eq("id", p.id);
            }
            fetchPlayers();
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
            const total = p.chips + p.bank;
            const profit = total - 75;

            return (
              <tr
                key={p.id}
                style={{
                  textAlign: "center",
                  opacity: p.chips === 0 ? 0.5 : 1,
                }}
              >
                {/* POSITION */}
                <td>
                  {i === 0 && "🥇 "}
                  {i === 1 && "🥈 "}
                  {i === 2 && "🥉 "}
                  {i + 1}
                </td>

                <td>{p.name}</td>
                <td>{p.chips}</td>
                <td>{p.bank}</td>

                <td style={{ fontWeight: "bold" }}>{total}</td>

                <td
                  style={{
                    color: profit >= 0 ? "lime" : "red",
                    fontWeight: "bold",
                    backgroundColor:
                      profit === topProfit ? "#003300" : "transparent",
                  }}
                >
                  {profit}
                </td>

                {/* ACTIONS */}
                <td>
                  <button
                    onClick={async () => {
                      await supabase
                        .from("players")
                        .update({ chips: p.chips + 5 })
                        .eq("id", p.id);
                      fetchPlayers();
                    }}
                  >
                    +5
                  </button>

                  <button
                    onClick={async () => {
                      await supabase
                        .from("players")
                        .update({
                          chips: Math.max(0, p.chips - 5),
                        })
                        .eq("id", p.id);
                      fetchPlayers();
                    }}
                  >
                    -5
                  </button>

                  <button
                    onClick={async () => {
                      await supabase
                        .from("players")
                        .update({ bank: p.bank + 5 })
                        .eq("id", p.id);
                      fetchPlayers();
                    }}
                  >
                    +B
                  </button>

                  <button
                    onClick={async () => {
                      await supabase
                        .from("players")
                        .update({
                          bank: Math.max(0, p.bank - 5),
                        })
                        .eq("id", p.id);
                      fetchPlayers();
                    }}
                  >
                    -B
                  </button>

                  <button
                    onClick={async () => {
                      await supabase
                        .from("players")
                        .update({
                          chips: p.chips + p.bank,
                          bank: 0,
                        })
                        .eq("id", p.id);
                      fetchPlayers();
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