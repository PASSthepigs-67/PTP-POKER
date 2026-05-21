import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [tab, setTab] = useState("players");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // 🔐 GET USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // 📥 FETCH PLAYERS
  const fetchPlayers = async () => {
    const { data } = await supabase.from("players").select("*");
    if (data) setPlayers(data);
  };

  //FETCH TRANSACTIONS (HISTORY)
  const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      players!player_id ( name )
    `)
    .order("created_at", { ascending: false });

  console.log("TX FETCH:", data);
  console.log("TX ERROR:", error);

  if (data) setTransactions(data);
};

useEffect(() => {
  if (tab === "history") {
    console.log("FETCHING HISTORY...");
    fetchTransactions();
  }
}, [tab]);

  // ⚡ REALTIME
  useEffect(() => {
    fetchPlayers();

    const channel = supabase
      .channel("players-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
        },
        () => {
          fetchPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔐 AUTH
  const signUp = async () => {
  if (!username) {
    alert("Enter a username");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log(error);
    return;
  }

  const user = data.user;
  setUser(user);

  const { data: existing } = await supabase
  .from("players")
  .select("*")
  .eq("name", username);
  console.log(data)

if (existing.length > 0) {
  alert("Username already taken");
  return;
}

  // 🔥 create player with custom name
  await supabase.from("players").insert([
    {
      name: username,
      chips: 75,
      bank: 0,
      user_id: user.id,
    },
  ]);
};

  const signIn = async () => {
  const { data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const user = data.user;
  setUser(user);

  // check if player exists
  const { data: existing } = await supabase
    .from("players")
    .select("*")
    .eq("user_id", user.id);

  if (!existing || existing.length === 0) {
    await supabase.from("players").insert([
      {
        name: email.split("@")[0], // default for now
        chips: 75,
        bank: 0,
        user_id: user.id,
      },
    ]);
  }
};

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const sortedPlayers = [...players].sort(
    (a, b) => (b.chips + b.bank) - (a.chips + a.bank)
  );

  const topProfit = Math.max(
    ...players.map((p) => p.chips + p.bank - 75),
    0
  );

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
  placeholder="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

        <br /><br />

        <button onClick={signIn}>Login</button>
        <button onClick={signUp}>Create Account</button>
      </div>
    );
  }

  // 🏆 MAIN APP
  return (
    <div style={{ display: "flex" }}>
    
   {/* SIDEBAR */}
<div style={{
  width: 200,
  background: "#111",
  color: "white",
  minHeight: "100vh",
  padding: 10,
  display: "flex",
  flexDirection: "column"
}}>

  <h2>PTP POKER 🐷</h2>

  {/* 🔴 LOGOUT */}
  <div
    onClick={signOut}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#9b0808")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "#ba1021")}
    style={{
      padding: 10,
      borderRadius: 6,
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: "#ba1021"
    }}
  >
    ❌ LOGOUT
  </div>

  <br />


  {/* 📜 NAV */}
  <div
    onClick={() => setTab("players")}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
    onMouseLeave={(e) =>
      (e.currentTarget.style.background =
        tab === "players" ? "#333" : "transparent")
    }
    style={{
      padding: 10,
      borderRadius: 6,
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: tab === "players" ? "#333" : "transparent",
    }}
  >
    🏠 Main Table
  </div>

  <div
  onClick={() => setTab("cards")}
  onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
  onMouseLeave={(e) =>
    (e.currentTarget.style.background =
      tab === "cards" ? "#333" : "transparent")
  }
  style={{
    padding: 10,
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: tab === "cards" ? "#333" : "transparent",
  }}
>
  🃏 Player Stats
</div>

  <div
    onClick={() => setTab("history")}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
    onMouseLeave={(e) =>
      (e.currentTarget.style.background =
        tab === "history" ? "#333" : "transparent")
    }
    style={{
      padding: 10,
      borderRadius: 6,
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: tab === "history" ? "#333" : "transparent",
    }}
  >
    📜 History
  </div>

</div>

    {/* MAIN (YOUR EXISTING APP) */}
    <div style={{ flex: 1, padding: 20}}>

      {/* KEEP YOUR CURRENT CODE HERE */}



      <br /><br />

        {/* TABLE */}
      { tab === 'players' &&(<table style={{ width: "100%", marginTop: 20 }}>
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
            const amt = amounts[p.id] || 0;

            const isOwner = user.id === p.user_id;

            return (
              <tr
  key={p.id}
  style={{
    textAlign: "center",
    backgroundColor: user.id === p.user_id ? "#1a1a2e" : "transparent",
    border: user.id === p.user_id ? "2px solid cyan" : "none",
  }}
>
                <td>
                  {i === 0 && "🥇 "}
                  {i === 1 && "🥈 "}
                  {i === 2 && "🥉 "}
                  {i + 1}
                </td>

                <td>{p.name}  {user.id === p.user_id && (
    <span style={{ marginLeft: 6, color: "cyan", fontWeight: "bold" }}>
      (You)
    </span>
  )}</td>
                <td>{p.chips}</td>
                <td>{p.bank}</td>
                <td>{total}</td>

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
                
                <td>
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    
    {/* INPUT */}
    <input
      type="number"
      placeholder="Enter amount"
      value={amounts[p.id] || ""}
      onChange={(e) =>
        setAmounts({
          ...amounts,
          [p.id]: Number(e.target.value),
        })
      }
      style={{ width: "100%" }}
      disabled={!isOwner}
    />

    {/* CHIP ACTIONS */}
    <div style={{ display: "flex", gap: 4 }}>
      <button disabled={!isOwner} style={{ flex: 1 }} onClick={async () => {
    await supabase
      .from("players")
      .update({ chips: p.chips + amt })
      .eq("id", p.id);

      await supabase.from("transactions").insert([
    {
      player_id: p.id,
      user_id: user.id,
      type: "chips",
      amount: amt,
    },
  ]);
    setAmounts({ ...amounts, [p.id]: "" });
  }}>+ Chips</button>
      <button disabled={!isOwner} style={{ flex: 1 }} onClick={async () => {
    await supabase
      .from("players")
      .update({ chips: p.chips - amt })
      .eq("id", p.id);

      await supabase.from("transactions").insert([
    {
      player_id: p.id,
      user_id: user.id,
      type: "chips",
      amount: -amt,
    },
  ]);

    setAmounts({ ...amounts, [p.id]: "" });
  }}>- Chips</button>
    </div>

    {/* BANK ACTIONS */}
    <div style={{ display: "flex", gap: 4 }}>
      <button disabled={!isOwner} style={{ flex: 1 }} onClick={async () => {
    await supabase
      .from("players")
      .update({ bank: p.bank + amt })
      .eq("id", p.id);

      await supabase.from("transactions").insert([
    {
      player_id: p.id,
      user_id: user.id,
      type: "bank",
      amount: amt,
    },
  ]);

    setAmounts({ ...amounts, [p.id]: "" });
  }}>+ Bank</button>
      <button disabled={!isOwner} style={{ flex: 1 }} onClick={async () => {
    await supabase
      .from("players")
      .update({ bank: p.bank - amt })
      .eq("id", p.id);

      await supabase.from("transactions").insert([
    {
      player_id: p.id,
      user_id: user.id,
      type: "bank",
      amount: -amt,
    },
  ]);

    setAmounts({ ...amounts, [p.id]: "" });
  }}>- Bank</button>
    </div>

    {/* CASH OUT */}
    <button disabled={!isOwner} onClick={async () => {
    await supabase
      .from("players")
      .update({ chips: p.chips + p.bank, bank: 0})
      .eq("id", p.id);

      await supabase.from("transactions").insert([
    {
      player_id: p.id,
      user_id: user.id,
      type: "cashout",
      amount: p.bank,
    },
  ]);

    setAmounts({ ...amounts, [p.id]: "" });
  }}>💰 Cash Out</button>

    {!isOwner && (
      <span style={{ fontSize: 12, opacity: 0.5 }}>
        Not your player
      </span>
    )}
  </div>
</td>
               
              </tr>
            );
          })}
        </tbody>
      </table>
      )}

     {tab === "history" && (
  <div>
    <h2>Transaction History</h2>

    {transactions && transactions.length > 0 ? (
      transactions.map((t, i) => {
        const name = t.players?.name || "Unknown";
        const amt = Number(t.amount);

        let color = amt > 0 ? "limegreen" : "red";
        let text = "";

        if (t.type === "chips") {
          text = `${name}: ${amt > 0 ? "+" : ""}${amt} chips`;
        }

        if (t.type === "bank") {
          text = `${name}: ${amt > 0 ? "+" : ""}${amt} bank`;
        }

        if (t.type === "cashout") {
          text = `${name} cashed out ${amt} from bank`;
          color = "gold";
        }

        return (
          <div key={i} style={{ borderBottom: "1px solid gray", padding: 8 }}>
            <strong style={{ color }}>{text}</strong>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {new Date(t.created_at).toLocaleString()}
            </div>
          </div>
        );
      })
    ) : (
      <p>No transactions yet</p>
    )}
  </div>
)}

    {tab === "cards" && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 16,
    }}
  >
    {sortedPlayers.map((p) => {
      const total = p.chips + p.bank;
      const profit = total - 75;

      return (
        <div
          key={p.id}
          onClick={() => setSelectedPlayer(p)}
          style={{
            padding: 15,
            borderRadius: 12,
            background: "#1a1a2e",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.background = "#222";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#1a1a2e";
          }}
        >
          <h3>{p.name}</h3>

          <p>💰 Total: {total}</p>
          <p>🪙 Chips: {p.chips}</p>
          <p>🏦 Bank: {p.bank}</p>

          <p
            style={{
              color: profit >= 0 ? "lime" : "red",
              fontWeight: "bold",
            }}
          >
            Profit: {profit}
          </p>
        </div>
      );
    })}
  </div>
)}

    </div>
</div>
  );
}





     