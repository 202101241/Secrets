import bodyParser from "body-parser";
import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRound = 10;


//Declaration of constants
const { Schema } = mongoose;
const app = express();
const port = 3000;


//Middlewares
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


//Database
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new Schema({
	email: String,
	password: String,
});

const User = mongoose.model("User", userSchema);


//Get methods
app.get("/", (req, res) => {
	res.render("home");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.get("/logout", (req, res) => {
    res.redirect("/");
})


//Post methods
app.post("/login", (req, res) => {
    const email = req.body.username;
    const passwd = req.body.password;

    User.findOne({email: email}).then((success, err)=>{
        if(err){
            console.log(err);
        }
        else{
            if(success){
                bcrypt.compare(passwd, success.password, (err, result)=>{
                    if(result === true){
                        res.render("secrets");
                    }
                    else{
                        res.send("Wrong Password!");
                    }
                });
            }
            else{
                res.send("Wrong Email!");
            }
        }
    })

});

app.post("/register", (req, res) => {
    console.log(req.body);
    bcrypt.hash(req.body.password, saltRound, (err, hash)=>{
        const newUsr = new User({
            email: req.body.username,
            password: hash
        });
    
        newUsr.save().then((success, err)=>{
            if(err) throw err;

            console.log(`User added,`);
        });
        res.render("secrets");
    });
});


//Listening on port 3000
app.listen(port, (err) => {
	if (err) throw err;

	console.log("Server is running on port ", port,"...","✅");
});
