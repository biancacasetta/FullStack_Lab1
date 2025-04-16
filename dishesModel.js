import { dishes } from './database.js';

async function fetchAllDishes() {
    return await dishes.find()
}

async function fetchDishByName(n) {
   return await dishes.findOne({name: n});
}

async function addDish(dish) {
    const d = new dishes(dish);
    return await d.save()
    .catch(err => {
        throw err;
    });
}

async function modifyDish(id, update) {
    await dishes.findByIdAndUpdate(id, update)
    .catch(err => {
        throw err;
    });
}

async function removeDish(id) {
    return await dishes.findByIdAndDelete(id)
    .catch(err => {
        throw err;
    });
}

export { fetchAllDishes, fetchDishByName, addDish, modifyDish, removeDish };