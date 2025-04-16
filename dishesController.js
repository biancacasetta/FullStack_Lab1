import { fetchAllDishes, fetchDishByName, addDish, modifyDish, removeDish } from './dishesModel.js';

async function getAllDishes(req, res, next) {
    await fetchAllDishes().then(data => res.json(data));
}

async function getDishByName(req, res, next) {
    const name = req.params.name;
    const d = await fetchDishByName(name);

    if(!d) {
        const err = new Error("Not found");
        err.status = 404;
        console.log("Dish name does not exist");
        next(err);
    } else {
        res.json(d);
    }
}

async function postDish(req, res, next) {
    const dish = req.body;
    addDish(dish)
    .then(d => {
        res.status(201).json(d);
    })
    .catch(() => {
        const err = new Error("Conflict");
        err.status = 409;
        console.log("Dish already exists");
        next(err);
    });
}

async function updateDish(req, res, next) {
    const id = req.params.id;
    const update = req.body;

    try {
        await modifyDish(id, update);
        res.send();
    } catch {
        console.log("Dish does not exist");
        const err = new Error("Not found");
        err.status = 404;
        next(err);
    }
}

async function deleteDish(req, res, next) {
    const id = req.params.id; 

    try {
        await removeDish(id);
        res.send();
    } catch {
        const err = new Error("Not found");
        err.status = 404;
        console.log("Dish does not exist");
        next(err);
    }
}

export { getAllDishes, getDishByName, postDish, updateDish, deleteDish }