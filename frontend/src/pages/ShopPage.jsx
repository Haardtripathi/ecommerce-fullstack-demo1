/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig.js';
import useAuthCheck from "../hooks/useAuthCheck.js";


const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const { isAuthenticated, loading, role } = useAuthCheck();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if loading is done and user is not authenticated
        if (!loading && !isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    useEffect(() => {
        // Only fetch products if authenticated
        if (!loading && isAuthenticated) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(`/products`);
                    setProducts(response.data);
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
            };

            fetchProducts();
        }
    }, [isAuthenticated, loading]); // Depend on authentication and loading state

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleAddToCart = async (productId, quantity) => {
        try {
            // console.log(productId, quantity)
            const response = await axios.post(`/add-to-cart`, { productId, quantity }, { withCredentials: true });
            // console.log(response.data.message);
            alert("Added to cart")
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };


    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                // console.log(productId);
                await axios.post(`/admin/delete-product/${productId}`);
                setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId), { withCredentials: true });
                alert('Product deleted successfully.');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product.');
            }
        }
    };


    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Shop</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <div className="relative pt-[100%] border-2 border-gray-200 rounded-lg"> {/* Added border */}
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="absolute top-0 left-0 w-full h-full object-contain p-2"
                            />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h2 className="text-xl font-semibold mb-2 truncate">{product.name}</h2>
                            <p className="text-gray-600 mb-2 flex-grow line-clamp-2">{product.description}</p>
                            <p className="text-lg font-bold mb-2">Rs.{product.price.toFixed(2)}</p>
                            {role !== 'admin' && (
                                <div className="flex items-center mb-2">
                                    <input
                                        type="number"
                                        min="1"
                                        defaultValue="1"
                                        className="border rounded w-16 text-center mr-2 p-1"
                                        id={`quantity-${product._id}`}
                                    />
                                    <button
                                        onClick={() => handleAddToCart(product._id, parseInt(document.getElementById(`quantity-${product._id}`).value))}
                                        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 flex-grow"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            )}

                            {role === 'admin' && (
                                <>
                                    <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                                    >
                                        Delete Product
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;
