//imported the 3 required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//instantiating express application to handle json payload
const app = express();
app.use(express.json());

//authentication using jwt
const SECRET = 'SECr3t';

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

//setting up mongoDB schema,model and connection
const userSchema = new mongoose.Schema({
  username: {type: String},
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const constantSchema = new mongoose.Schema({
  modifiedBy: String,
  timeStamp: { type: Date, default: Date.now },
  A: Number,
  B: Number,
  C: Number,
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Constant = mongoose.model('Constant', constantSchema);

mongoose.connect('mongodb+srv://kartikey02:0fFKHVdz8v8Xi1JY@cluster0.gakbdrh.mongodb.net/',
 { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

//routs section to handle API requests starts here

//signup and login routes
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
    if (admin) {
      res.status(403).json({ message: 'Admin already exists' });
    } else {
      const obj = { username: username, password: password };
      const newAdmin = new Admin(obj);
      newAdmin.save();
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Admin created successfully', token });
    }
  });

app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

//return the calsulated answer to the user
app.get('/calculate/:distance', authenticateJwt, async (req, res) => {
  const distance = parseFloat(req.params.distance); // Parse the distance as a float

  // Fetch the latest constants from the database
  const latestConstants = await Constant.findOne().sort({ timeStamp: -1 }).exec();
  if (!latestConstants) {
    return res.status(500).json({ message: 'Constants not found in the database' });
  }

  // Extract the constants (A, B, C) from the latest entry
  const { A, B, C } = latestConstants;

  // Calculate the answer using the formula
  const answer = A * distance + B * distance + C;
  res.json({ answer });
});

// Admin route to modify the constants
app.post('/admin/update-constants', authenticateJwt, async (req, res) => {
  const { A, B, C } = req.body;

  // Get the username of the admin who is modifying the constants
  const adminUsername = req.user.username;

  // Create a new entry with the updated constants
  const newConstants = new Constant({ modifiedBy: adminUsername, A, B, C });

  try {
    // Save the new constants to the database
    await newConstants.save();
    res.json({ message: 'Constants updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update constants' });
  }
});

//starting the server on port 5000
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
