import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import styles from './Checkout.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const token = localStorage.getItem('token'); // Assuming you store the token in sessionStorage

useEffect(() => {
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Token or User ID is missing");
      }

      const response = await axios.get(
        `https://silver-gray-stem.glitch.me/api/cart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Added Bearer prefix
          },
        }
      );

      if (response.data) {
        setCartItems(response.data);
      } else {
        setCartItems([]); // If response is empty, set cart items to an empty array
      }
    } catch (error) {
      console.error('There was an error fetching the cart items!', error);
      setError('Failed to load cart items. Please try again later.');
    }
  };

  fetchCartItems();
}, []); // Removed userId and token from dependency array since they are fetched within the effect


const handleDelete = async (itemId) => {
  try {
    const token = localStorage.getItem("token");
    console.log('Deleting item with ID:', itemId);
    const response = await axios.delete(
      `https://silver-gray-stem.glitch.me/api/cart/remove-item/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Delete response:', response.data);

    // Update the cart items state
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== itemId);
      
      // If cart is empty, redirect to dashboard
      if (updatedItems.length === 0) {
        navigate('/dashboard');
      }

      return updatedItems;
    });

  } catch (error) {
    console.error('Error removing item from cart:', error);
    setError('Failed to remove item. Please try again later.');
  }
};



  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + parseFloat(item.price), 0)
      .toFixed(2);
  };

  const handlePurchase = async () => {
  try {
    const totalAmount = calculateTotal();
    const token = localStorage.getItem('token');

    console.log('Token:', token); // Debugging log

    await axios.post(
      `https://silver-gray-stem.glitch.me/api/checkout/${userId}`,
      { totalAmount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCartItems([]);
    alert('Products purchased successfully!');
    navigate('/dashboard');
  } catch (error) {
    console.error('Error during purchase:', error);
    setError('Failed to complete purchase. Please try again later.');
  }
};


  if (error) {
    return (
      <>
        <Header />
        <div className="container my-5 mx-5">
          <h1 className="container my-5 py-5">{error}</h1>
          <button onClick={() => navigate('/dashboard')}>
            Go Back to Shop
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="container my-5 mx-5">
          <h1 className="container my-5 py-5">Your cart is empty!</h1>
          <button onClick={() => navigate('/dashboard')}>
            Go Back to Shop
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container my-5">
        <h1 className="d-flex justify-content-start fs-1 my-5">Checkout</h1>
        <ul className={styles.ul}>
          {cartItems.map((item) => (
            <li key={item.id}>
              <img className={styles.img} src={item.image_url} alt={item.name} />
              <p className={styles.p}>{item.name}</p>
              <p className={styles.p}>N{item.price}</p>
              <button className={styles.button} onClick={() => handleDelete(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <h2 className="d-flex justify-content-start fs-1 my-5 pt-5">
          Total: N{calculateTotal()}
        </h2>
        <button className={styles.button} onClick={handlePurchase}>
          Purchase
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
