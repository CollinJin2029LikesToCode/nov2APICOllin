const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    db: {
      schema: "public"
    },
    auth: {
      persistSession: false
    }
  }
);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res) => {
  res.json({message: "Server is running"});
})

app.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*");
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No users found in database" });
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/users-with-majors", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select(`
        id,
        first_name,
        last_name,
        email,
        major,
        major_table (
          school
        )
      `)
      .order("id");

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No users with majors found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user majors:", error);
    res.status(500).json({ error: "Failed to fetch user majors data" });
  }
});

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;
