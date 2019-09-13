var bmiForm = document.getElementById("bmi-form");
var bmiTableBody = document.getElementById("bmi-table-body");
var save = document.getElementById("save");
var update = document.getElementById("update");
var cancel = document.getElementById("cancel");
var nameInput = document.getElementById("name");
var heightInput = document.getElementById("height");
var weightInput = document.getElementById("weight");
var displayName = document.getElementById("display-name");
var displayBmi = document.getElementById("display-bmi");
var popUpModal = document.getElementById("popup-modal");
var popUpMessage = document.getElementById("popup-message");
var popUpButton = document.getElementById("popup-button");

initialTable();

bmiForm.onsubmit = function(e) {
    e.preventDefault();
    let name = document.getElementById("name");
    let weight = document.getElementById("weight");
    let height = document.getElementById("height");
    if (!validate(name.value, weight.value, height.value)) {
        alert("Invalid Input");
        return false;
    }
    let BMI = calculateBMI();
    let person = {
        id: getId(),
        name: name.value,
        height: height.value,
        weight: weight.value,
        bmi: BMI
    }
    name.value = "";
    weight.value = "";
    height.value = "";
    addPerson(person);
    displayPopUpModal(getBmiMessage(person.bmi));
    bmiTableBody.innerHTML += `
        <tr>
            <td>${person.name}</td>
            <td>${person.height}</td>
            <td>${person.weight}</td>
            <td><span class="${getColorForBMI(person.bmi)}">${person.bmi.toFixed(2)}</span></td>
            <td>
                <button type="button" onClick="editPerson(${person.id})">Edit</button>
                <button type="button" onClick="deletePerson(${person.id})">Delete</button>
            </td>
        </tr>
    `;
};

heightInput.onkeyup = function() {
    displayYourBMI();
}
weightInput.onkeyup = function() {
    displayYourBMI();
}

nameInput.onkeyup = function(e) {
    displayName.innerHTML = `Name: ${e.target.value}`;
}

cancel.onclick = function() {
    cancelEdit();
}

update.onclick = function() {
    updatePerson();
}

popUpButton.onclick = function() {
    hidePopUpModal();
}

// weight.onkeypress = function(e) {

// };
function validate(name, weight, height) {
    if (isNaN(weight) || isNaN(height)) {
        return false;
    }
    if (weight <= 0 || height <= 0) {
        return false;
    }
    if (name === "") {
        return false;
    }
    return true;
}

function displayYourBMI() {
    var weightInput = document.getElementById("weight");
    var heightInput = document.getElementById("height");
    if (weightInput.value != null && weightInput.value != "" && heightInput.value != null && heightInput.value != "") {
        displayBmi.innerHTML = `Your BMI: ${calculateBMI().toFixed(2)}`;
    }
}

function getBmiMessage(bmi) {
    let msg = '';
    if (bmi < 18.5) {
        msg = 'คุณน้ำหนักน้อยกว่ามาตรฐาน';
    } else if (bmi >= 18.5 && bmi <= 22.9) {
        msg = 'คุณปกติ';
    } else if (bmi >= 23 && bmi <= 24.9) {
        msg = 'คุณอ้วนระดับที่ 1';
    } else if (bmi >= 25 && bmi <= 29.9) {
        msg = 'คุณอ้วนระดับที่ 2';
    } else if (bmi >= 30) {
        msg = 'คุณอ้วนระดับที่ 3';
    }
    return msg;
}

function displayPopUpModal(msg) {
    popUpModal.style.display = 'block';
    popUpMessage.innerHTML = msg;
}

function hidePopUpModal() {
    popUpModal.style.display = 'none';
}

function initialTable() {
    let people = fetchPeople();
    people.map(person => {
        bmiTableBody.innerHTML += `
            <tr>
                <td>${person.name}</td>
                <td>${person.height}</td>
                <td>${person.weight}</td>
                <td><span class="${getColorForBMI(person.bmi)}">${person.bmi.toFixed(2)}</span></td>
                <td>
                    <button type="button" onClick="editPerson(${person.id})">Edit</button>
                    <button type="button" onClick="deletePerson(${person.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function refreshTable() {
    bmiTableBody.innerHTML = "";
    initialTable();
}

function fetchPeople() {
    let people = JSON.parse(localStorage.getItem("people"));
    if (!Array.isArray(people)) {
        people = [];
    }
    return people;
}

function getId() {
    let people = fetchPeople();
    if (people.length === 0) {
        return 1;
    }
    return people[people.length - 1].id + 1;
}

function addPerson(person) {
    let people = fetchPeople();
    people = [...people, person];
    localStorage.setItem("people", JSON.stringify(people));
}

function deletePerson(id) {
    let people = fetchPeople();
    people = people.filter(person => person.id !== id);
    localStorage.setItem("people", JSON.stringify(people));
    refreshTable();
}

function editPerson(id) {
    switchDisplayButton('edit');
    let people = fetchPeople();
    let person = people.find(person => person.id === id);

    let idInput = document.getElementById("id");
    let name = document.getElementById("name");
    let weight = document.getElementById("weight");
    let height = document.getElementById("height");
    idInput.value = person.id;
    name.value = person.name;
    weight.value = person.weight;
    height.value = person.height;
}

function cancelEdit() {
    switchDisplayButton('create');
    let idInput = document.getElementById("id");
    let name = document.getElementById("name");
    let weight = document.getElementById("weight");
    let height = document.getElementById("height");
    idInput.value = "";
    name.value = "";
    weight.value = "";
    height.value = "";
    refreshTable();
}

function updatePerson() {
    let idInput = document.getElementById("id");
    let name = document.getElementById("name");
    let weight = document.getElementById("weight");
    let height = document.getElementById("height");
    let people = fetchPeople();
    people.forEach(person => {
        if (person.id == idInput.value) {
            person.name = name.value;
            person.weight = weight.value;
            person.height = height.value;
        }
    });
    localStorage.setItem("people", JSON.stringify(people));
    refreshTable();
    cancelEdit();
}

function switchDisplayButton(event) {
    if (event === 'edit') {
        save.style.display = 'none';
        update.style.display = 'block';
        cancel.style.display = 'block';
    } else if (event === 'create') {
        save.style.display = 'block';
        update.style.display = 'none';
        cancel.style.display = 'none';
    }
}

function getColorForBMI(bmi) {
    let color = '';
    if (bmi < 18.5) {
        color = 'red';
    } else if (bmi >= 18.5 && bmi < 23) {
        color = 'green';
    } else if (bmi >= 23 && bmi < 30) {
        color = 'sky';
    } else if (bmi >= 30) {
        color = 'blue';
    }
    return color;
}
function calculateBMI () {
    return weight.value / Math.pow(height.value/100, 2);
}