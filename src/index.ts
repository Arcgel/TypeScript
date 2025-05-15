enum Importance{
	Important = "Important",
	Flexible = "Flexible",
	Simple = "Simple"
}

type Task = {
	id: number;
	taskname: string;
	importance: Importance;
}

let tasks: Task[] = [];
const form = document.getElementById('Task') as HTMLFormElement;
const table = document.getElementById('taskshow') as HTMLTableElement;

function addnewtask(taskname: string, importance: Importance = Importance.Simple): Task {
	const task: Task = {
		id: tasks.length + 1,
		taskname,
		importance
	};
	tasks.push(task);
	localStorage.setItem("task array", JSON.stringify(tasks));
	return task;
}

function removetask(taskId: number): boolean {
	const initialLength = tasks.length;
	tasks = tasks.filter(task => task.id !== taskId);
	localStorage.setItem("task array", JSON.stringify(tasks));
	return tasks.length !== initialLength;
}

function render(): void {
	const tbody = table.querySelector("tbody");
	const locale = localStorage.getItem('task array');
	const stored: Task[] = JSON.parse(locale || "[]");
	tasks = stored;
	if (tbody) {
		tbody.innerHTML = "";
		tasks.forEach(task => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
			<td id="taskname-${task.id}">${task.taskname}</td>
			<td id="importamce-${task.id}">${task.importance}</td>
			<td id="action-${task.id}">
				<button class="edit-btn" data-task-id="${task.id}">Edit</button>
				<button class="delete-btn" data-task-id="${task.id}">Delete</button>
			</td>
			`;
			tbody.appendChild(tr);
		});
	}
}

function deletetask(taskId: number): void {
	if(removetask(taskId)){
		render();
	}
}

form?.addEventListener('submit', (e: Event) => {
	e.preventDefault();
	const taskname = (document.getElementById('taskname') as HTMLInputElement).value;
	const importance = (document.getElementById('importance') as HTMLSelectElement).value as Importance;
	addnewtask(taskname, importance);
	render();
	form.reset();
});

function edittask(taskId: number): void {
    const task = tasks.find(task => task.id === taskId);
	if (!task) return;
	const tasknameCell = document.getElementById(`taskname-${task.id}`);
	const importanceCell = document.getElementById(`importamce-${task.id}`);
	const actionCell = document.getElementById(`action-${task.id}`);

	if (tasknameCell && importanceCell && actionCell) {
		tasknameCell.innerHTML = `<input type="text" id="edit-taskname-${task.id}" value="${task.taskname}"> `;
		importanceCell.innerHTML = `
		<select id="edit-importance-${task.id}">
			<option value="${Importance.Important}">${Importance.Important}</option>
			<option value="${Importance.Flexible}">${Importance.Flexible}</option>
			<option value="${Importance.Simple}">${Importance.Simple}</option>
		</select>`;
		actionCell.innerHTML = `
		<button class="save-btn" data-task-id="${task.id}">Save</button>
		<button class="cancel-btn" data-task-id="${task.id}">Cancel</button> `;
	}
}

function saveTask(taskId: number): void {
	const tasknameInput = document.getElementById(`edit-taskname-${taskId}`) as HTMLInputElement;
	const importanceSelect = document.getElementById(`edit-importance-${taskId}`) as HTMLSelectElement;
	const taskIndex = tasks.findIndex(task => task.id === taskId);
	if (taskIndex !== -1 && tasknameInput && importanceSelect) {
		tasks[taskIndex].taskname = tasknameInput.value;
		tasks[taskIndex].importance = importanceSelect.value as Importance;
		localStorage.setItem("task array", JSON.stringify(tasks));
		render();
	}
}

function cancelEdit(taskId: number): void {
	render(); // Re-renders the table, effectively canceling the edit
}

// Add event listeners to the table for edit and delete buttons
table.addEventListener('click', (event) => {
	const target = event.target as HTMLElement;
	if (target.classList.contains('delete-btn')) {
		const taskId = parseInt(target.dataset.taskId || '');
		if (!isNaN(taskId)) {
			deletetask(taskId);
		}
	} else if (target.classList.contains('edit-btn')) {
		const taskId = parseInt(target.dataset.taskId || '');
		if (!isNaN(taskId)) {
			edittask(taskId);
		}
	} else if (target.classList.contains('save-btn')) {
		const taskId = parseInt(target.dataset.taskId || '');
		if (!isNaN(taskId)) {
			saveTask(taskId);
		}
	} else if (target.classList.contains('cancel-btn')) {
		const taskId = parseInt(target.dataset.taskId || '');
		if (!isNaN(taskId)) {
			cancelEdit(taskId);
		}
	}
});

render();