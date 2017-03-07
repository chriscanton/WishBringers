var sqlite = require('./sqllite');

exports.registerUser = function(req, res) {
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
}