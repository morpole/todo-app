document.addEventListener('DOMContentLoaded', async () => {
    // Load user profile and tasks
    await loadUserProfile();
    await loadTasks();
});

// Handle form submission for new tasks
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;

    await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
    });
    document.getElementById('description').value = '';

    loadTasks(); // Reload tasks after adding a new one
});

// Load and display tasks
async function loadTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.reverse().forEach(task => {
        const div = document.createElement('div');
        div.className = 'task-item flex items-center justify-between p-4 rounded-lg bg-gray-700 shadow-md';

        if (task.completed) {
            div.classList.add('completed');
        }

        div.innerHTML = `
            <div class="flex items-center">
                <button class="completion-btn bg-gray-800 text-white rounded-full p-2 mr-3">
                    <i class="material-icons-outlined">${task.completed ? 'check_circle' : 'radio_button_unchecked'}</i>
                </button>
                <span class="text-gray-100">${task.description}</span>
            </div>
            <div class="flex items-center space-x-2">
                <a href="#" class="text-gray-400 hover:text-gray-100 edit-task" data-id="${task._id}">
                    <i class="material-icons-outlined text-base">edit</i>
                </a>
                <a href="#" class="text-gray-400 hover:text-gray-100 delete-task" data-id="${task._id}">
                    <i class="material-icons-round text-base">delete_outline</i>
                </a>
            </div>
        `;

        taskList.appendChild(div);
    });

    attachEventListeners(); // Attach event listeners to new elements
}

// Attach event listeners for task buttons
function attachEventListeners() {
    // Add completion functionality
    document.querySelectorAll('.completion-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const taskElement = this.closest('.task-item');
            const taskId = taskElement.querySelector('.delete-task').getAttribute('data-id');
            const isCompleted = this.querySelector('i').innerText === 'check_circle';

            await fetch(`/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !isCompleted })
            });
            loadTasks(); // Reload tasks after status update
        });
    });

    // Add delete functionality
    document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', async function() {
            const taskId = this.getAttribute('data-id');
            await fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            });
            loadTasks(); // Reload tasks after deletion
        });
    });

    // Add edit functionality
    document.querySelectorAll('.edit-task').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            const taskElement = this.closest('.task-item');
            const currentDescription = taskElement.querySelector('span').innerText;

            // Remove any existing edit form
            const existingForm = document.getElementById('editForm');
            if (existingForm) {
                existingForm.remove();
            }

            // Create a new edit form
            const editForm = document.createElement('form');
            editForm.id = 'editForm';
            editForm.className = 'edit-task-form p-4 bg-gray-700 rounded-lg mt-2';
            editForm.innerHTML = `
                <input type="text" id="editDescription" class="w-full p-2 rounded bg-gray-800 text-gray-100" placeholder="Edit task description" required value="${currentDescription}">
                <button type="submit" class="mt-2 bg-blue-500 text-white p-2 rounded">Save Changes</button>
                <button type="button" id="cancelEdit" class="mt-2 bg-red-500 text-white p-2 rounded">Cancel</button>
            `;

            // Insert the form right after the task element
            taskElement.insertAdjacentElement('afterend', editForm);

            // Handle the form submission for editing
            editForm.onsubmit = async function(e) {
                e.preventDefault();

                const newDescription = document.getElementById('editDescription').value.trim();

                if (newDescription) {
                    await fetch(`/tasks/${taskId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ description: newDescription })
                    });

                    editForm.remove(); // Remove the form after saving
                    loadTasks(); // Reload tasks after the update
                }
            };

            // Handle cancel button
            document.getElementById('cancelEdit').addEventListener('click', function() {
                editForm.remove(); // Remove the form when cancel is clicked
            });
        });
    });
}

// Load user profile information
async function loadUserProfile() {
    const userProfile = document.getElementById('userProfile');
    const response = await fetch('/api/userinfo'); // Endpoint to get user info
    const user = await response.json();

    if (user) {
        const initials = user.name.split(' ').map(name => name[0]).join('');
        userProfile.innerHTML = `
            <img src="${user.picture || 'default-profile-pic.jpg'}" alt="${initials}" class="w-8 h-8 rounded-full">
            <span class="text-gray-100">${user.name || initials}</span>
            <button id="logoutButton" class="ml-4 text-gray-100 bg-red-500 p-2 rounded">Logout</button>
        `;
        
        document.getElementById('logoutButton').addEventListener('click', () => {
            window.location.href = '/logout'; // Redirect to logout endpoint
        });
    }
}
