const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/notes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const User = mongoose.model('user', userSchema);

app.get('/', (req, res) => {
  res.send("Home page");
});

app.post('/create', async (req, res) => {
  try {
    const data = new User(req.body);
    const result = await data.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/show', async (req, res) => {
  try {
    const data = await User.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Data deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/edit/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Data updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
