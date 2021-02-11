var Item = require('../models/item');
var Category = require('../models/category');

const { body, validationResult } = require('express-validator');
var async = require('async');

exports.category_create_get = function(req, res, next) {
  res.render('category_form', {title: 'Create Category'});
};


exports.category_create_post = [
  // Validate and sanitize fields.
  body('name', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a Book object with escaped and trimmed data.
      var category = new Category(
        { 
          name: req.body.name,
          description: req.body.description
        }
      );

      if (!errors.isEmpty()) {
          res.render('category_form', {title: 'Create Category', category: category, errors: errors.array()});
          return;
      }
      else {
          // Data from form is valid.
          Category.findOne({'name': req.body.name})
          .exec( function(err, found_category){
            if(err) {return next(err);}
            if(found_category){
              res.redirect(found_category.url);
            }
            else{
              category.save(function(err){
                if(err) {return next(err);}
                res.redirect(category.url);
              });
            }
          });
      }
  }
];


exports.category_delete_get = function(req, res, next) {

  async.parallel({
      category: function(callback) {
          Category.findById(req.params.id).exec(callback);
      },
      category_items: function(callback) {
          Item.find({ 'category': req.params.id }).exec(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.category==null) { // No results.
          res.redirect('/inventory/categories');
      }
      // Successful, so render.
      res.render('category_delete', { title: 'Delete Category', category: results.category, category_items: results.category_items } );
  });

};

exports.category_delete_post = function(req, res, next) {

  async.parallel({
      category: function(callback) {
          Category.findById(req.body.categoryid).exec(callback);
      },
      category_items: function(callback) {
          Item.find({ 'category': req.body.categoryid }).exec(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      // Success
      if (results.category_items.length > 0) {
          // Book has book_instances. Render in same way as for GET route.
          res.render('category_delete', { title: 'Delete Category', category: results.category, category_items: results.category_items } );
          return;
      }
      else {
          // Book has no BookInstance objects. Delete object and redirect to the list of books.
          Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
              if (err) { return next(err); }
              // Success - got to books list.
              res.redirect('/inventory/categories');
          });

      }
  });

};

exports.category_update_get = function(req, res, next) {

  Category.findById(req.params.id, function(err,category){
    if(err) {return next(err);}
    if(category == null){
      var err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    //success
    res.render('category_form', {title: 'Update Category', category: category});
  })

};

exports.category_update_post = [

  body('name', 'Category name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
  

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request .
      const errors = validationResult(req);

  // Create a genre object with escaped and trimmed data (and the old id!)
      var category = new Category(
        {
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id
        }
      );


      if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values and error messages.
          res.render('category_form', { title: 'Update Category', category: category, errors: errors.array()});
      return;
      }
      else {
          // Data from form is valid. Update the record.
          Category.findByIdAndUpdate(req.params.id, category, {}, function (err,thecategory) {
              if (err) { return next(err); }
                 // Successful - redirect to genre detail page.
                 res.redirect(thecategory.url);
              });
      }
  }
];

exports.category_list = function(req, res, next) {

  Category.find()
  .sort([['name', 'ascending']])
    .exec(function (err, list_categories) {
      if (err) {return next(err)} 
      else {
        // Successful, so render
        res.render('category_list', { title: 'Category List', category_list:  list_categories});
        }
    });

};

exports.category_detail = function(req, res, next) {

  async.parallel({
      category: function(callback) {
        Category.findById(req.params.id)
          .exec(callback);
      },
      category_items: function(callback) {
        Item.find({'category': req.params.id})
        .exec(callback)
      }
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.category==null) { // No results.
          var err = new Error('Category not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('category_detail', { title: 'Individual Category', category: results.category, category_items: results.category_items } );
  });

};
