const todoList = document.querySelector('.todos');
const searchBar = document.querySelector('.search input');
const addTodos = document.querySelector('.add');

let todosStorage = [];
//array of objects that is empty and then will be populated with the local storage info
let stored;
//array of objects to help comunication between "normal" code and local storage

if (localStorage.getItem("todos")) {
    //if the local storage has a todos thing there go on
    stored = JSON.parse(localStorage.getItem('todos'));
    //get the array of objects in json format from local storage and parse it into an array (save in stored array)
    if (Array.isArray(stored)) {
        //check if the array is not empty
        stored.forEach(task => addTodo(task.data));
        //go through the array and call the addTodo func to update the html
    }
}

function updateStoredArray() {
    stored = Array.from(todoList.children).map(todoItem => {
        const todoText = todoItem.querySelector('span').textContent;
        return { data: todoText };
    });
    localStorage.setItem('todos', JSON.stringify(stored));
}

function addTodo(text){
    //func to add todo into html once submitted through form
    if(text){
        let newLi = `
        <li class="list-group-item d-flex justify-content-between align-items-center" draggable="true">
            <span>${text}</span>
            <div class="icons">
                <i class="fas fa-pencil-alt edit"></i>
                <i class="far fa-trash-alt delete"></i>
            </div>
        </li>
        `;
        todoList.innerHTML += newLi;

        todosStorage.push({data:text});
        //push the new todo to the array todosStorage
        localStorage.setItem('todos', JSON.stringify(todosStorage));
        //overwrite local storage with the new todos (having added the new one)
    }

}

function searchFunc(text){
    const todosLi = Array.from(document.querySelectorAll('LI'));

    const arrayToDissapear = todosLi.filter(elem => {
        return !elem.textContent.toLowerCase().includes(text);
    })
    //returns all the elements in the array that do not include the text

    arrayToDissapear.forEach(elem => {
        elem.classList.add('displayNone');
    })
    //display none all the elements that dont include the text

    const arrayToReappear = todosLi.filter(elem => {
        return elem.textContent.toLowerCase().includes(text);
    })
    //returns all the elements in the array that do include the text
    arrayToReappear.forEach(elem => {
        elem.classList.remove('displayNone');
    })
    //show all the elements that do include the text
}

todoList.addEventListener('click', e => {
    if(e.target.tagName === 'I' && e.target.classList.contains('delete')){
        //if the thing cliked was the trash icon, go ahead
        let todoTask = e.target.parentElement.previousElementSibling.textContent;
        //load into todoTask the text of the todo
        e.target.parentElement.parentElement.remove();
        //remove li 
        stored = stored.filter(task => {
            return task.data !== todoTask
        })
        //delete from stored array the elem that has been deleted
        localStorage.setItem('todos', JSON.stringify(stored));
        //overwrite local storage with updated array
    } else if (e.target.tagName === 'I' && e.target.classList.contains('edit')) {
        const todoTaskElement = e.target.parentElement.previousElementSibling;
        const originalTodoText = todoTaskElement.textContent;

        // Create an input field with the original text and replace the todo text
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = originalTodoText;
        todoTaskElement.textContent = '';
        todoTaskElement.appendChild(editInput);

        editInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                const updatedTodoText = editInput.value.trim();
                if (updatedTodoText !== '') {
                    todoTaskElement.textContent = updatedTodoText;

                    // Update the stored array with the edited task
                    stored = stored.map(task => {
                        if (task.data === originalTodoText) {
                            task.data = updatedTodoText;
                        }
                        return task;
                    });
                    localStorage.setItem('todos', JSON.stringify(stored));
                } else {
                    // If the edited text is empty, revert to the original text
                    todoTaskElement.textContent = originalTodoText;
                }
            }
        });
        // makes the input field active so that the user can immediately start typing without having to click on it manually
        editInput.focus();
    } else if (e.target.tagName === 'I' && e.target.classList.contains('priority')) {
        const todoTaskElement = e.target.parentElement.previousElementSibling;
        const originalTodoText = todoTaskElement.textContent;

        // Create an input field with the original text and replace the todo text
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = originalTodoText;
        todoTaskElement.textContent = '';
        todoTaskElement.appendChild(editInput);

        editInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                const updatedTodoText = editInput.value.trim();
                if (updatedTodoText !== '') {
                    todoTaskElement.textContent = updatedTodoText;

                    // Update the stored array with the edited task
                    stored = stored.map(task => {
                        if (task.data === originalTodoText) {
                            task.data = updatedTodoText;
                        }
                        return task;
                    });
                    localStorage.setItem('todos', JSON.stringify(stored));
                } else {
                    // If the edited text is empty, revert to the original text
                    todoTaskElement.textContent = originalTodoText;
                }
            }
        });
        // makes the input field active so that the user can immediately start typing without having to click on it manually
        editInput.focus();
    } 
})

addTodos.addEventListener('submit', e => {
    e.preventDefault();
    addTodo(addTodos.add.value.trim());
    addTodos.reset();

    // Update the stored array with the new task
    updateStoredArray();
});

searchBar.addEventListener('keyup', e => {
    //call search func every time a key is cliked 
    searchFunc(searchBar.value.trim().toLowerCase());
})

//bellow here is code for dragging and dropping items

// Variables to keep track of the dragged item and target item
let draggedItem = null;
let targetItem = null;

// Event listener for when a todo item starts being dragged
todoList.addEventListener('dragstart', e => {
    if (e.target.tagName === 'LI') {
        draggedItem = e.target;
    }
});

// Event listeners for when a dragged item enters and leaves a droppable area
todoList.addEventListener('dragenter', e => {
    if (e.target.tagName === 'LI') {
        targetItem = e.target;
        targetItem.classList.add('drag-over');
    }
});

todoList.addEventListener('dragleave', e => {
    if (e.target.tagName === 'LI') {
        e.target.classList.remove('drag-over');
    }
});

// Event listener for when a dragged item is over a droppable area
todoList.addEventListener('dragover', e => {
    e.preventDefault();
});

// Event listener for when a dragged item is dropped
todoList.addEventListener('drop', e => {
    e.preventDefault();

    if (draggedItem && targetItem) {
        // Swap the positions of draggedItem and targetItem in the DOM
        todoList.insertBefore(draggedItem, targetItem);

        // Update the stored array to reflect the new order
        updateStoredArray();

        // Clean up and reset the variables
        targetItem.classList.remove('drag-over');
        draggedItem = null;
        targetItem = null;
    }
});