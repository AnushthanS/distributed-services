import { useEffect, useState } from "react";
import { getProducts, checkInventory, createOrder, deleteProduct } from "../lib/api";
import AddProduct from "./AddProduct";

const Catalog = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            console.log("At Catalog: ", data);
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products at Catalog page: ", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleBuy = async (product) => {
        try {
            const inventoryCheck = await checkInventory(product.id, 1);
            if (inventoryCheck.canOrder) {
                const order = await createOrder({
                    userId: 1,
                    orderItems: [{ productId: product.id, quantity: 1, price: product.price }]
                });

                console.log("Order created: ", order);
                alert("Order placed successfully");
                fetchProducts(); // Refresh the product list
            } else {
                alert("Product is out of stock");
            }
        } catch (error) {
            console.error("Error placing order: ", error);
            alert("Failed to place order");
        }
    };

    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            alert("Product deleted successfully");
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <AddProduct onProductAdded={fetchProducts} />
            
            <h2 className="text-2xl font-bold my-4">Product Catalog</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-md p-4 shadow-sm">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">${product.price}</p>
                        <p className="text-gray-600">Stock: {product.stockQuantity}</p>
                        <button
                            onClick={() => handleBuy(product)}
                            className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Buy
                        </button>
                        <button
                            onClick={() => handleDelete(product.id)}
                            className="mt-2 ml-2 bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalog;