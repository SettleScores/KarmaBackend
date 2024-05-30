import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../database';

export const createTask = async (req: Request, res: Response): Promise<Response> => {
    // Extract task details from the request body
    //(title, description, completed)
    const { title, description, completed } = req.body;
    // Execute a SQL INSERT statement
    console.log("qqq dataBaseController createTask");
    await pool.query('INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3)', [title, description, completed]);
    // Send a JSON response to the client
    return res.status(201).json({
        // Task Created successfully
        message: 'Task created successfully',
        task: {
            title,
            description,
            completed,
        }
    });
};

export const getTasks = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Execute a PostgreSQL query to select all tasks
        const response: QueryResult = await pool.query('SELECT * FROM tasks');

        // Return a JSON response with the retrieved tasks
        return res.status(200).json(response.rows);
    } catch (error) {
        // Handle errors, log them, and return an internal server error response
        console.error(error);
        return res.status(500).json('Internal Server error');
    }
};

// Get a task by ID
export const getTaskById = async (req: Request, res: Response): Promise<Response> => {
    // Extract the task ID from the request parameters
    const id = parseInt(req.params.id);

    try {
        // Execute a PostgreSQL query to select a task by ID
        const response: QueryResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

        // Return a JSON response with the retrieved task
        return res.json(response.rows);
    } catch (error) {
        // Handle errors, log them, and return an internal server error response
        console.error(error);
        return res.status(500).json('Internal Server error');
    }
};

