// test/task.model.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Task = require('../models/task'); // Adjust the path as needed

let mongoServer;

beforeAll(async () => {
  try {
    // Start MongoMemoryServer with a compatible MongoDB version
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '4.4.6' // Specify a compatible version
      }
    });
    
    // Get the URI to connect to the in-memory MongoDB instance
    const mongoUri = mongoServer.getUri();

    // Connect Mongoose to the in-memory MongoDB instance
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Failed to initialize MongoMemoryServer:', error);
  }
});

afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Failed to stop MongoMemoryServer:', error);
  }
});

describe('Task Model', () => {
  it('should create a new task successfully', async () => {
    const taskData = { description: 'Test Task' };
    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.description).toBe(taskData.description);
  }, 10000); // Increase timeout to 10 seconds

  it('should require a description field', async () => {
    const task = new Task({});
    let error;

    try {
      await task.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.description).toBeDefined();
    expect(error.errors.description.kind).toBe('required');
  });

  it('should not allow unknown fields', async () => {
    const taskData = { description: 'Test Task', unknownField: 'Some Value' };
    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask.unknownField).toBeUndefined();
  }, 10000); // Increase timeout to 10 seconds
});
