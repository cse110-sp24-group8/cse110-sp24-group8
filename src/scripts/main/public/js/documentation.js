document.addEventListener('DOMContentLoaded', function () {
    var simplemde = new SimpleMDE({ element: document.getElementById("fileContent") });
    const storagePrefix = 'file_';
    let currentFile = '';

    /*
     * Loads the files from localStorage into the file selection dropdown.
     */
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

    /*
     * Initializes by loading the first available file or creating the default 'Untitled' file.
     */
    function initialize() {
        const fileSelect = document.getElementById('fileSelect');
        const filesExist = Object.keys(localStorage).some(key => key.startsWith(storagePrefix));
        if (filesExist) {
            const firstFileKey = Object.keys(localStorage).find(key => key.startsWith(storagePrefix));
            currentFile = firstFileKey.substring(storagePrefix.length);
            simplemde.value(localStorage.getItem(firstFileKey));
            fileSelect.value = currentFile;
        } else {
            localStorage.setItem(storagePrefix + 'Untitled', '');
            currentFile = 'Untitled';
            simplemde.value(localStorage.getItem(storagePrefix + 'Untitled'));
            const option = document.createElement('option');
            option.value = 'Untitled';
            option.textContent = 'Untitled';
            fileSelect.appendChild(option);
            fileSelect.value = 'Untitled';
        }
    }

    /*
     * Creates a new file with the user-provided name.
     * Prompts the user for the new file name.
     * @returns {void}
     */
    window.createNewFile = function () {
        const fileName = prompt('Enter the name for the new file:');
        if (fileName && !localStorage.getItem(storagePrefix + fileName)) {
            localStorage.setItem(storagePrefix + fileName, '');
            const option = document.createElement('option');
            option.value = fileName;
            option.textContent = fileName;
            document.getElementById('fileSelect').appendChild(option);
            document.getElementById('fileSelect').value = fileName;
            currentFile = fileName;
            simplemde.value('');
        } else if (localStorage.getItem(storagePrefix + fileName)) {
            alert('File name already exists.');
        }
    }

    /*
     * Renames the current file to a new user-provided name.
     * Prompts the user for the new file name.
     * @returns {void}
     */
    window.renameFile = function () {
        const newFileName = prompt('Enter the new name for the file:');
        if (newFileName && !localStorage.getItem(storagePrefix + newFileName)) {
            const oldFileName = currentFile;
            const fileContent = localStorage.getItem(storagePrefix + oldFileName);
            localStorage.setItem(storagePrefix + newFileName, fileContent);
            localStorage.removeItem(storagePrefix + oldFileName);
            currentFile = newFileName;
            loadFiles();
            document.getElementById('fileSelect').value = newFileName;
        } else if (localStorage.getItem(storagePrefix + newFileName)) {
            alert('File name already exists.');
        }
    }

    /*
     * Switches to the selected file and loads its content into the editor.
     * @returns {void}
     */
    window.switchFile = function () {
        const fileSelect = document.getElementById('fileSelect');
        const selectedFile = fileSelect.value;
        if (currentFile) {
            localStorage.setItem(storagePrefix + currentFile, simplemde.value());
        }
        currentFile = selectedFile;
        simplemde.value(localStorage.getItem(storagePrefix + currentFile));
    }

    /*
     * Deletes the current file after confirming with the user.
     * @returns {void}
     */
    window.deleteFile = function () {
        if (currentFile) {
            const confirmed = confirm(`Are you sure you want to delete the file "${currentFile}"?`);
            if (confirmed) {
                localStorage.removeItem(storagePrefix + currentFile);
                currentFile = '';
                loadFiles();
                const firstFileKey = Object.keys(localStorage).find(key => key.startsWith(storagePrefix));
                if (firstFileKey) {
                    currentFile = firstFileKey.substring(storagePrefix.length);
                    simplemde.value(localStorage.getItem(firstFileKey));
                    document.getElementById('fileSelect').value = currentFile;
                } else {
                    simplemde.value('');
                }
            }
        } else {
            alert('No file selected to delete.');
        }
    }

    /*
     * Saves the current file content to localStorage whenever the content changes.
     */
    simplemde.codemirror.on('change', function() {
        if (currentFile) {
            localStorage.setItem(storagePrefix + currentFile, simplemde.value());
        }
    });

    loadFiles();
    initialize();
});
