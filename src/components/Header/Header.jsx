import styles from './Header.module.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className={styles.navLeft}>
        <img src={logo} alt="store official logo" className={styles.logo} />
        <h1>Barb Stores</h1>
      </div>
      <Navbar collapseOnSelect expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className={styles.navRight}
          >
            <Nav className="mx-5 px-5 d-flex justify-center align-center">
              <Nav.Link
                as={Link}
                to="/"
                className="nav-item mx-lg-3 text-light"
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className="nav-item mx-lg-3 text-light"
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className="nav-item mx-lg-3 text-light"
              >
                Contact
              </Nav.Link>
            </Nav>
            <div className={styles.button}>
              <Link to="/login">
                <button to="/login" id="btn" className={styles.navButton}>
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button to="/register" className={styles.navButton}>
                  Register
                </button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
