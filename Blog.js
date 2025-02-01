import React, { useState, useEffect } from 'react';
import './App.css'; 

function Blog() {
    const [title, setTitle] = useState(""); //It tracks the title of the post
    const [content, setContent] = useState(""); //It tracks the content of the post
    const [posts, setPosts] = useState([]); //It tracks the list of posts
    const [updatingPostId, setUpdatingPostId] = useState(null); //It tracks the id of the post being updated

    // Fetch posts when component mounts
    useEffect(() => {
        fetch("http://localhost:3000/posts") // Fetch all posts from the server
            .then(response => response.json()) //json response
            .then(data => setPosts(data))  //set the posts with the data fetched from the server
            .catch(err => console.error("Error fetching posts:", err));  //error handling
    }, []); // Empty dependency array ensures this runs only once otherwise it will run infinitely

    // Function to handle new post submission
    function handleSubmit(e) {  //is executed when the form is submitted
        e.preventDefault();     //prevents the default form submission
        const newPost = { title, content };  //when we submit the form,  the title and content values are stored in the newPost object
        if (updatingPostId) {       //executes if the updatingPostId is not null,if this false then it will add a new post which in else block
            fetch(`http://localhost:3000/updatepost/${updatingPostId}`, { //requests the server for the post with the updatingPostId
                method: "PUT",  //In the server.js file, we have defined the PUT method for updating a post
                headers: { "Content-Type": "application/json" }, //specifies the content type of the request
                body: JSON.stringify(newPost) //converts the newPost object to a JSON string
            })
                .then(response => response.json())   //converts the response to JSON
                .then(data => {                     //updates the post with the new data u gave in the form before clicking submit button
                    setPosts(posts.map(post => post.id === updatingPostId ? data : post));  //updates the post with the new data u gave in the form before clicking submit button
                    setTitle("");   //resets the title
                    setContent("");   //resets the content
                    setUpdatingPostId(null);       //resets the updatingPostId
                })
                .catch(err => console.error("Error updating post:", err));   //error handling
        } else {
            fetch("http://localhost:3000/newpost", {    //executes if the updatingPostId is null,if this true then it will add a new post
                method: "POST",                         //In the server.js file, we have defined the POST method for creating a new post
                headers: { "Content-Type": "application/json" },   //specifies the content type of the request
                body: JSON.stringify(newPost)      //converts the newPost object to a JSON string
            })
                .then(response => response.json())    //converts the response to JSON
                .then(data => {                    //adds the new post obtained fetched from the server to the list of previous posts using spread operator
                    setPosts([...posts, data]);
                    setTitle("");        
                    setContent("");
                })
                .catch(err => console.error("Error creating post:", err)); //error handling
        }
    }

    function handleUpdate(postId) {         //is executed when the update button is clicked
        const postToUpdate = posts.find(post => post.id === postId);     //finds the post from the list of posts with the postId, which is the id of the post being updated
        setTitle(postToUpdate.title);    //sets the title of the post to be updated
        setContent(postToUpdate.content);            //sets the content of the post to be updated
        setUpdatingPostId(postId);              //sets the updatingPostId to the postId
    }

    function handleDelete(postId) {                        //is executed when the delete button is clicked
        fetch(`http://localhost:3000/deletepost/${postId}`, {        //requests the server with deletepost endpoint to delete the post with the postId
            method: "DELETE"                                        //In the server.js file, we have defined the DELETE method for deleting a post
        })
            .then(response => {                                       
                if (response.ok) {                                //if response is ok
                    setPosts(posts.filter(post => post.id !== postId));          //gives the posts which are not equal to the id to be deleted (postId)
                } else {                                                             //if response is not ok
                    console.error("Error deleting post");                      //error handling                         
                }
            })
            .catch(err => console.error("Error deleting post:", err));           //error handling
    }

    return (                         //returns the Blog JSX
        <div className="container">  
            <header>
                <h1>My Blog</h1>                    
            </header>                             
            <div className="new-post-form">
                <h2>{updatingPostId ? "Update Post" : "Create a New Post"}</h2>    
                <form onSubmit={handleSubmit}>                                  
                    <label htmlFor="title">Title</label>                      
                    <input           //input field for the title of the post and the onChange event listener calls the setTitle function
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}  //textarea for the content of the post and the onChange event listener calls the setContent function
                        rows="5"
                        required
                    ></textarea>
                    <button type="submit">{updatingPostId ? "Update" : "Submit"}</button>             
                </form>
            </div>
            <ul className="post-list">
                {posts.map((post) => (  //iterates over the posts array and displays the title and content of each post with a unique id and two buttons, Update and Delete
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <button onClick={() => handleUpdate(post.id)}>Update</button>      
                        <button onClick={() => handleDelete(post.id)}>Delete</button>       
                    </li>
                ))}
            </ul>
            <footer>
                <p>&copy; 2025 My Blog</p>                                   
            </footer>
        </div>
    );
}

export default Blog;