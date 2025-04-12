import { dishesSchema } from './database.js';
import mongoose from 'mongoose';

// create collection in database
const dishes = mongoose.model("dishes", dishesSchema);

function getAllDishes() {
    return dishes.find();
}

function getDishByName(n) {
   return dishes.findOne({name: n});
}

async function addDish(dish) {
    const dish = new dishes(dish);
    await dish.save();
    console.log("New dish added!");
}

function updateDish(id, update) {
    dishes.findByIdAndUpdate(id, update)
    .then(() => console.log("Updated doc"))
    .catch(e => console.log(e));
}

function removeDish(id) {
    dishes.findByIdAndDelete(id);
}

export { getAllDishes, getDishByName, addDish, updateDish, removeDish };