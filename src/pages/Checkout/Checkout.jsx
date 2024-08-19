import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import './Checkout.module.css';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
    const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
 const userId = queryParams.get('userId');
  const token = localStorage.getItem('token'); 


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
