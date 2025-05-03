const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // your frontend port
  credentials: true
}));

// Session setup
app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/notes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Models
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('useres', UserSchema);

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  email: String
});
const Note = mongoose.model('Note', NoteSchema);

// Routes

// Home
app.get('/', (req, res) => {
  res.send('Server running');
});



app.get('/show', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const data = await Note.find({ email });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    req.session.user = { email };
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.user = { email };
    res.json({ message: 'Login successful', email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// Middleware: check login
function isAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.email) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

app.post('/create', async (req, res) => {
  try {
    const { title, content, email } = req.body;
    if (!title || !content || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const note = new Note({ title, content, email });
    await note.save();
    res.status(201).json({ message: "Note created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get notes
app.get('/notes', isAuthenticated, async (req, res) => {
  try {
    const notes = await Note.find({ email: req.session.user.email });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create note
app.post('/notes', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, email: req.session.user.email });
    await note.save();
    res.status(201).json({ message: 'Note created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update note
app.patch('/notes/:id', isAuthenticated, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, email: req.session.user.email },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note updated', note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete note
app.delete('/notes/:id', isAuthenticated, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, email: req.session.user.email });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// UPDATE note (PATCH)
app.patch('/edit/:id', async (req, res) => {
  const { title, content, email } = req.body;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, email }, // ensure only note owner can update
      { title, content },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: 'Note not found or unauthorized' });

    res.json({ message: 'Note updated', note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE note
app.delete('/delete/:id', async (req, res) => {
  const { email } = req.query;

  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, email });

    if (!note) return res.status(404).json({ message: 'Note not found or unauthorized' });

    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Start server
app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
