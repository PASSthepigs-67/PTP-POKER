import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [players, setPlayers] = useState([]);
  const [amounts, setAmounts] = useState({});

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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log(error);
    return;
  }

  // 🔥 Auto login after signup
  const user = data.user;
  setUser(user);

  // 🔥 Create player instantly
  await supabase.from("players").insert([
    {
      name: email.split("@")[0],
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

        <br /><br />

        <button onClick={signIn}>Login</button>
        <button onClick={signUp}>Create Account</button>
      </div>
    );
  }

  // 🏆 MAIN APP
  return (
    <div style={{ padding: 20 }}>
      <h1>🏆 PTP Poker</h1>

      <button onClick={signOut}>Logout</button>

      <br /><br />


      {/* TABLE */}
      <table style={{ width: "100%", marginTop: 20 }}>
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

    setAmounts({ ...amounts, [p.id]: "" });
  }}>+ Chips</button>
      <button disabled={!isOwner} style={{ flex: 1 }} onClick={async () => {
    await supabase
      .from("players")
      .update({ chips: p.chips - amt })
      .eq("id", p.id);

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

    setAmounts({ ...amounts, [p.id]: "" });
  }}>+ Bank</button>
      <button disabled={!isOwner} style={{ flex: 1 }} onClick={async () => {
    await supabase
      .from("players")
      .update({ bank: p.bank - amt })
      .eq("id", p.id);

    setAmounts({ ...amounts, [p.id]: "" });
  }}>- Bank</button>
    </div>

    {/* CASH OUT */}
    <button disabled={!isOwner} onClick={async () => {
    await supabase
      .from("players")
      .update({ chips: p.chips + p.bank, bank: 0})
      .eq("id", p.id);

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
    </div>
  );
}