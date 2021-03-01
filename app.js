const taskList = document.querySelector('#task-list');
const form = document.querySelector('#add-task-form');

function renderTaskList(doc) {
    let li = document.createElement('li');
    let task = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    task.textContent = doc.data().task;

    li.appendChild(task);
    taskList.appendChild(li);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('todolist').add({
        task: form.task.value,
        author: form.author.value,
        category: form.category.value
    });
    form.task.value = '';
    form.author.value = '';
    form.category.value = '';
    console.log('Task added!');
})

db.collection('todolist').orderBy('task').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderTaskList(change.doc);
        } else if (change.type == 'removed') {
            let li = taskList.querySelector('[data-id' + change.doc.id + ']');
            taskList.removeChild(li);
        }
    })
    console.log('Todo list Data retrieved');
})