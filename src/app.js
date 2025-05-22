//Route and request handling.

//Always remember the order of route matters a lot.
//always declare route using HTTP methods.
const express = require("express");

const app = express();

//if u will use 'app.use' at the top then u will not be able to handle these HTTP methods properly.

app.get("/user" , (req,res)=>{
    res.send({firstName : "Devesh " , lastName: "Shukla"});
});
app.post("/user" , (req,res)=>{
    res.send("Data sent successfully to the database");
});
app.delete("/user" , (req,res)=>{
    res.send("User is deleted successfully");
});

app.listen(3000,(req,res)=>{
    console.log("Server is listening to the port 3000");
});
//one more thing to understand, if u are declaring any route with app.use then for 
//specific route say /hello , u have designed any specific response but if u will try to access 
// '/hello/2' and have written this route and request after the previous one then u will not get the desired output.
// so if u want to get the correct output then u have to declare it at the top or above that specific route.

//let's talk a little about regex--
// 1 -  /a/ - it states ki agr aapke route me last k word me agr'a' h to wo desired output de dega
// 2 -  /? - agr ye laga hua h mtlb iske just phle ka letter optional h ex - ab?c to agr route me 'ac' likhenge to wo 
// desired output de dega .. it won't say that route is not matching.