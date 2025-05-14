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
			<td>${task.taskname}</td>
			<td>${task.importance}</td>
			<td><button class="delete-btn" onclick="deletetask(${task.id})">Delete</button></td>
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

render();










