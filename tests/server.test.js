const request = require('supertest');
const express = require('express');
const app = require('../server');

describe('GET /todos', () => {
    it('should return a list of all todos', async () => {
        const response = await request(app).get('/todos');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
describe('POST /todos', () => {
    it('should add a new todo to the database', async () => {
        const newTodo = {
            title: 'New Todo',
            id: 1,
            completed: false
        };

        const response = await request(app).post('/todos').send(newTodo);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });
});
describe('DELETE /todos/:id', () => {
    it('should delete a todo by ID', async () => {
        const todoId = 1; // Replace with the ID of the todo you want to delete

        const response = await request(app).delete(`/todos/${todoId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Todo deleted successfully');
    });
});
