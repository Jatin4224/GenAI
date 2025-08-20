document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    // Load todos from local storage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = ''; // Clear current list
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.innerHTML = `
                <span>${todo.text}</span>
                <div class="todo-actions">
                    <button class="complete" data-index="${index}">${todo.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            todos.push({ text: todoText, completed: false });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }

    function toggleComplete(index) {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }

    addTodoBtn.addEventListener('click', addTodo);

    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    todoList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('complete')) {
            const index = target.dataset.index;
            toggleComplete(index);
        } else if (target.classList.contains('delete')) {
            const index = target.dataset.index;
            deleteTodo(index);
        }
    });

    // Initial render
    renderTodos();
});
