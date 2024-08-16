/* eslint-disable no-undef */
import express from 'express';
import bodyParser from 'body-parser';
import env from 'dotenv';
import pg from 'pg';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
env.config();
const app = express();
const port = 3000;
const saltRounds = 10;
console.log('SESSION_SECRET:', process.env.SESSION_SECRET); // Add this line

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  console.error('Secret Key is undefined');
  process.exit(1); // Exit if the secret key is not defined
}

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send('Token is required.');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token.');
    req.userId = decoded.userId; // Attach userId to the request object
    next();
  });
}

app.use(cors());

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// Admin Login page.
app.post('/api/admin/auth', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.status(200).json({ message: 'Authentication successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// User's register route
app.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send('Email already exists. Try logging in.');
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2)  RETURNING *',
            [email, hash]
          );
          const user = result.rows[0];
          console.log(user);
          req.login(user, (err) => {
            if (err) {
              console.log(err);
              res.redirect('/dashboard');
            }
          });
          res.status(201).json(result.rows[0]);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// Registered users' login route.
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      bcrypt.compare(password, storedPassword, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).send('Internal Server Error');
        }

        if (!isMatch) {
          return res.status(401).send('Incorrect password');
        } else {
          // Store user ID in session
          const token = jwt.sign({ userId: user.id }, secretKey, {
            expiresIn: '1h',
          });
          res.status(200).json({ user, token, userId: user.id });
        }
      });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Sign Up with Google API route and redirect.
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
app.get(
  '/auth/google/dashboard',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard.
    res.redirect('http://localhost:5173/dashboard');
  }
);

// Admin route to add product to the database
app.post('/api/admin/add-product', async (req, res) => {
  const { name, price, image_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, price, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, price, image_url]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Displays the added products on the admin's page
app.get('/api/admin/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Route to hide or unhide a product

app.delete('/api/admin/delete-product/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Displays all products from the database on the frontend
app.get('/api/products', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

// User's dashboard
app.get('/api/dashboard', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const products = await db.query('SELECT * FROM products');
    res.status(200).json({ products: products.rows, userId });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/cart/add', verifyToken, async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Check if the user has an existing cart
    let cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    let cartId;

    if (cartResult.rows.length === 0) {
      // If no existing cart, create a new cart
      const newCart = await db.query(
        'INSERT INTO carts (user_id, created_at) VALUES ($1, NOW()) RETURNING id',
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Insert the product into the cart_items table
    await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity',
      [cartId, productId, quantity]
    );

    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get cart items for a user
app.get('/api/cart/:userId', verifyToken, async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: No user ID provided' });
  }

  try {
    const cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartId = cartResult.rows[0].id;

    const cartItems = await db.query(
      'SELECT p.id, p.name, p.price, p.image_url, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1',
      [cartId]
    );

    res.status(200).json(cartItems.rows);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/cart/:userId/add-item', verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    let cart = await db.query('SELECT id FROM carts WHERE user_id = $1', [
      userId,
    ]);

    if (cart.rows.length === 0) {
      cart = await db.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
    } else {
      cart = cart.rows[0];
    }

    const cartId = cart.id;

    await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
      [cartId, productId, quantity]
    );

    res.status(200).json({ message: 'Item added to cart successfully!' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/checkout/:userId', verifyToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartId = cartResult.rows[0].id;

    const totalResult = await db.query(
      'SELECT SUM(p.price * ci.quantity) AS total_amount FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1',
      [cartId]
    );

    const totalAmount = totalResult.rows[0].total_amount;

    if (totalAmount === null) {
      return res.status(400).json({ message: 'Total amount cannot be null' });
    }

    await db.query(
      'INSERT INTO orders (user_id, total_amount, created_at) VALUES ($1, $2, NOW())',
      [userId, totalAmount]
    );

    // Clear the cart after purchase
    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    res.status(200).json({ message: 'Purchase successful' });
  } catch (error) {
    console.error('Error during purchase:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Remove an item from the cart
app.delete('/api/cart/remove-item/:itemId', verifyToken, async (req, res) => {
  const itemId = req.params.itemId;
  const userId = req.userId; // Assuming you have the user ID available from the token

  try {
    // Check if the cart exists for the user
    const cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartId = cartResult.rows[0].id;

    // Remove the item from the cart
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, itemId]
    );

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/dashboard',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email;
        const result = await db.query('SELECT * FROM users WHERE email = $1', [
          email,
        ]);

        if (result.rows.length === 0) {
          // Create new user if not found
          const newUser = await db.query(
            'INSERT INTO users (email, password) VALUES($1 , $2) RETURNING *',
            [email, 'google']
          );
          done(null, newUser.rows[0]);
        } else {
          done(null, result.rows[0]);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
