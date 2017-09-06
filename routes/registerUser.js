var sqlite = require('./sqllite'),
papa = require('babyparse'),
fs = require('fs'),
parseOrg

/*exports.registerUser = function(req, res) {
    var org = req.body.org,
    user = req.body.user
    sqlite.insertOrg(org, user, function(status) {
        var returnMessage = {'msg': status}
        console.log(status)
        if (status == 'ERROR') {
            return res.status(500).json(returnMessage)
        } else if (status == 'DUPLICATE') {
            return res.status(200).json(returnMessage)
        } else if (status == 'SUCCESS') {
            return res.status(200).json(returnMessage)
        } else {
            return res.status(500).json(returnMessage)
        }
    })
}*/

exports.registerOrg = function(req, res) {
    var binFileData = req.files.file,
    driveInfo = {},
    content

    if (binFileData != null && typeof binFileData != 'undefined') {
        content = fs.readFileSync(binFileData.path, { encoding: 'binary' })        
        papa.parse(content, {
            step: function(row){
                driveInfo.leaderName = row.data[0][0]
                driveInfo.email = row.data[0][1]
                driveInfo.orgName = row.data[0][2]
                driveInfo.extId = row.data[0][3]
                parseOrg(driveInfo)
	        }
        })
    }
    res.send("Success")
}


parseOrg = function(orgData) {
    var randomString = Math.random().toString(36).substring(13);
    if (orgData !== null || typeof orgData !== 'undefined') {
        if (typeof orgData.leaderName !== 'undefined' 
            && typeof orgData.email != 'undefined' 
            && typeof orgData.orgName !== 'undefined'
            && typeof orgData.extId !== 'undefined') {
                orgData.urlVal = randomString;
                sqlite.setupDrive(orgData, function(status) {
                    return status;
                })
        }
    }
}