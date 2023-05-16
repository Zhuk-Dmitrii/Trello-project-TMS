import { Modal } from 'bootstrap'
// import { setData } from '../../../JavaScript-HW-FE101/frontend-101/todo-list/script/function-helpers'

// const modalElement = document.querySelector('#exampleModalEdit')
// const modalInstance = Modal.getOrCreateInstance(modalElement)
// modalInstance.show()

// -------------ПЕРЕМЕННЫЕ------------------------------
let trelloTodos = getData(key = 'todos')
let trelloInProgress = getData(key = 'inProgress')
let trelloDone = getData(key = 'done')

const containerCardsElement = document.querySelector('.trello-page__container')
const containerCardTodoElement = document.querySelector('.todo__cards')
const containerCardInProgressElement = document.querySelector('.in-progress__cards')
const containerCardDoneElement = document.querySelector('.done__cards')
const createFormElement = document.querySelector('#create-form')
const titleCreateElement = document.querySelector('#title-create')
const descriptionCreateElement = document.querySelector('#description-create')
const responsibleCreateElement = document.querySelector('#responsible-create')
const counterCardsTodoElement = document.querySelector('.todo__counter')
const counterCardsInProgressElement = document.querySelector('.in-progress__counter')
const counterCardsDoneElement = document.querySelector('.done__counter')
const buttonDeleteAllElement = document.querySelector('.done__button-removeAll')
const watchElement = document.querySelector('.header__time')

// -------------ЗАГРУЗКА ИНФОРМАЦИИ ИЗ localStorage ПРИ ОТКРЫТИИ ИЛИ ОБНОВЛЕНИИ СТРАНИЦЫ-------------------
render(trelloTodos, containerCardTodoElement)
render(trelloInProgress, containerCardInProgressElement)
render(trelloDone, containerCardDoneElement)
countCards(trelloTodos, counterCardsTodoElement)
countCards(trelloInProgress, counterCardsInProgressElement)
countCards(trelloDone, counterCardsDoneElement)

// -------------СЛУШАТЕЛИ СОБЫТИЙ-------------------
createFormElement.addEventListener('submit', handleSubmitCreateForm)

containerCardsElement.addEventListener('submit', handleSubmitEditForm)

containerCardsElement.addEventListener('click', handleClickDelete)

containerCardsElement.addEventListener('change', handleChangeCardMovement)

buttonDeleteAllElement.addEventListener('click', handleClickDeleteAll)

window.addEventListener('beforeunload', handleBeforeUnload)

// -------------ОБРАБОТЧИКИ СОБЫТИЙ----------------------
function handleSubmitCreateForm(event) {
    event.preventDefault()

    const title = titleCreateElement.value
    const description = descriptionCreateElement.value
    const responsible = responsibleCreateElement.value
    const todo = new Todo(title, description, responsible)
    const modalElement = document.querySelector(`#exampleModalAdd`)
    const modalInstance = Modal.getOrCreateInstance(modalElement)

    trelloTodos.push(todo)
    render(trelloTodos, containerCardTodoElement)
    countCards(trelloTodos, counterCardsTodoElement)
    createFormElement.reset()
    modalInstance.hide()
}

function handleSubmitEditForm(event) {
    event.preventDefault()

    editForm(trelloTodos, containerCardTodoElement)
    editForm(trelloInProgress, containerCardInProgressElement)
    editForm(trelloDone, containerCardDoneElement)
}

function handleClickDelete() {
    deleteCard(trelloTodos, containerCardTodoElement, counterCardsTodoElement)
    deleteCard(trelloInProgress, containerCardInProgressElement, counterCardsInProgressElement)
    deleteCard(trelloDone, containerCardDoneElement, counterCardsDoneElement)
}

