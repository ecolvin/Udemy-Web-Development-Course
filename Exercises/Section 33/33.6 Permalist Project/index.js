import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "password",
  port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Clean litter box" },
  { id: 2, title: "Job applications" },
];

async function updateItems()
{
  try
  {
    const result = await db.query("SELECT * FROM items;");
    items = result.rows;
  }
  catch (err)
  {
    console.error(err);
  }
}

app.get("/", async (req, res) => {
  await updateItems();

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  
  try
  {
    await db.query(
      "INSERT INTO items (title) VALUES ($1);",
      [item]
    );
  }
  catch (err)
  {
    console.error(err);
  }
  
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;

  try
  {
    await db.query(
      "UPDATE items SET title = $1 WHERE id = $2;",
      [title, id]
    );
  }
  catch (err)
  {
    console.error(err);
  }

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;

  try
  {
    await db.query(
      "DELETE FROM items WHERE id = $1;",
      [id]
    );
  }
  catch (err)
  {
    console.error(err);
  }

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Set up shutdown handlers
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

async function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  
  try {
    await db.end();
    console.log('PostgreSQL client disconnected');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown', err);
    process.exit(1);
  }
}


/*

  try
  {
    await db.query(
      "",
      []
    );
  }
  catch (err)
  {
    console.error(err);
  }

*/