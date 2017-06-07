
/*
 * GET home page.
 */
var ejs = require("ejs");

exports.index = function(req, res){
	
	res.render('home.ejs');
	
};

exports.registercompany = function(req, res){

	   res.render('register.ejs');

	}

