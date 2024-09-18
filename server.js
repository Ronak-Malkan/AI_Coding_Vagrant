const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 8001;
const db = new sqlite3.Database(':memory:');

// Enable CORS
app.use(cors());


app.use(express.json());

// Create a todos table
db.serialize(() => {
    db.run(`
        CREATE TABLE todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            completed Boolean
        )
    `);
});

// GET all todos
app.get('/todos', (req, res) => {
    db.all('SELECT * FROM todos', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});

// POST a new todo
app.post('/todos', (req, res) => {
    const { title, completed } = req.body;
    console.log('Body: ');
    console.log(req.body);
    db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', title, completed, function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ id: this.lastID });
        }
    });
});

// PUT update a todo by ID
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    db.run('UPDATE todos SET title = ?, completed = ? WHERE id = ?', title, completed, id, function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Todo not found' });
        } else {
            res.json({ message: 'Todo updated successfully' });
        }
    });
});

// DELETE a todo by ID
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM todos WHERE id = ?', id, function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Todo not found' });
        } else {
            res.json({ message: 'Todo deleted successfully' });
        }
    });
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = server;