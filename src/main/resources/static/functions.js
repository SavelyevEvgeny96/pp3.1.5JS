const url = 'http://localhost:8080/api/'

//функция заполнения главной таблицы юзеров
export function fillUsersTable() {
    const allUsersTableBody = document.getElementById('allUsersTableBody')


    $('#allUsersTableBody').empty()
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let columnContent = ''
            data.forEach(element => {
                columnContent += `<tr>
                    <td>${element.id}</td>
                    <td>${element.firstName}</td>
                    <td>${element.lastName}</td>
                    <td>${element.login}</td>
                    <td>${element.email}</td>
                    <td>${element.age}</td>
                    <td>${element.roles.map(role => role.name.substring(5))}</td>
                    <td>
                    <button type="button" class="btn btn-danger delete" id="buttonDelete"
                    data-index="${element.id}" data-bs-target="#modalDelete" data-bs-toggle="modal">
                    Delete
                    </button>
                    </td>
                    <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" id="buttonEdit"
                    data-index="${element.id}" data-bs-target="#modalEdit">
                    Edit
                    </button>
                    </td>
                    <td>
                    </td>
                </tr>
                `
            })
            allUsersTableBody.innerHTML = columnContent

        })
}

//функция заполнения таблица текущего юзера
export function fullCurrentUserTable() {
    const currentUserTableBody = document.getElementById('currentUserTableBody')
    const currentUserLogin = document.getElementById('currentUserLogin').innerText;
    console.log(currentUserLogin)
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let columnContent = ''
            data.forEach(element =>{
                if (element.username == currentUserLogin) {
                    columnContent += `<tr>
                    <td>${element.id}</td>
                    <td>${element.firstName}</td>
                    <td>${element.lastName}</td>
                    <td>${element.login}</td>
                    <td>${element.email}</td>
                    <td>${element.age}</td>
                    <td>${element.roles.map(role => role.name.substring(5))}</td>
                    </tr>`
                }
                currentUserTableBody.innerHTML = columnContent;
                }


            )
        }
        )
}

//функция выбора ролей для нового юзера
export function getRolesForNewUser() {
    const selectRolesForNewUser = document.getElementById('selectRolesForNewUser')
    fetch('http://localhost:8080/api/roles')
        .then(response => response.json())
        .then(data => {
            let resRoles = ''
            data.forEach(element => {
                if (element.id === 2) {
                    resRoles +=
                        `
                    <option value='${element.id}' selected>
                    ${element.name}
                    </option>
                    `
                } else {
                    resRoles +=
                        `
                    <option value='${element.id}' >
                    ${element.name}
                    </option>
                    `
                }
            })
            selectRolesForNewUser.innerHTML = resRoles
        })
}

//функция создания нового юзера
export function createNewUser(e) {
    e.preventDefault()
    const newUserForm = document.forms['createUserForm']
    let newUserRoles = []
    for (let option of document.getElementById('selectRolesForNewUser').options) {
        if (option.selected) {
            newUserRoles.push({
                id: option.value,
                name: 'ROLE_' + option.innerText
            })
        }
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: newUserForm.name.value,
            lastName: newUserForm.surname.value,
            email: newUserForm.email.value,
            age: newUserForm.age.value,
            login: newUserForm.login.value,
            password: newUserForm.password.value,
            roles: newUserRoles
        })
    }).then((response) => {
            if (response.ok) {
                newUserForm.reset()
                fillUsersTable()
                getSuccessMessage('User has been created!')
                $('.nav-tabs a[href="#UserTable"]').tab('show')
            } else {
                getErrorMessage({
                    "message": "Error. Enter valid data"
                }, newUserForm)
            }
        }
    )
}

//функция заполнения форм (редактирования, удаления)
export function fillUserForm(id, formName, method) {
    fetch(url + id)
        .then(response => response.json())
        .then(data => {
            formName.id.value = data.id
            formName.name.value = data.firstName
            formName.surname.value = data.lastName
            formName.email.value = data.email
            formName.login.value = data.login
            formName.age.value = data.age
            let rolesForEditedUser = document.getElementById('roles' + method)
            let userRolesId = []
            data.roles.forEach(role => {
                userRolesId.push(role.id)
            })
            fetch('http://localhost:8080/api/roles')
                .then(response => response.json())
                .then(data => {
                    let resRoles = ''
                    data.forEach(element => {
                        if (userRolesId.includes(element.id)) {
                            resRoles +=
                                `
                    <option value='${element.id}' selected>
                    ${element.name.substring(5)}
                    </option>
                    `
                        } else {
                            resRoles +=
                                `
                    <option value='${element.id}' >
                    ${element.name.substring(5)}
                    </option>
                    `
                        }
                    })
                    rolesForEditedUser.innerHTML = resRoles
                })
        })
}

//функция редактирования юзера
export function updateCurrentUser(e) {
    e.preventDefault()
    let editUserRoles = []
    for (let option of document.getElementById('rolesEdit').options) {
        if (option.selected) {
            editUserRoles.push({
                id: option.value,
                name: 'ROLE_' + option.innerText
            })
        }
    }
    let userEditForm = document.forms['editUserModalForm']
    fetch(url + 'patch', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: userEditForm.id.value,
            firstName: userEditForm.firstName.value,
            lastName: userEditForm.lastName.value,
            email: userEditForm.email.value,
            age: userEditForm.age.value,
            login: userEditForm.login.value,
            password: userEditForm.password.value,
            roles: editUserRoles
        })
    }).then((response) => {
            if (response.ok) {
                fillUsersTable()
                userEditForm.password.value = ''
                document.getElementById('closeEditModalWindow').click()
                getSuccessMessage('User has been updated!')
                $('.nav-tabs a[href="#UserTable"]').tab('show')
            } else {
                getErrorMessage({
                    "message": "Error. Enter valid data"
                }, userEditForm)
            }
        }
    )
}

//функция удаления юзера
export function deleteCurrentUser(id) {
    fetch(url + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        fillUsersTable()
        document.getElementById('closeDeleteModal').click()
        getSuccessMessage('User has been deleted!')
        $('.nav-tabs a[href="#UserTable"]').tab('show')
    })
}

//получение окна сообщения с ошибками
function getErrorMessage(errorJSON, form) {
    let errorBody = document.getElementById('errorBody')
    let errorBodyText = ''
    for (let line of errorJSON.message.split(';')) {
        errorBodyText +=
            `
             <a>${line}</a>
             <br>
             `
    }
    //console.log(errorJSON.message)
    errorBody.innerHTML = errorBodyText
    form.password.value = ''
    $('#errorModal').modal('toggle')
}

//получение окна выполнения успешной операции
function getSuccessMessage(message) {
    $('#successModal').modal('toggle')
    document.getElementById('successBody').innerHTML =
        `
        <a>${message}</a>
        `
}