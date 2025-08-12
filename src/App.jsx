import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import AppLayout from './layouts/AppLayout';
import AuthGuard from './components/guards/AuthGuard';
import RoleGuard from './components/guards/RoleGuard';
import CheckoutDelivery from './pages/CheckoutDelivery';
import CheckoutPayment from './pages/CheckoutPayment';
import ThankYou from './pages/ThankYou';
import AdminConsole from './pages/AdminConsole';
import Seller from './pages/Seller';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Profile from './pages/Profile';
import HandoverVerify from './pages/HandoverVerify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/seller" element={<RoleGuard roles={["Seller","Admin"]}><Seller /></RoleGuard>} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/list" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<AuthGuard><Cart /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/handover/verify" element={<HandoverVerify />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout/delivery" element={<AuthGuard><CheckoutDelivery /></AuthGuard>} />
          <Route path="/checkout/payment" element={<AuthGuard><CheckoutPayment /></AuthGuard>} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin" element={<RoleGuard roles={["Admin"]}><AdminConsole /></RoleGuard>} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
