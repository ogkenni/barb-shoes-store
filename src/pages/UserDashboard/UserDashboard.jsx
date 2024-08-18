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
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  if (!userId || !token) {
    console.error('User ID or token is not defined');
    return;
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        'https://silver-gray-stem.glitch.me/api/products',
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure 'Bearer' is included
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
            Authorization: `Bearer ${token}`, // Ensure 'Bearer' is included
          },
        }
      );
      setCart(response.data);
      setCartItemsCount(response.data.length);
    } catch (error) {
      console.error('Error fetching cart:', error.response ? error.response.data : error.message);
    }
  };

  fetchProducts();
  fetchCart();
}, []);



const handleAddToCart = async (product) => {
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');

  if (!userId || !token) {
    console.error('User ID or token is not defined');
    return;
  }

  try {
    const response = await axios.post(
      `https://silver-gray-stem.glitch.me/api/cart/${userId}/add-item`,
      {
        productId: product.id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    
    // Check if the response indicates success
    if (response.data.success) {
      console.log('Item added to cart successfully');

      // Update local state
      setCart((prevCart) => {
        const existingProduct = prevCart.find(
          (item) => item.id === product.id
        );
        if (existingProduct) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
      setCartItemsCount((prevCount) => prevCount + 1);
    } else {
      console.error('Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding product to cart:', error.response ? error.response.data : error.message);
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
        <h2 className="d-flex justify-content-start fs-1 mb-5">Available Items</h2>
        <div>
           <ul className={styles.heading}>
            {products.map((item) => (
              <li key={item.id}>
                <img
                  className={styles.image}
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
