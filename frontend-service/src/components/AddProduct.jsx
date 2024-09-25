import { useState } from 'react';
import { createProduct } from '../lib/api';

const AddProduct = ({ onProductAdded }) => {
  const [product, setProduct] = useState({ name: '', description: '', price: '', stockQuantity: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(product);
      setProduct({ name: '', description: '', price: '', stockQuantity: '' });
      onProductAdded();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="description"
        value={product.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        name="stockQuantity"
        value={product.stockQuantity}
        onChange={handleChange}
        placeholder="Stock Quantity"
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;