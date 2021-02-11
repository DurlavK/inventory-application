var Item = require('../models/item');
var Category = require('../models/category');

const { body, validationResult } = require('express-validator');
var async = require('async');

exports.index = (req,res) => {
  async.parallel({
    item_count: function(callback){
      Item.countDocuments({},callback);
    },
    category_count: function(callback){
      Category.countDocuments({},callback);
    }
  }, function(err,results){
    res.render('index', {title: 'Sports Shop Inventory', error: err, data: results})
  })
}

exports.item_create_get = (req,res,next) => {
  async.parallel({
    categories: function(cb) {
      Category.find(cb);
    }
  }, function(err,results){
    if(err) {return next(err);}
    res.render('item_form', { title: 'Create New Item', categories: results.categories });
  });
}

exports.item_create_post = [
  body('name','Name is required.').trim().isLength({ min: 1 }).escape(),
  body('description','Name is required.').trim().isLength({ min: 1 }).escape(),
  body('category','Name is required.').trim().isLength({ min: 1 }).escape(),
  body('price','Name is required.').trim().isLength({ min: 1 }).escape(),
  body('stock','Name is required.').trim().isLength({ min: 1 }).escape(),

  (req,res,next)=>{
    const errors = validationResult(req);
    var item = new Item(
      {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
      }
    );
    if(!errors.isEmpty()){
      async.parallel({
        categories: function(cb) {
          Category.find(cb);
        }
      }, function(err,results){
        if(err) {return next(err);}
        res.render('item_form', { title: 'Create New Item', categories: results.categories });
      });
      return;
    }
    else {
      item.save(function(err){
        if(err) {return next(err);}
        res.redirect(item.url);
      })
    }
  }
];

exports.item_delete_get = (req,res,next) => {
  Item.findById(req.params.id)
  .populate('category')
  .exec(function(err, result){
    if(err) {return next(err);}
    if(result==null) {
      res.redirect('/inventory/items');
    }
    res.render('item_delete', {title: 'Delete Item', item:result});
  })
}

exports.item_delete_post = (req,res,next) => {
  Item.findByIdAndRemove(req.params.id, function(err){
    if (err) {return next(err);}
    res.redirect('/inventory/items');
  });
}

exports.item_update_get = (req,res,next) => {
  async.parallel({
    item: function(callback) {
      Item.findById(req.params.id).exec(callback);
    },
    categories: function(cb) {
      Category.find(cb);
    }
  }, function(err,results){
    if(err) {return next(err);}
    if(results.item==null) {
      var err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }
    res.render('item_form', { title: 'Update Item', categories: results.categories, item: results.item });
  });
}

exports.item_update_post = [
  body('name','Name is required.').trim().isLength({ min: 1 }).escape(),
  body('description','Name is required.').trim().isLength({ min: 1 }).escape(),
  body('category','Name is required.').trim().isLength({ min: 1 }).escape(),
  body('price','Name is required.').trim().isLength({ min: 1 }).escape(),
  body('stock','Name is required.').trim().isLength({ min: 1 }).escape(),

  (req,res,next)=>{
    const errors = validationResult(req);
    var item = new Item(
      {
        _id:req.params.id,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
      }
    );
    if(!errors.isEmpty()){
      async.parallel({
        categories: function(cb) {
          Category.find(cb);
        }
      }, function(err,results){
        if(err) {return next(err);}
        res.render('item_form', { title: 'Create New Item', categories: results.categories, item:item });
      });
      return;
    }
    else {
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err,theitem) {
        if (err) { return next(err); }
           // Successful - redirect to book detail page.
           res.redirect(theitem.url);
        });
    }
  }
];

exports.item_list = (req,res) => {
  Item.find({}, 'name category')
    .populate('category')
    .exec(function (err, list_items) {
      if (err) {return next(err);} 
      else {
          // Successful, so render
          res.render('item_list', { title: 'Item List', item_list:  list_items});
        }
    });
}

exports.item_detail = (req,res) => {
  Item.findById(req.params.id)
  .populate('category')
  .exec(function(err, result) {
    if(err) {return next(err);}
    else {
      res.render('item_detail', {title: 'Individual Item', item: result});
    }
  })
}