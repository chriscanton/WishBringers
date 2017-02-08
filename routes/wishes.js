var ejs = require("ejs");
var sqlite = require('./sqllite');

exports.getWishes = function(req,res)
{
	var iResults={}, getWishes = "select * from wishes"
	sqlite.fetchData(function(err, results) {
		var item, idx=0
		if (err) {
			throw err
		} else {
			if (results) {
				iResults.wishes = []
				while (idx < results.length){
					try{
						item = JSON.parse(results[idx].thing)
					} catch (ex) {
						console.log(ex)
					}
					console.log(typeof item)
					if (item != null && typeof item != 'undefined') {
						iResults.wishes.push(item)
						console.log(item.wishCardId)
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
	vgtData.wishCardId = mapMe[0]
	vgtData.agencyCode = mapMe[8]
	vgtData.warehouse = mapMe[9]
	vgtData.barcode = mapMe[10]
	vgtData.agencyZone = mapMe[11]
	vgtData.agencyChild = mapMe[12]
	vgtData.firstName = mapMe[13]
	vgtData.cardGender = mapMe[14]
	vgtData.cardAge = mapMe[15]
	vgtData.specialNeed = mapMe[16]
	vgtData.preamble = mapMe[17]
	vgtData.giftId = mapMe[18]
	vgtData.giftDescription = mapMe[19]
	vgtData.giftAttribute = mapMe[20]
	vgtData.notice = mapMe[21]
	vgtData.giftDescription2 = mapMe[22]
	vgtData.hostCardCode = mapMe[23]

	return vgtData
}
//var mysql = require('./mysql');
exports.uploadData = function(req, res) {
	//console.log(req);
	
	var content = fs.readFileSync(req.files.file.path, { encoding: 'binary' });
	Papa.parse(content, {
	    step: function(row){
	        var data = mapRow(row.data[0])

			if(data.wishCardId != undefined && data.wishCardId != "")
				sqlite.insertData("WISHES", data)
	    }
	});
	
	res.render('home.ejs');
};


