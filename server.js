// jshint ignore: start
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Bear     = require('./models/bear');

mongoose.Promise = Promise;

// mongodb connection
mongoose.connect("mongodb://localhost:27017/Bear", {
  useMongoClient: true,
  promiseLibrary: global.Promise
});

var db = mongoose.connection;
// mongodb error
db.on('error', console.error.bind(console, 'connection error:'));
// mongodb connection open
db.once('open', () => {
  console.log(`Connected to Mongo at: ${new Date()}`)
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;


var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log("connected")
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
    
        var bear = new Bear({
        	name : req.body.name,        
            value : req.body.value
        	}); 

        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    .put(function(req, res) {

        // use our bear model to find the bear we want
        Bear.findByIdAndUpdate(req.params.bear_id,req.body, function(err, bear) {

            if (err)
                res.send(err);
                 res.json({ message: 'Bear updated!' });
        });
    })

    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


app.use('/api', router);

// START THE SERVER

app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;
