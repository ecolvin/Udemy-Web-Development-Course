import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

//CHALLENGE 1: GET All posts

app.get("/posts", async (req, res) => {
  res.json(posts);
});

//CHALLENGE 2: GET a specific post by id

app.get("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(post => post.id === id)
  if(post)
  {
    res.json(post);
  }
  else
  {
    res.status(404).json({
      error: `Post with id: ${id} not found.`
    })
  }
});

//CHALLENGE 3: POST a new post

app.post("/posts", async (req, res) => {
  let id = 1;
  if(posts.length > 0)
  {
    id = posts.at(-1).id + 1;
  }
  const newPost = {
    id: id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString()
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

//CHALLENGE 4: PATCH a post when you just want to update one parameter

app.patch("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const existingPost = posts.find(post => post.id === id);    
  const idx = posts.findIndex(post => post.id === id)
  if(existingPost && idx > -1)
  {
    const newPost = {
      id: id,
      title: req.body.title || existingPost.title,
      content: req.body.content || existingPost.content,
      author: req.body.author || existingPost.author,
      date: new Date().toISOString()
    };
    posts[idx] = newPost;
    res.json(newPost);
  }
  else
  {
    res.status(404).json({
      error: `Post with id: ${id} not found. Post could not be updated.`
    });
  }
});

//CHALLENGE 5: DELETE a specific post by providing the post id.

app.delete("/posts/:id", async (req, res) => {  
  const id = parseInt(req.params.id);
  const idx = posts.findIndex(post => post.id === id)
  if(idx > -1)
  {
    posts.splice(idx, 1);
    res.status(200).json({ 
      message: "Post deleted successfully." 
    });
  }
  else
  {
    res.status(404).json({
      error: `Post with id: ${id} not found. Post could not be deleted.`
    });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
