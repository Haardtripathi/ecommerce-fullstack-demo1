// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isNotAdmin } = require('../middleware/isAuthenticated');


// Route to get all products for the shop page
router.get('/products', isAuthenticated, userController.getAllProducts);

router.post('/add-to-cart', isAuthenticated, isNotAdmin, userController.addToCart);

router.get('/cart', isAuthenticated, isNotAdmin, userController.getCart);

router.post('/update-cart-quantity', isAuthenticated, userController.updateCartQuantity)

// Remove from cart
router.post('/remove-from-cart', isAuthenticated, userController.removeFromCart);

router.post('/create-razorpay-order', userController.createRazorpayOrder);
router.post('/verify-payment', userController.verifyPayment);


module.exports = router;
