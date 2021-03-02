const taskList = document.querySelector('#task-list');
const form = document.querySelector('#add-task-form');

/* create element and render tasks */
function renderTaskList(doc) {
    let li = document.createElement('li');
    let task = document.createElement('span');
    let cross = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    task.textContent = doc.data().task;
    cross.textContent = 'x';
    cross.className = 'cross';

    li.appendChild(task);
    li.appendChild(cross);
    taskList.appendChild(li);

    /* deleting data */
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('todolist').doc(id).delete();
    })
}

/* saving data */
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('todolist').add({
        task: form.task.value,
    });
    form.task.value = '';
    console.log('Task added!');
})

/* real-time listener */
db.collection('todolist').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderTaskList(change.doc);
        } else if (change.type =='removed') {
            let li = taskList.querySelector('[data-id=' + change.doc.id + ']');
            taskList.removeChild(li);
        }
    })
})