#! /usr/bin/env node

console.log('This script populates some test items and category to database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function itemCreate(name, description, category, price, stock, cb) {
  itemdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    stock: stock
  }
  
  var item = new Item(itemdetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function categoryCreate(name, description, cb) {
  var category = new Category({ name: name, description: description });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}



function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Indoor', 'Indoor sports euipment. eg- chess board, badminton racket.',  callback);
        },
        function(callback) {
          categoryCreate('Outdoor', 'Outdoor sports equipment. eg- football, cricket bat.', callback);
        },
        function(callback) {
          categoryCreate('Exercise', 'Exercise quipment. eg- dumbles.', callback);
        },
        function(callback) {
          categoryCreate('Adventure', 'Adventure sports equipment. eg- parachute.', callback);
        },
        function(callback) {
          categoryCreate('Casual', 'Casual sports equipment. eg- skateboard.', callback);
        }
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Chess Board', 'chess board with pieces', categories[0], 400, 25, callback);
        },
        function(callback) {
          itemCreate('Cricket Bat', 'cricket bat', categories[1], 1500, 20, callback);
        },
        function(callback) {
          itemCreate('SkateBoard', 'skateboard', categories[4], 1200, 10, callback);
        },
        function(callback) {
          itemCreate('Dumbles', '5kg dumble set', categories[2], 1000, 10, callback);
        },
        function(callback) {
          itemCreate('Parachute', 'parachute', categories[3], 5000, 5, callback);
        },
        function(callback) {
          itemCreate('Cricket Ball', 'cricket ball', categories[1], 200, 50, callback);
        },
        function(callback) {
          itemCreate('Carrom Board', 'carrom board without pieces', categories[0], 1500, 5, callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Succesfull');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
