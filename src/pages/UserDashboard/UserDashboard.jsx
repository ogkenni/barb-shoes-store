import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import styles from './UserDashboard.module.css';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token'); // Assuming you store the token in sessionStorage

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'https://silver-gray-stem.glitch.me/api/products',
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `https://silver-gray-stem.glitch.me/api/cart/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setCart(response.data);
        setCartItemsCount(response.data.length);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchProducts();
    fetchCart();
  }, [userId, token]);

  const handleAddToCart = async (product) => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is not defined');
      return;
    }

    try {
      const response = await axios.post(
        `https://silver-gray-stem.glitch.me/api/cart/${userId}/add-item`,
        {
          productId: product.id,
          quantity: 1, // Default quantity or your quantity logic
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);

      // Update local state
      setCart((prevCart) => [...prevCart, product]);
      setCartItemsCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    window.location.href = `/checkout?userId=${userId}`;
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <h1 className="pb-5">Hello, welcome!</h1>
        <h2 className="d-flex justify-content-start fs-1">Available Items</h2>
        <div>
           <ul className={styles.heading}>
            {products.map((item) => (
              <li key={item.id}>
                <img
                  style={{
                    height: '200px',
                    width: '200px',
                    marginBottom: '10px',
                  }}
                  src={item.image_url}
                  alt={item.name}
                />
                <p>{item.name}</p>
                <p>N{item.price}</p>
                <button
                  style={{
                    backgroundColor: 'blueviolet',
                    border: 'none',
                    width: '100px',
                    height: '50px',
                    color: '#fff',
                    borderRadius: '15px',
                    marginBottom: "20px"
                  }}
                  className={styles.button}
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>

          <div
            className="mt-5"
            style={{ marginTop: '20px', textDecoration: 'none' }}
          >
            <Link
              style={{ textDecoration: 'none', color: 'blueviolet' }}
              to={`/checkout?userId=${userId}`}
              onClick={handleCheckout}
            >
              <i className="fa fa-shopping-cart"></i> ({cartItemsCount})
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboard;
