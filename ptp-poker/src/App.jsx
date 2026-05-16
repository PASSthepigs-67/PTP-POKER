import { useState } from "react";

export default function App() {
  const [players, setPlayers] = useState([
    { name: "Ash", chips: 75, bank: 0 },
  ]);
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

  return (
    <div style={{ padding: 20, background: "black", minHeight: "100vh", color: "white"}}>
      <h1 className="text-3xl font-bold mb-6">🐷 PTP Poker Dashboard</h1>

      {/* Add Player */}
      <div className="mb-6">
        <input
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Player name"
          className="p-2 text-black mr-2"
        />
        <button
          onClick={addPlayer}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Add Player
        </button>
      </div>

      {/* Players */}
      <div className="grid gap-4">
        {sortedPlayers.map((player, index) => (
          <div
            key={index}
            className="p-4 bg-gray-900 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-bold">{player.name}</h2>
              <p>Chips: {player.chips} PTP$</p>
              <p className="text-yellow-400">Bank: {player.bank} PTP$</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Chips */}
              <button onClick={() => updateChips(index, 5)} className="bg-green-600 px-2 py-1 rounded">+5</button>
              <button onClick={() => updateChips(index, -5)} className="bg-red-600 px-2 py-1 rounded">-5</button>

              {/* Bank */}
              <button onClick={() => updateBank(index, 5)} className="bg-yellow-500 px-2 py-1 rounded">+5 Bank</button>
              <button onClick={() => updateBank(index, -5)} className="bg-yellow-700 px-2 py-1 rounded">-5 Bank</button>

              {/* Cash Out */}
              <button onClick={() => cashOut(index)} className="bg-blue-500 px-2 py-1 rounded">
                Cash Out
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}