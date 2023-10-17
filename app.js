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

// REQUEST TARGETING ALL ITEMS

app.route("/articles")
.get(async(req, res) => {
    // fetch all the articles
    try {
        res.send(await Article.find({}).exec())
    } catch(err) {
        res.send(err)
    }
})
.post(async(req, res) => {
    // insert a new item inside the collection
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
.delete(async(req, res) => {
    // delete all the aricles
    try {
        await Article.deleteMany({})
        res.send("Successfully deleted all the articles")
    } catch(err) {
        res.send(err)
    }
});

// REQUESTS TARGETING A SPECIFIC ARTICLE
// REMEMBER: the space is encoded like %20, for example for fetch an article
// on Jhon Doe the route is /articles/Jhon%20Doe

app.route("/articles/:articleTitle")
.get(async(req, res) => {
    try {
        res.send(await Article.findOne({title: req.params.articleTitle}).exec())
    } catch(err) {
        res.send(err)
    }
})

app.listen(3000, () => {
    console.log("Server is listening at port 3000")
})