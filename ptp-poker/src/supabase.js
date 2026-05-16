import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const fetchPlayers = async () => {
  const { data, error } = await supabase.from("players").select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (data) setPlayers(data);
};