const dishes = {};

document.addEventListener("DOMContentLoaded", addAllListeners);

async function addAllListeners() {
    populateTable(await getDishes());
    const form = document.getElementById("dish-form");
    form.addEventListener("submit", handleSubmitForm);
}

function getDishes() {
    return fetch(`/api/dishes`)
        .then(res => res.json())
        .catch(error => console.error("Fetching dishes unsuccessful: " + error));
}

async function populateTable(dishesData) {
    dishesData.forEach(dish => {
        dishes[dish._id] = dish;
        const dishRow = populateRow(dish);
        table.appendChild(dishRow);
    });
}

function populateRow(dish) {
    const rowTemplate = document.getElementById("template-row");
    const row = rowTemplate.content.cloneNode(true);
    row.querySelector("tr").setAttribute("id", dish._id);

    row.querySelector(".name").innerHTML = dish.name;
    row.querySelector(".time").innerHTML = dish.cooking_time;
    row.querySelector(".origin").innerHTML = dish.origin;

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

    if (res.status === 201) {
        form.reset();
        populateTable([newDish]);
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

    


    row.parentElement.insertBefore(editRow.querySelector("tr"), row.nextElementSibling);
    
    editRow.querySelector(".buttons .update-btn").addEventListener("click", handleEditDish);
    editRow.querySelector(".buttons .cancel-btn").addEventListener("click", handleCancelUpdate);
}



function handleCancelUpdate(e) {
    const 
}


// function editDish(e) {
//     const rowId = e.target.parentElement.id;
//     console.log(rowId);
    
//     const row = document.getElementById(rowId);
//     const columns = row.querySelectorAll("td");

//     for (let i = 0; i < columns.length; i++) {
//         const column = columns[i];
//         column.setAttribute("contenteditable", "true");
//     }

//     const buttons = row.querySelectorAll("button");
//     for (let i = 0; i < buttons.length; i++) {
//         const b = buttons[i];

//         if (i > 1) {
//             b.removeAttribute("hidden");
//         } else {
//             b.setAttribute("hidden", "true");
//         }
//     }
// }

async function handleDeleteDish(e) {
    const rowId = e.target.parentElement.parentElement.id;
    const res = await deleteDish(rowId);

    if (res.status == 200) {
        const row = document.getElementById(rowId);
        row.remove();
        delete dishes[rowId];
    }
}

async function deleteDish(id) {
    return await fetch(`/api/dishes/${id}`, {
        method: "DELETE"
    });
}

// function cancelUpdate(e) {
//     const rowId = e.target.parentElement.id;
  
//     const row = document.getElementById(rowId);
//     const columns = row.querySelectorAll("td");

//     for (let i = 0; i < columns.length; i++) {
//         const column = columns[i];
//         column.setAttribute("contenteditable", "false");
//     }

//     const buttons = row.querySelectorAll("button");
//     for (let i = 0; i < buttons.length; i++) {
//         const b = buttons[i];

//         if (i > 1) {
//             b.setAttribute("hidden", "true");
//         } else {
//             b.removeAttribute("hidden");
//         }
//     }
// }

// async function updateRow(e) {
//     const rowId = e.target.parentElement.id;
  
//     const row = document.getElementById(rowId);
//     const columns = row.querySelectorAll("td");

//     const updatedRow = {
//         name: columns[0].innerHTML,
//         ingredients: columns[1].innerHTML.split(','),
//         preparation: columns[2].innerHTML.split(','),
//         cooking_time: Number(columns[3].innerHTML),
//         origin: columns[4].innerHTML
//     };

//     const res = await fetch(`/api/dishes/${rowId}`, {
//         method: "PUT",
//         headers: {
//             'Accept': 'application/json',
//             'ContentType': 'application/json'
//         },
//         body: JSON.stringify(updatedRow)
//     });

//     if(res.status == 404) {
//         cancelUpdate(e);
//     }

// }
