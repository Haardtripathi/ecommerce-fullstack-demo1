const mongoose = require("mongoose");
const Product = require('../models/product');
const User = require('../models/user');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');


exports.getAddProduct = async (req, res, next) => {
    return res.json({ message: "Add Product Page" });
}


exports.postAddProduct = async (req, res) => {
    let uploadedImage = null;

    try {
        const { name, description, price } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Upload the image to Cloudinary
        uploadedImage = await cloudinary.uploader.upload(req.file.path, {
            folder: 'products',
            use_filename: true,
        });

        // Create and save the product
        const product = new Product({
            name,
            description,
            price,
            imageUrl: uploadedImage.secure_url,
        });

        await product.save();

        // Clean up the local file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(201).json({
            message: 'Product added successfully',
            product: {
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl
            }
        });

    } catch (err) {
        // Clean up Cloudinary image if product save fails
        if (uploadedImage && uploadedImage.public_id) {
            try {
                await cloudinary.uploader.destroy(uploadedImage.public_id);
            } catch (cloudinaryError) {
                console.error('Error deleting Cloudinary image:', cloudinaryError);
            }
        }

        // Clean up local file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('Error adding product:', err);
        return res.status(500).json({
            message: 'Failed to add product',
            error: err.message
        });
    }
};



exports.postDeleteProduct = async (req, res, next) => {
    const productId = req.params.id;
    // console.log(productId);

    try {
        // Find the product by ID
        const product = await Product.findById(productId);
        // console.log(product);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the image from Cloudinary
        const publicId = product.imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(publicId);

        // Delete the product from the database
        await Product.findByIdAndDelete(productId);

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
}