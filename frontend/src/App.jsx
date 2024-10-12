import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AddProductPage from './pages/AddProductPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import UserPage from './pages/UserPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route index element={<HomePage />} />
          <Route path="/admin/add-product" element={<AddProductPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin/users" element={<UserPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;