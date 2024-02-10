(function() {
    let listArray = [];
    let listName = '';


    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        button.disabled = true;

        input.addEventListener('input', function () {
            if (input.value != '') {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);


        return {
            form,
            input,
            button,
        };
    }

    //создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');
        //кнопки помещаем в элемент
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        item.id = obj.id

        if (obj.done) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        doneButton.addEventListener('click', function() {
            for (const item of listArray) {
                if (item.id == obj.id) {
                    item.done = !item.done;
                }
            }
            item.classList.toggle('list-group-item-success');
            saveList (listArray, listName);
        });
        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                for (let i = 0; i < listArray.length; i++) {
                    if (listArray[i].id == obj.id) {
                        listArray.splice(i,1);
                    }
                }
                
                item.remove();
                saveList (listArray, listName);
            }
        });

        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function getNewID (arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) {
                max = item.id;
            }
        }
        return max + 1;
    }

    function saveList (arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr))
    }


    function createTodoApp(container, title = 'Список дел', keyName, def = []) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        
        listName = keyName;
        listArray = def;
        
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        
        let localData = localStorage.getItem(listName);

        if (localData !== '' && localData !== null) {
            listArray = JSON.parse(localData);
        }

        
        for (const oneObj of listArray) {
            let todoItem = createTodoItem(oneObj);
            todoList.append(todoItem.item);
        }
        


        //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            //чтобы страница не перезагружалась после отправки формы
            e.preventDefault();

            //игнорируем создание элемента, если пользователь ничего не ввел
            
            let obj = {
                id: getNewID(listArray),
                name: todoItemForm.input.value,
                done: false
            }

            
            let todoItem = createTodoItem(obj);
            listArray.push(obj);

            saveList (listArray, listName);
            //создаем и добавляем в список новое дело
            todoList.append(todoItem.item);


            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });
    }


    
    saveList (listArray)
    window.createTodoApp = createTodoApp;

})();

