/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig.js';
import useAuthCheck from "../hooks/useAuthCheck.js";
import { loadRazorpayScript } from '../utils/razorpayHelper';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const { isAuthenticated, loading: authLoading, role } = useAuthCheck();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
        if (role === 'admin') {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate, role]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`/cart`);
                setCartItems(response.data.items);
                calculateTotal(response.data.items);
            } catch (err) {
                setError('Failed to fetch cart items');
                console.error('Error fetching cart:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);
        setTotal(sum);
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            if (newQuantity < 1) return;

            await axios.post(`/update-cart-quantity`, {
                productId,
                quantity: newQuantity
            }, { withCredentials: true });

            const updatedItems = cartItems.map(item =>
                item.product._id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            setCartItems(updatedItems);
            calculateTotal(updatedItems);
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await axios.post(`/remove-from-cart`, { productId }, { withCredentials: true });
            const updatedItems = cartItems.filter(item => item.product._id !== productId);
            setCartItems(updatedItems);
            calculateTotal(updatedItems);
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const handleRazorpayPayment = async () => {
        const res = await loadRazorpayScript(); // Load the Razorpay script
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            const { data: orderData } = await axios.post(`/create-razorpay-order`, { total }, { withCredentials: true });
            const options = {
                key: import.meta.env.REACT_APP_RAZORPAY_KEY,
                amount: orderData.amount,
                currency: 'INR',
                name: 'Apna Bazaar',
                description: 'Test Transaction',
                order_id: orderData.id,
                handler: async (response) => {
                    try {
                        const paymentData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };
                        // Verify payment and create order
                        const verifyRes = await axios.post(`/verify-payment`, paymentData, { withCredentials: true });
                        alert('Payment successful and order placed!');
                        navigate('/orders'); // Redirect to orders page
                    } catch (error) {
                        console.error('Payment verification failed', error);
                    }
                },
                theme: {
                    color: '#F37254'
                }
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Error initiating Razorpay payment:', error);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-xl text-gray-600">Your cart is empty</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                        {cartItems.map((item) => (
                            <div key={item.product._id} className="flex items-center justify-between border-b py-4">
                                <div className="flex items-center">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover mr-4"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold">{item.product.name}</h2>
                                        <p className="text-gray-600">Rs.{item.product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                        className="bg-gray-200 px-3 py-1 rounded-l"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                        className="bg-gray-200 px-3 py-1 rounded-r"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => handleRemoveItem(item.product._id)}
                                        className="ml-4 text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-lg font-semibold">Rs.{total.toFixed(2)}</span>
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            onClick={handleRazorpayPayment}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
