const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
import { describe, it, beforeEach, expect, vi } from 'vitest';

const taskRouter = require('../../routes/tasks'); // Path to your router

const app = express();
app.use(express.json());
app.use('/tasks', taskRouter);

// Mock the Task model
const Task = require('../../models/task');
vi.mock('../../models/task');

describe('Task API', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  it('should create a new task', async () => {
    Task.prototype.save = vi.fn().mockResolvedValue({
      description: 'Test Task',
      _id: '12345'
    });

    const response = await request(app)
      .post('/tasks')
      .send({ description: 'Test Task' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      description: 'Test Task',
      _id: expect.any(String)
    });
  });

  it('should get all tasks', async () => {
    Task.find = vi.fn().mockResolvedValue([
      { description: 'Test Task 1', _id: '12345' },
      { description: 'Test Task 2', _id: '67890' }
    ]);

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { description: 'Test Task 1', _id: '12345' },
      { description: 'Test Task 2', _id: '67890' }
    ]);
  });

  it('should get a task by ID', async () => {
    Task.findById = vi.fn().mockResolvedValue({
      description: 'Test Task',
      _id: '12345'
    });

    const response = await request(app).get('/tasks/12345');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      description: 'Test Task',
      _id: '12345'
    });
  });

  it('should return 404 for a non-existing task by ID', async () => {
    Task.findById = vi.fn().mockResolvedValue(null);

    const response = await request(app).get('/tasks/99999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found' });
  });

  it('should update a task', async () => {
    Task.findByIdAndUpdate = vi.fn().mockResolvedValue({
      description: 'Updated Task',
      _id: '12345'
    });

    const response = await request(app)
      .put('/tasks/12345')
      .send({ description: 'Updated Task' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      description: 'Updated Task',
      _id: '12345'
    });
  });

  it('should partially update a task', async () => {
    Task.findByIdAndUpdate = vi.fn().mockResolvedValue({
      description: 'Partially Updated Task',
      _id: '12345'
    });

    const response = await request(app)
      .patch('/tasks/12345')
      .send({ description: 'Partially Updated Task' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      description: 'Partially Updated Task',
      _id: '12345'
    });
  });

  it('should delete a task', async () => {
    Task.findByIdAndDelete = vi.fn().mockResolvedValue({
      description: 'Task to be deleted',
      _id: '12345'
    });

    const response = await request(app).delete('/tasks/12345');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Task deleted.' });
  });

  it('should handle errors during task creation', async () => {
    Task.prototype.save = vi.fn().mockRejectedValue(new Error('Save failed'));

    const response = await request(app)
      .post('/tasks')
      .send({ description: 'Test Task' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Save failed' });
  });

  it('should handle errors during task update', async () => {
    Task.findByIdAndUpdate = vi.fn().mockRejectedValue(new Error('Update failed'));

    const response = await request(app)
      .put('/tasks/12345')
      .send({ description: 'Updated Task' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Update failed' });
  });

  it('should handle errors during task deletion', async () => {
    Task.findByIdAndDelete = vi.fn().mockRejectedValue(new Error('Delete failed'));

    const response = await request(app).delete('/tasks/12345');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Delete failed' });
  });
});
