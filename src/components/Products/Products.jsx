import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductsCard from '../Products-Card/ProductsCard';
import styles from './Products.module.css';
import { useNavigate } from 'react-router-dom';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'https://silver-gray-stem.glitch.me/api/homepage-products'
        );
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching homepage products:', error.message);
        setError('Failed to load products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);
  const handleNavigate = () => {
    navigate('/register');
  };
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="container mb-5 pb-5">
      <h1 className={styles.heading}>Featured products</h1>
      <div className={styles.card}>
        {products.map((item) => (
          <ProductsCard
            key={item.id}
            img={item.image_url}
            product={item.name}
            price={item.price}
          />
        ))}
      </div>
      <div>
        <p onClick={handleNavigate} className="btn btn-secondary btn-lg">
          Order Now!
        </p>
      </div>
    </section>
  );
};

export default Products;
