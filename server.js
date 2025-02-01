const express = require('express');    // Import express
const cors = require('cors');          // Import cors, Cross-Origin Resource Sharing for interacting with front-end(react)
const app = express();                  // Create an express app

app.use(express.json());     // Middleware for parsing JSON data
app.use(cors());    // Middleware for enabling CORS

let post = [];    // Array to store posts

// Fetch all posts
app.get("/posts", (req, res) => {        //fetches all the posts through the /posts endpoint
    res.json(post);          //returns the list of posts
});

// Create a new post
app.post("/newpost", (req, res) => {     //creates a new post through the /newpost endpoint
    const { title, content } = req.body;    //listens for the title and content of the post sent from the client(frontend)
    if (!title || !content) {                //if title or content is not provided, it will return a 400 status code with a message
        return res.status(400).json({ message: "title and content required" });
    }
    const newPost = { id: Date.now(), title, content };          //assigns a unique id ,title ,content (these are catched from the client )to the new post
    post.push(newPost);                //adds the new post to the list of posts
    res.json(newPost);                   //returns the new post
}); 

// Update an existing post
app.put("/updatepost/:id", (req, res) => {                     //updates an existing post through the /updatepost endpoint
    const { id } = req.params;                 //listens for the id of the post to be updated
    const { title, content } = req.body;       //listens for the title and content of the post sent from the client(frontend)
    const postToUpdate = post.find(post => post.id == id);  //finds the post to be updated from the list of posts using id
    if (!postToUpdate) {                            //if the post to be updated is not found, it will return a 404 status code with a message
        return res.status(404).json({ message: "post not found" });
    }
    postToUpdate.title = title;                 //else updates the title and content of the post
    postToUpdate.content = content;
    res.json(postToUpdate);                        //returns the updated post
});

// Delete a post
app.delete("/deletepost/:id", (req, res) => {           //deletes a post through the /deletepost endpoint
    const { id } = req.params;                           //listens for the id of the post to be deleted from the client(frontend)
    const postIndex = post.findIndex(post => post.id == id);    //finds the index of the post to be deleted from the list of posts
    if (postIndex === -1) {                                   //if the post to be deleted is not found, it will return a 404 status code with a message
        return res.status(404).json({ message: "post not found" });
    }
    post.splice(postIndex, 1);                                  //else deletes the post from the list of posts using the index,delets only one post
    res.json({ message: "post deleted" }); //returns a message that the post is deleted to the client
});

const port = 3000;
app.listen(port, () => {          //listens on port 3000
    console.log(`Server running on port ${port}`);   //logs a message to the console
});