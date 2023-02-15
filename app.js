//jshint esversion:6

require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
mongoose.set('strictQuery', true)

const encrypt = require("mongoose-encryption")

const app = express()

console.log(process.env.API_KEY)

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("public"))

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');

}

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = "Thisisourlittlesecret."
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", (req,res)=>{
    res.render("home")
})
app.get("/login", (req,res)=>{
    res.render("login")
})
app.get("/register", (req,res)=>{
    res.render("register")
})
app.get("/secrets", (req,res)=>{
    res.render("secrets")
})
app.get("/submit", (req,res)=>{
    res.render("submit")
})

app.post("/register", (req,res)=>{
    const user = new User({
        email: req.body.username,
        password: req.body.password
    })

    user.save(err=>{
        if(err){
            console.log(err)
        }
        else{
            res.render("secrets")
        }
    })
})

app.post("/login", (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}, (err, foundUser)=>{
        if(err){
            console.log(err) 
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }
            }
        }
    })
})

app.listen(3001, ()=>{
    console.log("Server running on port 3001")
})