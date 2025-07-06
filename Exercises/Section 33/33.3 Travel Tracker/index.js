import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "password",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited()
{
  let countries = [];

  try 
  {
    const result = await db.query("SELECT country_code FROM visited_countries");
    
    result.rows.forEach((country) => {
      countries.push(country.country_code);
    });
  }
  catch (error)
  {
    console.error("Error executing query", error.stack);
  }

  return countries;
}

app.get("/", async (req, res) => { 
  const countries = await checkVisited();

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
  });
});

app.post("/add", async (req, res) => {  
  try
  {
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'", [req.body.country.toLowerCase()]);
        
    if(result.rowCount !== 0)
    {
      const country_code = result.rows[0].country_code;

      try
      {
        await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [country_code]);
      
        console.log(`Successfully inserted ${req.body.country} (${country_code}) into the database!`);
    
        res.redirect("/");
      }
      catch (error)
      {
        console.error("Error executing query", error.stack);

        const countries = await checkVisited();

        res.render("index.ejs", {
          countries: countries,
          total: countries.length,
          error: "Country has already been added, try again..."
        });
      }
    }
    else
    {
      console.error(`Could not find ${req.body.country} in the database!`);
      
      const countries = await checkVisited();

      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country does not exist, try again..."
      });
    }
  }
  catch (error)
  {
    console.error("Error executing query", error.stack);
  }  
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
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