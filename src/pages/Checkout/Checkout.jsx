import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import './Checkout.module.css';

const Checkout = () => {
return (
    <>
      <Header />
      <div className="container my-5">
        <h1 className="d-flex justify-content-start fs-1 my-5">Checkout</h1>
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
