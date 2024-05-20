var simplemde;
document.getElementById('add-log-button').addEventListener('click', function() {
    openModal();
    if (!simplemde) {
        simplemde = new SimpleMDE({ element: document.getElementById("logContent") });
    }
});

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
