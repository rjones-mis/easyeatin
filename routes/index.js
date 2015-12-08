var express = require('express');
var router  = express.Router();
var process = require("process");

// Set up Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// Recipe schema
var recipe_schema = mongoose.Schema({name: String, type: String, directions: [String], comments: [String], image: String});
var Recipe        = mongoose.model("Recipe", recipe_schema);

// Comment schema
var comment_schema = mongoose.Schema({text: String });
var Comment        = mongoose.model("Comment", comment_schema);

// Open Mongoose connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // Do something when connection is opened
});

// Clean up at the end of application life
process.on("SIGINT",  function() {
  db.close(function() {
    console.log("Mongoose default connection disconnected.");
    process.exit(0);
  });
});

// Recipe routes
router.get('/recipes', function(req, res, next){
  var q  = req.query.q;
  var id = req.query.id;

  if(id) {
    Recipe.findById(id, function(err, r) { res.json(r); });
  } else {
    Recipe.find({name : new RegExp(q, "i")}, function (err, query) {
      res.json(query);
      console.log(query);
    });
  }
});

router.put('/recipes', function(req, res, next) {
	var id = req.body.id;
	Recipe.findById(id, function(err, r) {
 	var c = true;
	if (c == true){
		if (r == null){
		console.log("Didn't find anything here!");
		}
		r.comments.push(req.body.comments);
		console.log(r)
		}
	r.save(function(err) {
	  if (err)
		console.log('error')
	  else
		console.log('success')
	});
  });
  res.json("{message:'Recipe PUT'}");
});
router.post('/recipes', function(req, res, next) {
  console.log(req.body);
  var instructions = String(req.body.directions).split(",");
  var new_recipe = new Recipe(
    { name: req.body.name,
      type: req.body.type,
      directions: instructions,
      image: req.body.image
    }
  );

  new_recipe.save(
    function(err, recipe) {
      if(err) return console.error(err);
      console.log(recipe);
    }
  ).then(
    function(success) {
      //res.json("{ message: 'Recipe Posted', data: success }");
      res.json({message: "Recipe Posted", data: success });
      //res.json("{message:'Recipe POST'}");
    },
    function(error)   {
      res.json("{message:'Recipe ERROR POST'}");
    }
  );
});

router.delete('/recipes', function(req, res, next) {
  Recipe.findByIdAndRemove('56659128058c90fa40907729', function(err, r) {
    if (!r)
      return next(new Error('Could not load Document!'));
  });	
  res.json("{message:'Recipe DELETE'}");
});

router.post('/comments', function(req, res, next) {
  var new_comment = new Comment(
	{
	text: req.body.comments
	});
	new_comment.save(
	function(err, comment) {
	  if(err) return console.log(err);
	  console.log(comment);
          }
	).then(
	  function(success) {
	  res.json({message: "Comment Posted", data: success });
	  },
	  function(error) {
	    res.json('{message: "Recipe ERROR POST"}');
	  }
	);
});

router.get('/comments', function(req, res, next) {
id = req.query.id;
if(id) {
    Recipe.findById(id, function(err, r) { res.json(r.comments); });
 }
});



router.post('/comments', function(req, res, next) {
id = req.query.id;
if(id) {
    Recipe.findById(id, function(err, r) { res.json(r.comments); });
 }
});

module.exports = router;
