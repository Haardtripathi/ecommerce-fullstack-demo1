// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../middleware/multer'); // Import multer middleware
const { isAuthenticated, isAdmin } = require('../middleware/isAuthenticated');


router.post('/add-product', isAuthenticated, isAdmin, upload.single('image'), adminController.postAddProduct);

router.post('/delete-product/:id', isAuthenticated, isAdmin, adminController.postDeleteProduct)

router.get('/users', isAuthenticated, isAdmin, adminController.getAllUsers)

module.exports = router;
