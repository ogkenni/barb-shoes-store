import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import './Checkout.module.css';
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
     const userId = queryParams.get('userId');
  const token = localStorage.getItem('token');
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `https://silver-gray-stem.glitch.me/api/cart/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setCartItems(response.data);
      } catch (error) {
        console.error('There was an error fetching the cart items!', error);
        setError('Failed to load cart items. Please try again later.');
      }
    };

    fetchCartItems();
  }, [userId, token]);



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
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <img src={item.image_url} alt={item.name} />
              <p>{item.name}</p>
              <p>N{item.price}</p>
              <button >Remove</button>
            </li>
          ))}
        </ul>
        <h2 className="d-flex justify-content-start fs-1 my-5 pt-5">
          Total
        </h2>
        <button className="my-3">
          Purchase
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
