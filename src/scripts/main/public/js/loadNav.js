document.addEventListener('DOMContentLoaded', function() {
    const navElement = document.querySelector('.sidebar');
    console.log('DOM Content Loaded');

    fetch('sidebar.html')
        .then(res => {
            if (res.ok) {
                return res.text();
            }
        })
        .then(htmlNav => {
            navElement.innerHTML = htmlNav;

            // Remove the toggle button if on mobile device
            if (window.innerWidth <= 978) {
                const toggleButton = navElement.querySelector('.toggle');
                if (toggleButton) {
                    toggleButton.remove();
                }
            }
        });

    function handleResize() {
        if (window.innerWidth <= 978) {
            navElement.classList.add('bottom-fixed');
            const toggleButton = navElement.querySelector('.toggle');
            if (toggleButton) {
                toggleButton.remove();
            }
        } else {
            navElement.classList.remove('bottom-fixed');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set the correct position on page load
});
