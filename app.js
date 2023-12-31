const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({extended: true}));

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

///////////////////////////// REQUEST TARGETING ALL ITEMS /////////////////////////////

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

///////////////////////////// REQUESTS TARGETING A SPECIFIC ARTICLE /////////////////////////////
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
.put(async(req, res) => {
    // replace the article with the new one
    try {
        await Article.findOneAndReplace(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content})
        res.send("Succesfully update the article")
    } catch(err) {
        res.send(err)
    }
})
.patch(async(req, res) => {
    // update only the fields that we provide for
    try {
        await Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body})
        res.send("Succesfully update the article")
    } catch(err) {
        res.send(err)
    }
})
.delete(async(req, res) => {
    try {
        await Article.deleteOne({title: req.params.articleTitle})
        res.send("Successfully delete the article")
    } catch(err) {
        res.send(err)
    }
});

app.listen(3000, () => {
    console.log("Server is listening at port 3000")
})