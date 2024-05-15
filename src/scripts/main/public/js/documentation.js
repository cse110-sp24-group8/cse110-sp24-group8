function convertMarkdown() {
    var inputText = document.getElementById('markdown-input').value;
    var htmlContent = marked(inputText);
    document.getElementById('html-output').innerHTML = htmlContent;
}