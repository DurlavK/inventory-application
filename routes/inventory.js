var express = require('express');
var router = express.Router();

// import controllers
var item_controller = require('../controllers/itemController');
var category_controller = require('../controllers/categoryController');

// Routes

// home page
router.get('/', item_controller.index);

// GET item create form
router.get('/item/create', item_controller.item_create_get);
// POST item create form
router.post('/item/create', item_controller.item_create_post);

// GET item delete form
router.get('/item/:id/delete', item_controller.item_delete_get);
// POST item delete form
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET item update form
router.get('/item/:id/update', item_controller.item_update_get);
// POST item update form
router.post('/item/:id/update', item_controller.item_update_post);

// GET item list
router.get('/items', item_controller.item_list);
// GET item single
router.get('/item/:id', item_controller.item_detail);


// GET category create form
router.get('/category/create', category_controller.category_create_get);
// POST category create form
router.post('/category/create', category_controller.category_create_post);

// GET category delete form
router.get('/category/:id/delete', category_controller.category_delete_get);
// POST category delete form
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET category update form
router.get('/category/:id/update', category_controller.category_update_get);
// POST category update form
router.post('/category/:id/update', category_controller.category_update_post);

// GET category list
router.get('/categories', category_controller.category_list);
// GET category single
router.get('/category/:id', category_controller.category_detail);

module.exports = router;