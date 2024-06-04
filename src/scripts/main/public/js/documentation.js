document.addEventListener('DOMContentLoaded', function () {
    var simplemde = new SimpleMDE({ element: document.getElementById("fileContent") });
    const storagePrefix = 'file_';
    let currentFile = '';

    function loadFiles() {
        const fileSelect = document.getElementById('fileSelect');
        fileSelect.innerHTML = '<option value="" disabled selected>--Select a file--</option>';
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(storagePrefix)) {
                const fileName = key.substring(storagePrefix.length);
                const option = document.createElement('option');
                option.value = fileName;
                option.textContent = fileName;
                fileSelect.appendChild(option);
            }
        }
    }

    function initializeUntitled() {
        const filesExist = Object.keys(localStorage).some(key => key.startsWith(storagePrefix));
        if (!filesExist) {
            localStorage.setItem(storagePrefix + 'Untitled', '');
            currentFile = 'Untitled';
            simplemde.value(localStorage.getItem(storagePrefix + 'Untitled'));
            const fileSelect = document.getElementById('fileSelect');
            const option = document.createElement('option');
            option.value = 'Untitled';
            option.textContent = 'Untitled';
            fileSelect.appendChild(option);
            fileSelect.value = 'Untitled';
        }
    }

    window.createNewFile = function () {
        const fileName = prompt('Enter the name for the new file:');
        if (fileName && !localStorage.getItem(storagePrefix + fileName)) {
            localStorage.setItem(storagePrefix + fileName, '');
            const fileSelect = document.getElementById('fileSelect');
            const option = document.createElement('option');
            option.value = fileName;
            option.textContent = fileName;
            fileSelect.appendChild(option);
            fileSelect.value = fileName;
            currentFile = fileName;
            simplemde.value('');
        } else if (localStorage.getItem(storagePrefix + fileName)) {
            alert('File name already exists.');
        }
    }

    window.renameFile = function () {
        const newFileName = prompt('Enter the new name for the file:');
        if (newFileName && !localStorage.getItem(storagePrefix + newFileName)) {
            const oldFileName = currentFile;
            const fileContent = localStorage.getItem(storagePrefix + oldFileName);
            localStorage.setItem(storagePrefix + newFileName, fileContent);
            localStorage.removeItem(storagePrefix + oldFileName);
            currentFile = newFileName;
            loadFiles();
            const fileSelect = document.getElementById('fileSelect');
            fileSelect.value = newFileName;
        } else if (localStorage.getItem(storagePrefix + newFileName)) {
            alert('File name already exists.');
        }
    }

    window.switchFile = function () {
        const fileSelect = document.getElementById('fileSelect');
        const selectedFile = fileSelect.value;
        if (currentFile) {
            localStorage.setItem(storagePrefix + currentFile, simplemde.value());
        }
        currentFile = selectedFile;
        simplemde.value(localStorage.getItem(storagePrefix + currentFile));
    }

    window.deleteFile = function () {
        if (currentFile) {
            const confirmed = confirm(`Are you sure you want to delete the file "${currentFile}"?`);
            if (confirmed) {
                localStorage.removeItem(storagePrefix + currentFile);
                currentFile = '';
                loadFiles();
                simplemde.value('');
            }
        } else {
            alert('No file selected to delete.');
        }
    }

    simplemde.codemirror.on('change', function() {
        if (currentFile) {
            localStorage.setItem(storagePrefix + currentFile, simplemde.value());
        }
    });

    loadFiles();
    initializeUntitled();
});