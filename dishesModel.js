import { dishes } from './database.js';

async function fetchAllDishes() {
    return await dishes.find()
    //.catch(() => console.log("error in model"));
}

function fetchDishByName(n) {
   return dishes.findOne({name: n});
}

async function addDish(dish) {
    const d = new dishes(dish);
    await d.save()
    .catch(err => {
        throw err;
    });
    console.log("New dish added!");
}

function modifyDish(id, update) {
    dishes.findByIdAndUpdate(id, update)
    .then(() => console.log("Updated doc"))
    .catch(err => {throw err});
}

function removeDish(id) {
    dishes.findByIdAndDelete(id);
}

export { fetchAllDishes, fetchDishByName, addDish, modifyDish, removeDish };