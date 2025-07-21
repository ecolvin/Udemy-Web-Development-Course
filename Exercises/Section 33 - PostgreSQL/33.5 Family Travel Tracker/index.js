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

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisited() {
  let countries = [];
  try 
  {
    const result = await db.query(
      "SELECT country_code FROM visited_countries WHERE user_id = $1;", 
      [currentUserId]
    );
    
    result.rows.forEach((country) => {
      countries.push(country.country_code);
    });
  }
  catch (err)
  {
    console.error(err);
  }
  return countries;
}

async function updateUsers() 
{
  try
  {
    const result = await db.query(
      "SELECT * FROM users;"
    );
    if(result.rows)
    {
      users = result.rows;
    }
    if(users.length <= 0)
    {
      currentUserId = -1;
    }
    else if(users.find(user => user.id === currentUserId) === undefined)
    {
      currentUserId = users[0].id;
    }
  }
  catch (err)
  {
    console.error(err);
  }
}

async function getHomePageData(errorMessage)
{
  console.log("Refreshing home page data...");
  await updateUsers();
  console.log(`Updated Users:`);
  console.log(users);
  const curUser = users.find(user => user.id === currentUserId);
  console.log(`Current User:`);
  console.log(curUser);
  let curColor = "teal";
  if(curUser !== undefined)
  {
    curColor = curUser.color;
  }
  console.log(`Current Color: ${curColor}`);
  const countries = await checkVisited();
  console.log(`Countries Visited: ${countries}`);
  console.log(`Error Message: ${errorMessage}`);
  if(errorMessage === "")
  {
    return {
      countries: countries,
      total: countries.length,
      users: users,
      color: curColor,
    };
  }
  else
  {
    return {
      countries: countries,
      total: countries.length,
      users: users,
      color: curColor,
      error: errorMessage
    };
  }
}

app.get("/", async (req, res) => {
  const data = await getHomePageData("");
  console.log(`Loading page for user ${currentUserId}`);
  res.render("index.ejs", data);
});

app.post("/add", async (req, res) => {
  const input = req.body.country;

  try 
  {
    console.log(`Retrieving country code for ${input}...`);
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    if(result.rowCount !== 0)
    {
      const data = result.rows[0];
      const countryCode = data.country_code;
      console.log(`Country code found: ${countryCode}`);
      try 
      {
        console.log(`Adding ${countryCode} to user ${currentUserId}...`);
        await db.query(
          "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2);",
          [countryCode, currentUserId]
        );
        console.log('Success!');
        res.redirect("/");
      } 
      catch (err) 
      {
        console.error(err);

        const data = await getHomePageData("Country has already been added, try again...");
        res.render("index.ejs", data);
      }
    }
    else
    {
      console.error(`Could not find ${input} in the database!`);
      
      const data = await getHomePageData("Country does not exist, try again...");
      res.render("index.ejs", data);
    }
  } 
  catch (err) 
  {
    console.error(err);

    const data = await getHomePageData("Unknown error while querying database, try again...");
    res.render("index.ejs", data);
  }
});

app.post("/user", async (req, res) => {
  if(req.body.user)
  {
    currentUserId = parseInt(req.body.user);
    console.log(`Switching to user ${currentUserId}`);
    res.redirect("/");
  }
  else if(req.body.add)
  {
    res.render("new.ejs");
  }
  else
  {
    console.error(req);

    const data = await getHomePageData("Invalid request for user endpoint, try again...");
    res.render("index.ejs", data);
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const name = req.body.name;
  const color = req.body.color;

  try
  {
    const result = await db.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *;", 
      [name, color]
    );    

    if(result.rowCount !== 0)
    {
      currentUserId = result.rows[0].id;
    }

    res.redirect("/");
  }
  catch (err)
  {
    console.error(err);
    const data = await getHomePageData("Error adding user! See console for details.");
    res.render("index.ejs", data);
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