document.addEventListener('DOMContentLoaded', function() {
    const navElement = document.querySelector('.sidebar');
    
    /**
     * Fetches and loads the sidebar HTML, applies the current theme, and handles the toggle button visibility based on the viewport width.
     */
    fetch('sidebar.html')
        .then(res => {
            if (res.ok) {
                return res.text();
            }
        })
        .then(htmlNav => {
            navElement.innerHTML = htmlNav;
            
            // Check and apply theme
            const currentTheme = localStorage.getItem("theme");
            if (currentTheme) {
                updateIcons(currentTheme);
            }

            // Remove the toggle button if on a mobile device
            if (window.innerWidth <= 978) {
                const toggleButton = navElement.querySelector('.toggle');
                if (toggleButton) {
                    toggleButton.remove();
                }
            }
        });

    /**
     * Handles the resize event to adjust the sidebar position and toggle button visibility based on the viewport width.
     */
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

/**
 * Updates the icons in the sidebar based on the selected theme.
 * @param {string} theme - The selected theme.
 */
function updateIcons(theme) {
    const iconMap = {
        'laker': {
            'indexButton': '../icons/dashboard-icon-white.png',
            'taskListButton': '../icons/tasklist-icon-white.png',
            'calendarButton': '../icons/calendar-icon-white.png',
            'codeLogButton': '../icons/codelog-icon-white.png',
            'documentationButton': '../icons/documentation-icon-white.png',
            'feedbackButton': '../icons/feedback-icon-white.png'
        },
        'light': {
            'indexButton': '../icons/dashboard-icon-black.png',
            'taskListButton': '../icons/tasklist-icon-black.png',
            'calendarButton': '../icons/calendar-icon-black.png',
            'codeLogButton': '../icons/codelog-icon-black.png',
            'documentationButton': '../icons/documentation-icon-black.png',
            'feedbackButton': '../icons/feedback-icon-black.png'
        },
        'dark': {
            'indexButton': '../icons/dashboard-icon-white.png',
            'taskListButton': '../icons/tasklist-icon-white.png',
            'calendarButton': '../icons/calendar-icon-white.png',
            'codeLogButton': '../icons/codelog-icon-white.png',
            'documentationButton': '../icons/documentation-icon-white.png',
            'feedbackButton': '../icons/feedback-icon-white.png'
        },
        'christmas': {
            'indexButton': '../icons/dashboard-icon-white.png',
            'taskListButton': '../icons/tasklist-icon-white.png',
            'calendarButton': '../icons/calendar-icon-white.png',
            'codeLogButton': '../icons/codelog-icon-white.png',
            'documentationButton': '../icons/documentation-icon-white.png',
            'feedbackButton': '../icons/feedback-icon-white.png'
        },
        'triton': {
            'indexButton': '../icons/dashboard-icon-yellow.png',
            'taskListButton': '../icons/tasklist-icon-yellow.png',
            'calendarButton': '../icons/calendar-icon-yellow.png',
            'codeLogButton': '../icons/codelog-icon-yellow.png',
            'documentationButton': '../icons/documentation-icon-yellow.png',
            'feedbackButton': '../icons/feedback-icon-yellow.png'
        }
    };

    const buttons = document.querySelectorAll('.sideButton');
    buttons.forEach(button => {
        const buttonId = button.id;
        if (iconMap[theme][buttonId]) {
            button.querySelector('img').src = iconMap[theme][buttonId];
        }
    });
}
