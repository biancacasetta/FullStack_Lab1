import { dishes } from './database.js';

async function fetchAllDishes() {
    return await dishes.find()
}

async function fetchDishByName(n) {
   return await dishes.findOne({name: n});
}

async function addDish(dish) {
    const d = new dishes(dish);
    console.log(d);
    await d.save()
    .catch(err => {
        throw err;
    });
    console.log("New dish added!");
}

async function modifyDish(id, update) {
    await dishes.findByIdAndUpdate(id, update)
    .catch(err => {
        throw err;
    });
}

async function removeDish(id) {
    return await dishes.findByIdAndDelete(id);
}

export { fetchAllDishes, fetchDishByName, addDish, modifyDish, removeDish };