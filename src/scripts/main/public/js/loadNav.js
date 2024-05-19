document.addEventListener('DOMContentLoaded', function() {
    const navElement = document.querySelector('.sidebar');
    console.log('Dom Content Loaded');
    fetch('sidebar.html')
        .then(res => {
            if (res.ok) {
                return res.text();
            }
        })
        .then(htmlNav => {
            navElement.innerHTML = htmlNav;
        })
});