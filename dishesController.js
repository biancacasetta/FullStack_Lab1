import { fetchAllDishes, fetchDishByName, addDish, modifyDish, removeDish } from './dishesModel.js';

function getAllDishes(req, res, next) {
    fetchAllDishes().then(data => res.json(data));
}

function getDishByName(req, res, next) {
    const name = req.params.name;
    const d = fetchDishByName(name);

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
    .then(() => {
        res.status(201).send();
    })
    .catch(() => {
        const err = new Error("Conflict");
        err.status = 409;
        console.log("Dish already exists");
        next(err);
    });
}

function updateDish(req, res, next) {
    const id = req.params.id;
    const update = req.body;

    modifyDish(id, update)
    .catch(() => {
        const err = new Error("Not found");
        err.status = 404;
        console.log("Dish does not exist");
        next(err);
    });
}

function deleteDish(req, res, next) {
    const id = req.params.id;
    removeDish(id)
    .catch(() => {
        const err = new Error("Not found");
        err.status = 404;
        console.log("Dish does not exist");
        next(err);
    });;
}

export { getAllDishes, getDishByName, postDish, updateDish, deleteDish }