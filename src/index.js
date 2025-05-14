var Importance;
(function (Importance) {
    Importance["Important"] = "Important";
    Importance["Flexible"] = "Flexible";
    Importance["Simple"] = "Simple";
})(Importance || (Importance = {}));
var tasks = [];
var form = document.getElementById('Task');
var table = document.getElementById('taskshow');
function addnewtask(taskname, importance) {
    if (importance === void 0) { importance = Importance.Simple; }
    var task = {
        id: tasks.length + 1,
        taskname: taskname,
        importance: importance
    };
    tasks.push(task);
    localStorage.setItem("task array", JSON.stringify(tasks));
    return task;
}
function removetask(taskId) {
    var initialLength = tasks.length;
    tasks = tasks.filter(function (task) { return task.id !== taskId; });
    localStorage.setItem("task array", JSON.stringify(tasks));
    return tasks.length !== initialLength;
}
function render() {
    var tbody = table.querySelector("tbody");
    var locale = localStorage.getItem('task array');
    var stored = JSON.parse(locale || "[]");
    tasks = stored;
    if (tbody) {
        tbody.innerHTML = "";
        tasks.forEach(function (task) {
            var tr = document.createElement('tr');
            tr.innerHTML = "\n\t\t\t<td>".concat(task.taskname, "</td>\n\t\t\t<td>").concat(task.importance, "</td>\n\t\t\t<td><button class=\"delete-btn\" onclick=\"deletetask(").concat(task.id, ")\">Delete</button></td>\n\t\t\t");
            tbody.appendChild(tr);
        });
    }
}
function deletetask(taskId) {
    if (removetask(taskId)) {
        render();
    }
}
form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (e) {
    e.preventDefault();
    var taskname = document.getElementById('taskname').value;
    var importance = document.getElementById('importance').value;
    addnewtask(taskname, importance);
    render();
    form.reset();
});
render();
