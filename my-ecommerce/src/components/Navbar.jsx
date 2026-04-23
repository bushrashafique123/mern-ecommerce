import React from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems)
  const totalQuantity = cartItems?.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <nav className="border-b yellow-400/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent font-cinzel">
       Groomie Hub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/"  className="text-sm font-medium hover:text-yellow-500 transition">
            Home
          </Link>
          <Link to="/products"className="text-sm font-medium hover:text-yellow-500 transition">
            Products
          </Link>
          <Link to="/orders" className="text-sm font-medium hover:text-yellow-500 transition">
            Orders
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalQuantity > 0 && (
              <Badge className="absolute -top-2 -right-2 text-xs bg-yellow-500 text-black">
                {totalQuantity}
              </Badge>
            )}
          </Link>
   <Link to="/signup">
          <Button size="sm"
          className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:opacity-90">
             signup
            </Button>
          </Link>
          <Link to="/login">
          <Button size="sm"
          className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:opacity-90">
              Login
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-6">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/orders">Orders</Link>
                <Link to="/cart">Cart ({totalQuantity})</Link>
                <Link to="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  )
}

export default Navbar