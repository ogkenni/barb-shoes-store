import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import axios from 'axios';
import { useState } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    window.location.href = 'https://silver-gray-stem.glitch.me/auth/google';
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('https://silver-gray-stem.glitch.me/register', {
      email,
      password,
    });
console.log(response.data);
    const { token, userId } = response.data;

    // Store token and user ID
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);

    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Error registering user:', error.response.data);
  }
};


  return (
    <>
      <Header />
      <div className="container my-5 py-5">
        <h1>Register</h1>

        <div className="row">
          <div className="col-sm-8">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      style={{ width: '350px' }}
                      type="email"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      style={{ width: '350px' }}
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className={styles.navButton}>
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card social-block">
              <div className="card-body">
                <a
                  style={{ width: '350px' }}
                  className="btn btn-block"
                  onClick={handleGoogleSignIn}
                  role="button"
                >
                  <i className="fab fa-google mx-3"></i>
                  Sign Up with Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
