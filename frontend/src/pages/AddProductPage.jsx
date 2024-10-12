/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig.js';
import useAuthCheck from "../hooks/useAuthCheck.js";


const AddProductPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { isAuthenticated, loading: authLoading, role } = useAuthCheck();

    useEffect(() => {
        if (authLoading) return; // Wait until loading is done
        if (!isAuthenticated || role !== "admin") {
            navigate('/'); // Redirect to home or another appropriate page
        }
    }, [isAuthenticated, authLoading, navigate, role]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Show loading spinner if the loading state is true
    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('image', image);

            const response = await axios.post(`/admin/add-product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            if (response.data && response.data.product) {
                // Reset form fields
                setName('');
                setDescription('');
                setPrice('');
                setImage(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                alert('Product added successfully!');
                navigate('/shop');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Error adding product:', err);
            setError(err.response?.data?.message || 'Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    // Show loading spinner if the loading state is true
    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="name">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="image">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded w-full py-2 px-3"
                            ref={fileInputRef}
                            required
                        />
                    </div>
                    {imagePreview && (
                        <div className="mb-4">
                            <h2 className="text-center">Uploaded Image:</h2>
                            <img src={imagePreview} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
                        </div>
                    )}
                    <button type="submit" className="bg-blue-500 text-white rounded w-full py-2 hover:bg-blue-600">
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProductPage;
