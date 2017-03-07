var ejs = require("ejs");
var sqlite = require('./sqllite');

exports.getWishes = function(req,res)
{
	var iResults={}, getWishes = "select * from wishes"
	sqlite.fetchData(function(err, results) {
		var item={}, idx=0
		if (err) {
			throw err
		} else {
			if (results) {
				iResults.wishes = []
				while (idx < results.length){
					try{
						item = results[idx]
					} catch (ex) {
						console.log(ex)
					}
					console.log(typeof item)
					if (item != null && typeof item != 'undefined') {
						iResults.wishes.push(item)
					}
					idx++
				}
			}
			console.log(JSON.stringify(iResults))
			res.json(iResults)
		}
	}, getWishes)
	
}

var fs = require('fs');
var Papa = require('babyparse');
var mapRow = function(mapMe) {
	var vgtData = {}
	vgtData.giftDescription = mapMe[0]
	vgtData.age = mapMe[1]
	vgtData.price = mapMe[2]
	vgtData.quantityNeeded = mapMe[3]
	vgtData.gender = mapMe[4]
	console.log(JSON.stringify(vgtData))

	return vgtData
}
//var mysql = require('./mysql');
exports.uploadData = function(req, res) {
	//console.log(req);
	
	var content = fs.readFileSync(req.files.file.path, { encoding: 'binary' });
	Papa.parse(content, {
	    step: function(row){
	        var data = mapRow(row.data[0])
			sqlite.insertData(data)
	    }
	});
	
	res.render('home.ejs');
}


