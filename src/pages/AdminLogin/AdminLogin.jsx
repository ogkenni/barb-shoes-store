import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://silver-gray-stem.glitch.me/api/admin/auth',
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <>
      <Header />
      <div className="container my-5 py-5 mx-2">
        <h2>Admin Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
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
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="my-3" type="submit">
            Login
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
