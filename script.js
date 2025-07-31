const taskList = loadTasks();  // Load saved tasks from localStorage
const listElement = document.getElementById("taskList");
const statusTask = document.getElementById("status");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    statusTask.innerText = `Heard: "${transcript}"`;

    if (transcript.startsWith("add new task")) {
        const taskText = transcript.replace("add new task", "").trim();
        if (taskText) {
            addTask(taskText);
        }
    } else if (transcript.startsWith("delete task")) {
        const num = parseInt(transcript.split(" ")[2]) - 1;
        if (!isNaN(num)) {
            deleteTask(num);
        }
    } else if (transcript.startsWith("mark task")) {
        const num = parseInt(transcript.split(" ")[2]) - 1;
        if (!isNaN(num)) {
            markTaskDone(num);
        }
    }
};

function addTask(task) {
    taskList.push({ text: task, done: false });
    saveTasks();      // Save to localStorage
    renderTask();
}

function deleteTask(num) {
    if (taskList[num]) {
        taskList.splice(num, 1);
        saveTasks();  // Save to localStorage
        renderTask();
    }
}

function markTaskDone(num) {
    if (taskList[num]) {
        taskList[num].done = true;
        saveTasks();  // Save to localStorage
        renderTask();
    }
}

function renderTask() {
    listElement.innerHTML = "";
    taskList.forEach((task, idx) => {
        const li = document.createElement("li");
        li.innerText = `${idx + 1}. ${task.text} ${task.done ? "✅" : ""}`;
        listElement.appendChild(li);
    });
}

function startVoice() {
    statusTask.innerText = "Listening....";
    recognition.start();
}

document.getElementById("startBtn").addEventListener("click", startVoice);

// 🧠 Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("taskList", JSON.stringify(taskList));
}

// 🔁 Load tasks from localStorage
function loadTasks() {
    const data = localStorage.getItem("taskList");
    return data ? JSON.parse(data) : [];
}

// 🔄 Render on first load
renderTask();