function handleChangeCardMovement(event) {
    const { target } = event

    trelloTodos.forEach((item, index) => {
        const selectCardMoveElement = document.querySelector(`#selection${item.id}`)

        if (target.closest(`#selection${item.id}`)) {
            if (item.id == target.closest('.todo__card').id) {
                if (selectCardMoveElement.value == 'In progress') {
                    if (trelloInProgress.length < 6) {
                        item.containerSelection = 'In progress'
                        trelloTodos.splice(index, 1)
                        trelloInProgress.push(item)

                        render(trelloTodos, containerCardTodoElement)
                        render(trelloInProgress, containerCardInProgressElement)
                        countCards(trelloTodos, counterCardsTodoElement)
                        countCards(trelloInProgress, counterCardsInProgressElement)
                    } else {
                        confirm('WARNING!!! \nВыполни текущие дела прежде чем добавить новые!')
                        trelloInProgress.length = 6
                        item.containerSelection = null

                        render(trelloTodos, containerCardTodoElement)
                        render(trelloInProgress, containerCardInProgressElement)
                        countCards(trelloTodos, counterCardsTodoElement)
                        countCards(trelloInProgress, counterCardsInProgressElement)
                    }

                } else if (selectCardMoveElement.value == 'Done') {
                    item.containerSelection = 'Done'
                    trelloTodos.splice(index, 1)
                    trelloDone.push(item)

                    render(trelloTodos, containerCardTodoElement)
                    render(trelloDone, containerCardDoneElement)
                    countCards(trelloTodos, counterCardsTodoElement)
                    countCards(trelloDone, counterCardsDoneElement)
                }
            }
        }
    })

    trelloInProgress.forEach((item, index) => {
        const selectCardMoveElement = document.querySelector(`#selection${item.id}`)

        if (target.closest(`#selection${item.id}`)) {
            if (item.id == target.closest('.todo__card').id) {
                if (selectCardMoveElement.value == 'Todo') {
                    item.containerSelection = 'Todo'
                    trelloInProgress.splice(index, 1)
                    trelloTodos.push(item)

                    render(trelloTodos, containerCardTodoElement)
                    render(trelloInProgress, containerCardInProgressElement)
                    countCards(trelloTodos, counterCardsTodoElement)
                    countCards(trelloInProgress, counterCardsInProgressElement)

                } else if (selectCardMoveElement.value == 'Done') {
                    item.containerSelection = 'Done'
                    trelloInProgress.splice(index, 1)
                    trelloDone.push(item)

                    render(trelloInProgress, containerCardInProgressElement)
                    render(trelloDone, containerCardDoneElement)
                    countCards(trelloInProgress, counterCardsInProgressElement)
                    countCards(trelloDone, counterCardsDoneElement)
                }
            }
        }
    })

    trelloDone.forEach((item, index) => {
        const selectCardMoveElement = document.querySelector(`#selection${item.id}`)

        if (target.closest(`#selection${item.id}`)) {
            if (item.id == target.closest('.todo__card').id) {
                if (selectCardMoveElement.value == 'Todo') {
                    item.containerSelection = 'Todo'
                    trelloDone.splice(index, 1)
                    trelloTodos.push(item)

                    render(trelloTodos, containerCardTodoElement)
                    render(trelloDone, containerCardDoneElement)
                    countCards(trelloTodos, counterCardsTodoElement)
                    countCards(trelloDone, counterCardsDoneElement)

                } else if (selectCardMoveElement.value == 'In progress') {
                    if (trelloInProgress.length < 6) {
                        item.containerSelection = 'In progress'
                        trelloDone.splice(index, 1)
                        trelloInProgress.push(item)

                        render(trelloInProgress, containerCardInProgressElement)
                        render(trelloDone, containerCardDoneElement)
                        countCards(trelloInProgress, counterCardsInProgressElement)
                        countCards(trelloDone, counterCardsDoneElement)
                    } else {
                        confirm('WARNING!!! \nВыполни текущие дела прежде чем добавить новые!')
                        trelloInProgress.length = 6

                        render(trelloDone, containerCardDoneElement)
                        render(trelloInProgress, containerCardInProgressElement)
                        countCards(trelloInProgress, counterCardsInProgressElement)
                        countCards(trelloDone, counterCardsDoneElement)
                        console.log(trelloInProgress.length)
                    }
                }
            }
        }
    })
}

function handleClickDeleteAll (event) {
    if (trelloDone.length == 0) {
        return
    }

    const {target} = event
    const deleteAllConfirm = confirm('Вы точно хотите удалить все карточки?!');

    if (target == buttonDeleteAllElement) {
        if (deleteAllConfirm == true) {
            trelloDone.length = 0
            render(trelloDone, containerCardDoneElement)
            countCards(trelloDone, counterCardsDoneElement)
        }
    }
}

