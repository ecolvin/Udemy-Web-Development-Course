import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Secrets",
  password: "password",
  port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try
  {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE email = $1;",
      [email]
    );

    console.log(checkResult.rowCount);

    if(checkResult.rowCount === 0)
    {
      await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2);",
        [email, password]
      );
      res.render("secrets.ejs");
    }
    else
    {
      res.send(`A user with the email ${email} already exists!`);
    }
  }
  catch (err)
  {
    console.error(err);
    res.send(`An error occurred. Please try again!`);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try
  {
    const result = await db.query(
      "SELECT password FROM users WHERE email = $1;",
      [email]
    );

    if(result.rowCount > 0)
    {
      if(result.rows[0].password === password)
      {
        res.render("secrets.ejs");
      }
      else
      {
        res.send(`Incorrect Password!`);
      }
    }
    else
    {
      res.send(`User with provided email (${email}) not found!`);
    }
  }
  catch (err)
  {
    console.error(err);
    res.render("login.ejs");
  }
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