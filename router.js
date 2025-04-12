import express from 'express';
import { deleteDish, getAllDishes, getDishByName, postDish, updateDish } from './dishesController.js';

export const router = express.Router();

// define routes
router.get('/api/dishes', getAllDishes);
router.get('/api/dishes/:name', getDishByName);
router.post('/api/dishes', postDish);
router.put('/api/dishes/:id', updateDish);
router.delete('/api/dishes/:id', deleteDish);