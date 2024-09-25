import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Catalog, Login, OrderList } from "./components";

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">E-commerce App</h1>
            <div>
              <Link to="/" className="text-white hover:text-blue-200 px-3 py-2">Products</Link>
              <Link to="/orders" className="text-white hover:text-blue-200 px-3 py-2">Orders</Link>
              <Link to="/login" className="text-white hover:text-blue-200 px-3 py-2">Login</Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;