
/**
 * Module dependencies.
 */

var express = require('express')
  , config = require('./config.json')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , sqllite = require('./routes/sqllite')
  , group = require('./routes/wishes')
  , wishes = require('./routes/wishes') 
  ,http = require('http')
  , path = require('path')
  , wishes = require('./routes/wishes')
  , org = require('./routes/org')
  , donation = require('./routes/donation')
  , registerUser = require('./routes/registerUser')
  , braintree = require('braintree')
  , gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: config.braintree.merchantId,
    publicKey: config.braintree.publicKey,
    privateKey: config.braintree.privateKey
  });

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

// app.get('/getWishes',group.getWishes);
app.get('/totalWishes', function(req, res) {
	
	 // req.session.valid = true;
	  res.render('totalWishes');
	});


//app.get('/totalWishes', function(req, res) {
////    var user_id = req.body.userSelection;
////    var name = req.body.username;
//    
//    res.redirect('/totalWishes');
//    	
//    
//});

app.get('/register', routes.registercompany);

app.get('/getWishes',wishes.getWishes);
//app.get('/addOrganization',org.addOrganization);
//app.get('/addDonation',donation.addDonation);

app.get('/UploadWishes', function(req, res) {
	res.render('../views/WishUploader.ejs');
});

app.get('/UploadDrives', function(req, res) {
	res.render('../views/RegisterUserUploader.ejs');
});

//app.post('/registerUser', registerUser.registerUser);

app.post('/InsertWishes',wishes.uploadData);

app.post('/InsertDrives', registerUser.registerOrg);

app.get('/home/*', function(req,res){
	
	res.render('home');
});

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

//TODO: move to separate file
app.post("/transaction", function(req, res) {
  //collect nonce
  var totalAmt, nonce = req.param("payment_method_nonce")
  console.log("NONCE: " + req.param("state"))
  if (typeof req.body != 'undefined') {
    totalAmt = req.body.totalDonations
    console.log("Total: " + totalAmt)
  }

  //send txn to braintree
  gateway.transaction.sale({
    amount: totalAmt,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    var txnObj = req.body
    if (typeof err != 'undefined' && err != null) {
      console.log(err)
      res.status(500)
      res.write("Something went wrong!")
      res.send()
    } else {
      console.log(result)
      txnObj.totalAmt = txnObj.totalDonations
      sqllite.insertTxn(txnObj, function(){
          //prep and send response
          res.status(200)
          res.write(JSON.stringify(req.body))
          res.send()
      });
     
    }
    

  });

  
});

app.get('/home', function(req,res){
	res.render('home');
});

app.get('/getWishes',wishes.getWishes);
app.get('/UploadWishes', function(req, res) {
	res.render('../views/WishUploader.ejs');
});

app.get('/checkout',function(req,res) {
	res.render('checkout');
});
app.post('/InsertWishes',wishes.uploadData);

app.post('/insertData', sqllite.insertData );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


