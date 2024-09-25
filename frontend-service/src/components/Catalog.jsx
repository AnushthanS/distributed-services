import { useEffect, useState } from "react";
import { getProducts, checkInventory, createOrder } from "../lib/api";

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
            } else {
                alert("Product is out of stock");
            }
        } catch (error) {
            console.error("Error placing order: ", error);
            alert("Failed to place order");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
                <div key={product.id} className="border rounded-md p-4 shadow-sm">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600">${product.price}</p>
                    <button
                        onClick={() => handleBuy(product)}
                        className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Buy
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Catalog;