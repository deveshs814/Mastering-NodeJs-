//Creating a server using express.

const express = require("express");

const app = express();

app.listen(3000,() =>{
    console.log("Server is listening to the port 3000");
})