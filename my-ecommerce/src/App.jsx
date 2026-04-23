import {React,useEffect} from 'react'
import {  Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home' 
import ProductsPage from './pages/ProductsPage'
import ProductDetail from "./pages/ProductDetail";
import Orders from './pages/Orders'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './components/ForgotPassword'
import ProtectedRoute from './routes/ProtectedRoute'
import VerifyOtp from './components/VerifyOtp'
import ResetPassword from './components/ResetPassword'
import Footer from './components/Footer'
import CategoryProducts from './pages/CategoryProducts'
import { useDispatch } from "react-redux"
import { fetchCarts } from "./slices/cartSlice"
function App() {
   const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCarts())
  }, [dispatch])
  return (
   <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="product/:id" element={<ProductDetail />} />
      <Route path="/products/category/:name" element={<CategoryProducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/verify-otp" element={<VerifyOtp />} />
       <Route path="/reset-password" element={<ResetPassword />} />
             <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
       <Footer/>
      </>
  
  )
}

 export default App;