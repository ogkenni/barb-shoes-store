import styles from './AdminDashboard.module.css';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image_url: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'https://silver-gray-stem.glitch.me/api/admin/products'
        );
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://silver-gray-stem.glitch.me/api/admin/add-product',
        newProduct
      );
      setProducts([...products, response.data]); // Update the product list
      setNewProduct({ name: '', price: '', image_url: '' }); // Reset form
    } catch (error) {
      console.error(
        'Error adding product:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(
        `https://silver-gray-stem.glitch.me/api/admin/delete-product/${productId}`
      );
      setProducts(products.filter((product) => product.id !== productId)); // Remove the deleted product from the state
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-3 my-5 py-5">
        <h1 className="mb-5">Admin Dashboard</h1>

        <form className={styles.form} onSubmit={handleAddProduct}>
          <h2 className="mt-3">Add New Product</h2>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            placeholder="Product Price"
            required
          />
          <input
            type="text"
            name="image_url"
            value={newProduct.image_url}
            onChange={handleChange}
            placeholder="Product Image URL"
            required
          />
          <button className={styles.button} type="submit">Add Product</button>
        </form>

        <h2 className="my-5 py-5">Uploaded Products</h2>
        <ul className={styles.ul}>
          {products.map((product) => (
            <li key={product.id}>
              <img className={styles.img} src={product.image_url} />
              <h3>{product.name}</h3>
              <p>Price: N{product.price}</p>

              <i
                onClick={() => handleDeleteProduct(product.id)}
                className="fa fa-trash-o"
                style={{ color: 'blueviolet', width: '50px' }}
              ></i>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
