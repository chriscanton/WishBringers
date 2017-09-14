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
    //Wishes
    db.run("CREATE TABLE Wishes (id INTEGER PRIMARY KEY, description TEXT, price FLOAT, quantity INTEGER, age INTEGER, gender CHARACTER(1), imgUrl TEXT)");
    //DriveLeader
    db.run("CREATE TABLE DriveLeader (id INTEGER PRIMARY KEY, name TEXT, email TEXT, g_token TEXT)")
    //Donor
    db.run("CREATE TABLE Donor (id INTEGER PRIMARY KEY, name TEXT, email TEXT)")
    //ORGANIZATION
    db.run("CREATE TABLE Organization (id INTEGER PRIMARY KEY, name TEXT, owner INTEGER, link_name TEXT, image_url TEXT, FOREIGN KEY(owner) REFERENCES DRIVELEADER(id))")
    db.run("CREATE TABLE PERSON (id INTEGER PRIMARY KEY, FirstName TEXT, LastName TEXT, Salutation VARCHAR(3), Address TEXT, City TEXT, STATE CHAR(2), ZIP INTEGER, EMAIL TEXT)")
    //Transaction
    db.run(" CREATE TABLE TXN (id INT PRIMARY KEY, NAME TEXT, ADDRESS Text, CITY Text, State VARCHAR(2), EMAIL Text, COMPANY Text, ORGANIZATION Text, Amount Real)")
    //Drive Info
    db.run("CREATE TABLE Drive (id INT PRIMARY KEY, leaderName TEXT, email TEXT, orgName TEXT, extId TEXT, urlVal TEXT, insertTime NUMBER)")

    console.log("tables created!")
  } else {
      db.each("SELECT count(1) AS rowCount FROM Wishes", function(err, row){
          console.log(row.rowCount);
      });
  }

});

exports.close = function() { db.close()}

exports.fetchData = function(callback, sqlQuery) {
    console.log("Query: " + sqlQuery)
    db.all(sqlQuery, function(err, rows) {
        if (err)
            console.log("Error fetching data: " + err)
        
        console.log("Result Size: " + rows.length)
        callback(err, rows)
    })
    
}

exports.insertData = function(data)
{
    var stmt, insert = "INSERT INTO Wishes (description, price, quantity, age, gender, imgUrl)  VALUES (?, ?, ?, ?, ?, ?)"
    console.log("inserting wish: " + JSON.stringify(data))
    db.serialize(function() {
        try {
            if (data != null) {
                console.log("prepare to insert: " + insert)
                db.run(insert, data.giftDescription, data.price, data.quantityNeeded, data.age, data.gender, data.imgUrl)
                //console.log("INSERTING: table " + table + " data " + JSON.stringify(data))
            }
        } catch (err) {
            console.log("ERROR: " +  err)
        }
    })
}

exports.insertTxn = function(txnObj, callback) {
    var insertTxn =  'INSERT INTO TXN (NAME, ADDRESS, CITY, STATE, EMAIL, COMPANY, ORGANIZATION, AMOUNT) VALUES(?,?,?,?,?,?,?,?)'
    console.log(txnObj)
    if (typeof txnObj != 'undefined') {
        db.serialize(function(){
            db.run(insertTxn, txnObj.name, txnObj.address, txnObj.city, txnObj.state, txnObj.email, txnObj.company, txnObj.organization, txnObj.totalAmt)
        })
        callback('SUCCESS')
    } 
}

function insertOrgDriveLeader(insertOrg, org, driveLeaderId, orgId, callback) {
    console.log(org)
    console.log(orgId)
    if (typeof orgId == 'undefined') {
        //insert org with the drive leader id
        db.serialize(function() {
            db.run(insertOrg, org.name, driveLeaderId, org.link, org.image)
        })
        callback('SUCCESS')
    } else {
        callback('DUPLICATE')
    }
}

exports.insertOrg = function(org, driveLeader, callback) {
    var insertOrg, insertDriveLeader, driveLeaderId, orgId
    insertOrg = "INSERT INTO Organization (name, owner, link_name, image_url) VALUES(?,?,?,?)"
    insertDriveLeader = "INSERT INTO DriveLeader (name, email, g_token) VALUES(?,?,?)"
    if (org != null && driveLeader != null) {
        db.serialize(function() {
            try {
                //does the driveleader already exist in our db?
                db.all("SELECT id FROM DriveLeader WHERE name=? AND email=?", driveLeader.name, driveLeader.email, function(err, rows){
                    if (typeof rows != 'undefined' && rows.length > 0) {
                        driveLeaderId = rows[0].id
                    }
                })
                db.all("SELECT id FROM Organization WHERE name=?", org.name, function(err, rows){
                    if (typeof rows != 'undefined' && rows.length > 0) {
                        orgId = rows[0].id
                    }
                    if (typeof driveLeaderId == 'undefined') {
                            db.run(insertDriveLeader, driveLeader.name, driveLeader.email, driveLeader.token, function(err) {
                                driveLeaderId = this.lastId
                                insertOrgDriveLeader(insertOrg, org, driveLeaderId, orgId, callback)
                            })
                    } else {
                        insertOrgDriveLeader(insertOrg, org, driveLeaderId, orgId, callback)
                    }
                })
                
            } catch (err) {
                callback('ERROR')
            }
        })
    }
}

exports.setupDrive = function(orgData, callback) {
    var insertDriveInfo = "INSERT INTO Drive (leaderName, email, orgName, extId, urlVal, insertTime) VALUES(?,?,?,?,?,?)",
    currTime = "" + new Date().getTime()

    if (orgData != null && typeof orgData != 'undefined') {
        db.serialize(function() {
            try {
                console.log(JSON.stringify(orgData) + " " + currTime)
                db.run(insertDriveInfo, 
                    orgData.leaderName, 
                    orgData.email, 
                    orgData.orgName, 
                    orgData.extId, 
                    orgData.urlVal, 
                    currTime)
                console.log("Success")
                callback("Success")
            } catch (err) {
                console.log("DB ERROR: " + err)
                callback("ERROR: " + err)
            }
        })
    }
}

exports.searchDrive = function(urlString, callback) {
    var selectDrive = 'SELECT orgName from Drive WHERE urlVal = ?'

    db.serialize(function() {
        try {
            db.all(
                selectDrive, urlString, function(err, rows) {
                callback(err, rows)
            })
        } catch (err) {
            callback(err)
        }
    }

    )
}