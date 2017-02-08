var fs = require("fs");
var file = "vgt.db";
var exists = fs.existsSync(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE Wishes (id INTEGER PRIMARY KEY, thing TEXT)");
    console.log("tables created!")
  } else {
      db.each("SELECT count(thing) AS rowCount FROM Wishes", function(err, row){
          console.log(row.rowCount);
      });
  }

  /*db.each("SELECT rowid AS id, thing FROM Wishes", function(err, row) {
    console.log(row.id + ": " + row.thing);
  });*/
});

exports.close = function() { db.close()}

function fetchData(callback, sqlQuery) {
    console.log("Query: " + sqlQuery)
    db.all(sqlQuery, function(err, rows) {
        if (err)
            console.log("Error fetching data: " + err)
        
        console.log("Result Size: " + rows.length)
        callback(err, rows)
    })
    
}

exports.insertData = function(table, data)
{
    var stmt, insert = "INSERT INTO Wishes (thing)  VALUES (?)"
    db.serialize(function() {
        try {
            if (table != null && data != null) {
                console.log("prepare to insert: " + insert)
                db.run(insert, JSON.stringify(data))
                //console.log("INSERTING: table " + table + " data " + JSON.stringify(data))
            }
        } catch (err) {
            console.log("ERROR: " +  err)
        }
    })
}

exports.fetchData = fetchData;