// -------------ШАБЛОН КАРТОЧКИ--------------------------
function buildCardTodo(cardObject) {
    const date = new Date(cardObject.date).toLocaleString()

    return `
        <div class="todo__card" id="${cardObject.id}">
            <div class="todo__card-header">
                <p class="todo__card-title">${cardObject.title}</p>
                <p class="todo__card-date">${date}</p>
            </div>
            <div class="todo__card-description">
                <textarea class="card-description" placeholder="Description" rows="3" disabled>${cardObject.description}</textarea>
            </div>
            <div class="todo__card-user">
                <p class="card-user">Responsible: ${cardObject.responsible}</p>
            </div>

            <!--блок содержащий кнопки управления карточкой-->
            <div class="todo__card-btns-control">
                <!--выбор другого контейнера-->
                <select id="selection${cardObject.id}" class="btn-select form-select form-select-sm" aria-label=".form-select-sm example">
                    <option ${cardObject.containerSelection == 'Todo' ? 'selected' : ''} value="Todo">Todo</option>
                    <option ${cardObject.containerSelection == 'In progress' ? 'selected' : ''} value="In progress">In progress</option>
                    <option ${cardObject.containerSelection == 'Done' ? 'selected' : ''} value="Done">Done</option>
                </select>

                <!--кнопка, которая открывает модальное окно для редактирования карточки-->
                <button type="button" class="btn-edit btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalEdit${cardObject.id}">Edit</button>
                <div class="modal fade" id="exampleModalEdit${cardObject.id}">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5">Edit Todo</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="edit-form${cardObject.id}">
                                    <div class="mb-3">
                                        <label class="col-form-label">Title:</label>
                                        <input id="title-edit${cardObject.id}" type="text" class="form-control" value="${cardObject.title}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="col-form-label">Description:</label>
                                        <textarea id="description-edit${cardObject.id}" class="form-control">${cardObject.description}</textarea>
                                    </div>
                                    <label class="col-form-label">Responsible:</label>
                                    <select id="responsible-edit${cardObject.id}" class="form-select form-select-sm" aria-label=".form-select-sm example">
                                        <option ${cardObject.responsible == 'Артем' ? 'selected' : ''} value="Артем">Артем</option>
                                        <option ${cardObject.responsible == 'Олег' ? 'selected' : ''} value="Олег">Олег</option>
                                        <option ${cardObject.responsible == 'Кирилл' ? 'selected' : ''} value="Кирилл">Кирилл</option>
                                    </select>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary btn-edit-form">Edit Todo</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <!--кнопка, которая удаляет конкретную карточку-->
                <div class="btn-remove">
                    <button class="remove">Remove</button>
                </div>
            </div>
        </div>
    `
}

// -------------КОНСТРУКТОР КАРТОЧЕК--------------------------
function Todo(title, description, responsible) {
    this.id = Date.now()
    this.date = new Date().toISOString()
    this.title = title
    this.description = description
    this.responsible = responsible
    this.containerSelection = null
}

// -------------ФУНКЦИИ ПОМОЩНИКИ--------------------------
function render(todos, container) {
    let cardTemplates = ''

    todos.forEach((item) => {
        const cardTemplate = buildCardTodo(item)
        cardTemplates += cardTemplate
    })

    container.innerHTML = cardTemplates
}

function editForm(arrayCards, container) {
    const { target } = event

    arrayCards.forEach((item) => {
        const titleEditElement = document.querySelector(`#title-edit${item.id}`)
        const descriptionEditElement = document.querySelector(`#description-edit${item.id}`)
        const responsibleEditElement = document.querySelector(`#responsible-edit${item.id}`)
        const modalElement = document.querySelector(`#exampleModalEdit${item.id}`)
        const modalInstance = Modal.getOrCreateInstance(modalElement)

        if (target.closest(`#edit-form${item.id}`)) {
            item.title = titleEditElement.value
            item.description = descriptionEditElement.value
            item.responsible = responsibleEditElement.value

            render(arrayCards, container)
            modalInstance.hide()
        }
    })
}

function deleteCard(arrayCards, containerCards, containerСounter) {
    const { target } = event

    if (target.closest('.remove')) {
        arrayCards.forEach((item, index) => {
            if (item.id == target.closest('.todo__card').id) {
                arrayCards.splice(index, 1)
            }

            render(arrayCards, containerCards)
            countCards(arrayCards, containerСounter)
        })
    }
}

function getData(key) {
    return JSON.parse(localStorage.getItem(String(key))) || []
}

function setData(key, item) {
    return localStorage.setItem(key, JSON.stringify(item))
}

function handleBeforeUnload() {
    setData(key = 'todos', trelloTodos)
    setData(key = 'inProgress', trelloInProgress)
    setData(key = 'done', trelloDone)
}

// -------------ПРОЧИЕ ФУНКЦИИ--------------------------
function countCards(arrayCards, container) {
    let numberOfCards = arrayCards.length
    container.innerHTML = numberOfCards
}

// -------------ЧАСЫ--------------------------
window.onload = function () {
    window.setInterval(function () {
        let time = new Date();
        watchElement.innerHTML = time.toLocaleTimeString()
    }, 1000);
}

