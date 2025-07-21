import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

// HINTs: Use the axios documentation as well as the video lesson to help you.
// https://axios-http.com/docs/post_example
// Use the Secrets API documentation to figure out what each route expects and how to work with it.
// https://secrets-api.appbrewery.com/

//TODO 1: Add your own bearer token from the previous lesson.
const yourBearerToken = "17260913-cf88-4fe2-beea-bad91b2e21ea";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  console.log(req.body);
  const searchId = req.body.id;
  if(!searchId)
  {
    res.render("index.ejs", { content: "Please enter an id." });
  }
  else
  {
    try {
      const result = await axios.get(API_URL + "/secrets/" + searchId, config);
      res.render("index.ejs", { content: JSON.stringify(result.data) });
    } catch (error) {
      res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }
  }
});

app.post("/post-secret", async (req, res) => {
  // TODO 2: Use axios to POST the data from req.body to the secrets api servers.  
  const body = {
    secret: req.body.secret,
    score: req.body.score,
  };

  if(!body.secret)
  {
    res.render("index.ejs", { content: "Please enter a secret." });
  }
  else if(!body.score)
  {    
    res.render("index.ejs", { content: "Please enter a score." });
  }
  else
  {  

    try {
      const result = await axios.post(API_URL + "/secrets", body, config);
      res.render("index.ejs", { content: JSON.stringify(result.data) });
    } catch (error) {
      res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }
  }
});

app.post("/put-secret", async (req, res) => {
  // TODO 3: Use axios to PUT the data from req.body to the secrets api servers.

  const searchId = req.body.id;
  const body = {
    secret: req.body.secret,
    score: req.body.score,
  };
  
  if(!searchId)
  {
    res.render("index.ejs", { content: "Please enter an id." });
  }
  else if(!body.secret)
  {
    res.render("index.ejs", { content: "Please enter a secret." });
  }
  else if(!body.score)
  {    
    res.render("index.ejs", { content: "Please enter a score." });
  }
  else
  {
    try {
      const result = await axios.put(API_URL + "/secrets/" + searchId, body, config);
      res.render("index.ejs", { content: JSON.stringify(result.data) });
    } catch (error) {
      res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }
  }
});

app.post("/patch-secret", async (req, res) => {
  // TODO 4: Use axios to PATCH the data from req.body to the secrets api servers.

  const searchId = req.body.id;
  let body = {};
  if(!searchId)
  {
    res.render("index.ejs", { content: "Please enter an id." });
  }
  else if(!req.body.secret && ! req.body.score)
  {
    res.render("index.ejs", { content: "Please enter a secret or score." });
  }
  else 
  {
    if(req.body.secret)
    {
      body.secret = req.body.secret;
    }
    if(req.body.score)
    {
      body.score = req.body.score;
    }
    try {
      const result = await axios.patch(API_URL + "/secrets/" + searchId, body, config);
      res.render("index.ejs", { content: JSON.stringify(result.data) });
    } catch (error) {
      res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }
  }
});

app.post("/delete-secret", async (req, res) => {
  // TODO 5: Use axios to DELETE the item with searchId from the secrets api servers.
  const searchId = req.body.id;
  if(!searchId)
  {
    res.render("index.ejs", { content: "Please enter an id." });
  }
  else
  {
    try {
      const result = await axios.delete(API_URL + "/secrets/" + searchId, config);
      res.render("index.ejs", { content: JSON.stringify(result.data) });
    } catch (error) {
      res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
