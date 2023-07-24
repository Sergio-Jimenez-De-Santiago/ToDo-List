const todoList = document.querySelector('.todos');
const searchBar = document.querySelector('.search input');
const addTodos = document.querySelector('.add');

let todosStorage = [];
//array of objects that is empty and then will be populated with the local storage info
let stored;
//array of objects to help comunication between "normal" code and local storage
if (localStorage.length){
    //if the local storage is not empty, get the local storage data and put it into stored to then add to html
    stored = JSON.parse(localStorage.getItem('todos'));
    //get the array of objects in json format from local storage and parse it into an array (save in stored array)
    stored.forEach(task => addTodo(task.data));
    //go through the array and call the addTodo func to update the html 
}

function addTodo(text){
    //func to add todo into html once submitted through form
    if(text){
        let newLi = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${text}</span>
            <i class="far fa-trash-alt delete"></i>
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
    if(e.target.tagName === 'I'){
        //if the thing cliked was the trash icon, go ahead
        let todoTask = e.target.previousElementSibling.textContent;
        //load into todoTask the text of the todo
        e.target.parentElement.remove();
        //remove li 
        stored = stored.filter(task => {
            return task.data !== todoTask
        })
        //delete from stored array the elem that has been deleted
        localStorage.setItem('todos', JSON.stringify(stored));
        //overwrite local storage with updated array
    }
})

addTodos.addEventListener('submit', e => {
    e.preventDefault();
    addTodo(addTodos.add.value.trim());
    addTodos.reset();
})

searchBar.addEventListener('keyup', e => {
    //call search func every time a key is cliked 
    searchFunc(searchBar.value.trim().toLowerCase());
})