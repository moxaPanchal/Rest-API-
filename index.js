// Requiring all Dependencies

const express = require("express");

const bodyparser = require("body-parser");

const mongoose = require('mongoose');

const EJS = require("ejs");



//-----------------------------------------------------------------------------------

const app = express();

app.set('view-engine','ejs');

app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));


// COnnecting mongoose to local Database
mongoose.connect("mongodb://localhost:27017/WikiDb",{useNewUrlParser:true});

// article schema
const articleSchema = {
    title: String,
    content: String
}

// Mongoose Model
const Article = mongoose.model("Article", articleSchema);

//--------------------------------------------------------------------------

// creating chained routes
app.route("/article")

.get(
    function(req, res){
        Article.find(function(err, foundArticle){
            
            if(!err){
                res.send(foundArticle);
            }
            else{
                res.send(err);
            }
        });
    }
)

// post route
.post(
    function(req,res){
        console.log(req.body.title);
        console.log(req.body.content);
    
        // Saving the data
    
        const ArticleData = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        ArticleData.save(function(err){
            if(!err){
                res.send("Sucessfuly added article");
            }
            else{
                res.send(err);
            }
        });
    }
)

// Delete route
.delete(
    function(req,res){
        Article.deleteMany(
            function(err, deleteArticle){
                if(!err){
                    res.send('Sucessfully deleted all articles');
                }
                else{
                    res.send(err);
                }
            }
        )
    }
)
//----------------------------------------------------------------------------------------------------------------


// route for speccific article
app.route("/article/:articleTitle")
.get(function(req,res){
    {
        Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
            if(!err){
                res.send(foundArticle)
            }
            else{
                res.send(err);
            }
        });
    }
})

.put(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Updated sucesfully")
            }
            else{
                res.send(err)
            }
        }
    );
})

.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("field updated sucesfully")
            }
            else{
                res.send(err)
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteMany(
        {title:req.params.articleTitle},
        function(err, deleteArticle){
            if(!err){
                res.send('Sucessfully deleted all articles');
            }
            else{
                res.send(err);
            }
        }
    )
});



// // create new route (article) to fetch all articles from database
// app.get("/article",);
// //-----------------------------------------------------------------

// //post requset
// app.post("/article", )
// //------------------------------------------------------------------

// // delete route for articles
// app.delete("/article",)
// //----------------------------------------------------------------

//Update the server on localhost 3000
app.listen(3000,function(req,res){
    console.log("app running on localhost 8000");
})