const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Database setup
url = "mongodb://127.0.0.1:27017/wikiDB"
async function databaseConnect() {
    try {
        await mongoose.connect(url)
        console.log("Connected to the database")
    } catch(err) {
        console.log(err)
    }  
}
databaseConnect()

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    }
})

const Article = new mongoose.model("Article", articleSchema)

app.get("/articles", async(req, res) => {
    // fetch all the articles
    try {
        const articlesList = await Article.find({}).exec()
        res.send(articlesList)
    } catch(err) {
        res.send(err)
    }
})

app.post("/articles", async(req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    })

    try {
        await article.save()
        res.send("Successfully added a new article")
    } catch(err) {
        console.log(err)
    }
})

app.listen(3000, () => {
    console.log("Server is listening at port 3000")
})