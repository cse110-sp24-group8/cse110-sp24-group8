
function importSidebar {
const navBar = document.querySelector('.sidebar');
    {
        fetch(`./src/scripts/main/public/sidebar.html`)
        .then (res => {
            if (res.ok)  {
                return res.text();
            }
        })

        .then(sidebarSnippet => {
            navBar.innerHTML = sidebarSnippet;
        });
    }
};