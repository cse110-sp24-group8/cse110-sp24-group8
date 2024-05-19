// scripts/code-log.js

function openModal() {
    document.getElementById('addLogModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addLogModal').style.display = 'none';
}

function addLog() {
    // Add your logic to add the log here
    closeModal();
}

document.getElementById('add-log-button').addEventListener('click', openModal);