// Setup App and replace server.js file with this file.
// We have placed multiple bugs in this file, your task is to debug and fix as many as possible.
// Please note the bugs and write a bried about the bug and steps you took to solve it.

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/mren-app', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("mongodb connection success"); 
})
.catch((err) => {
    console.error("mongodb connection error:", err); 
});

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
      },
    email: { 
        type: String,
        required: true,
        unique: true
    }
});

const User = mongoose.model('User', userSchema);

app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// client/src/App.js
import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const addUser = () => {
    fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    })
      .then(res => res.json())
      .then(user => setUsers([...users, user]));
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={addUser}>Add User</button>
    </div>
  );
}

export default App;
