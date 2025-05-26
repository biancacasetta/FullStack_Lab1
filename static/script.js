const dishes = {};

document.addEventListener("DOMContentLoaded", addAllListeners);

async function addAllListeners() {
    populateTable(await getDishes());
    const form = document.getElementById("dish-form");
    form.addEventListener("submit", handleSubmitForm);

    const popup = document.getElementById("popup");
    popup.querySelector("#popup-delete").addEventListener("click", handlePopupDelete);
    popup.querySelector("#popup-cancel").addEventListener("click", () => popup.close());
}

async function getDishes() {
    return await fetch('/api/dishes')
        .then(res => res.json())
        .catch(error => console.error("Fetching dishes unsuccessful: " + error));
}

function populateTable(dishesData) {
    const table = document.getElementById("table");
    const p = document.getElementById("empty");
    if (dishesData.length  == 0) {
        table.setAttribute("hidden", "true");
        p.removeAttribute("hidden");
    } else {
        table.removeAttribute("hidden");
        p.setAttribute("hidden", "true");
        dishesData.forEach(dish => {
            dishes[dish._id] = dish;
            const dishRow = populateRow(dish);
            table.appendChild(dishRow);
        });
    }
}

function populateRow(dish) {
    const rowTemplate = document.getElementById("template-row");
    const row = rowTemplate.content.cloneNode(true);
    row.querySelector("tr").setAttribute("id", dish._id);

    row.querySelector(".name").innerHTML = dish.name;
    row.querySelector(".time").innerHTML = dish.cooking_time;
    row.querySelector(".origin").innerHTML = dish.origin;
    row.querySelector(".calories").innerHTML = dish.calories;

    const ingList = row.querySelector(".ingredients ul");
    populateList(dish.ingredients, ingList);
    const prepList = row.querySelector(".preparation ol");
    populateList(dish.preparation, prepList);

    row.querySelector(".buttons .edit-btn").addEventListener("click", handleEditDish);
    row.querySelector(".buttons .delete-btn").addEventListener("click", handleDeleteDish);
    return row;
}

function populateList(items, listElement) {
    items.forEach(i => {
        const el = document.createElement("li");
        el.innerHTML = i;
        listElement.appendChild(el);
    });
}

function joinListItems(listElement) {
    const items = listElement.querySelectorAll("li");
    let joinedString = [];
    let sep = listElement instanceof HTMLUListElement ? ", " : "\n";

    items.forEach(i => {
        joinedString.push(i.innerHTML);
    });
    joinedString = joinedString.join(sep);

    return joinedString;
}

async function handleSubmitForm(e) {
    e.preventDefault();
    const form = document.forms[0];
    const formData = new FormData(form);
    const newDish = {};

    for (const [key, value] of formData) {
        newDish[key] = value.toLowerCase();
    }

    newDish["ingredients"] = newDish["ingredients"].split(/\s*,\s*/);
    newDish["preparation"] = newDish["preparation"].split(/\s*\n\s*/);
    const res = await createDish(newDish);
    const body = await res.json();

    if (res.status === 201) {
        form.reset();
        populateTable([body]);
    }
}

async function createDish(dish) {
    return await fetch('/api/dishes', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dish)
    });

}

function handleEditDish(e) {
    const rowId = e.target.parentElement.parentElement.id;
    const row = document.getElementById(rowId);
    const editRowTemplate = document.getElementById("template-update-row");
    const editRow = editRowTemplate.content.cloneNode(true);

    row.setAttribute("hidden", "true");
    populateEditRow(editRow, row);
    editRow.querySelector("tr").style.backgroundColor = "rgba(255, 69, 0, 0.4)";
    
    editRow.querySelector(".buttons .update-btn").addEventListener("click", handleUpdateDish);
    editRow.querySelector(".buttons .cancel-btn").addEventListener("click", handleCancelUpdate);
    
    row.parentElement.insertBefore(editRow.querySelector("tr"), row.nextElementSibling);
}

function populateEditRow(editRow, originalRow) {
    editRow.querySelector(".name input").value = originalRow.querySelector(".name").innerHTML;
    editRow.querySelector(".time input").value = originalRow.querySelector(".time").innerHTML;
    editRow.querySelector(".origin input").value = originalRow.querySelector(".origin").innerHTML;
    editRow.querySelector(".calories input").value = originalRow.querySelector(".calories").innerHTML;

    const ingList = originalRow.querySelector(".ingredients ul");
    editRow.querySelector(".ingredients input").value = joinListItems(ingList);
    const prepList = originalRow.querySelector(".preparation ol");
    editRow.querySelector(".preparation textarea").value = joinListItems(prepList);
}

function handleCancelUpdate(e) {
    const editRow = e.target.parentElement.parentElement;
    const originalRow = editRow.previousElementSibling;
    editRow.remove();
    originalRow.removeAttribute("hidden");
}

async function handleUpdateDish(e) {
    const editRow = e.target.parentElement.parentElement;
    let originalRow = editRow.previousElementSibling;

    const updatedDish = {
        _id: originalRow.id,
        name: editRow.querySelector(".name input").value.toLowerCase(),
        ingredients: editRow.querySelector(".ingredients input").value.toLowerCase().split(/\s*,\s*/),
        preparation: editRow.querySelector(".preparation textarea").value.toLowerCase().split(/\s*\n\s*/),
        cooking_time: Number(editRow.querySelector(".time input").value),
        origin: editRow.querySelector(".origin input").value.toLowerCase(),
        calories: Number(editRow.querySelector(".calories input").value)
    };

    const res = await updateDish(updatedDish);

    if (res.status === 200) {
        const updatedRow = populateRow(updatedDish);
        originalRow.parentElement.replaceChild(updatedRow, originalRow);
        dishes[updatedDish._id] = updatedDish;
        editRow.remove();
    } else if (res.status === 404) {
        handleCancelUpdate(e);
    }
}

async function updateDish(updatedDish) {
    return await fetch(`/api/dishes/${updatedDish._id}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDish)
    });
}

async function handleDeleteDish(e) {
    const popup = document.querySelector("dialog");
    const rowId = e.target.parentElement.parentElement.id;
    popup.setAttribute("rowId", rowId);
    console.log(e.target.parentElement.parentElement.id);
    const dishName = dishes[rowId].name;
    const p = document.getElementById("dish-to-remove");
    p.innerHTML = `Delete ${dishName}?`;
    popup.showModal();
}

async function handlePopupDelete(e) {
    const popup = e.target.parentElement;
    const rowId = popup.getAttribute("rowId");
    const res = await deleteDish(rowId);

    if (res.status == 200) {
        const row = document.getElementById(rowId);
        row.remove();
        delete dishes[rowId];
    }
    popup.close();
}

async function deleteDish(id) {
    return await fetch(`/api/dishes/${id}`, {
        method: "DELETE"
    });
}