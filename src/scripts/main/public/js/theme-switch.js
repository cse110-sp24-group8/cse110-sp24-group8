document.addEventListener('DOMContentLoaded', () => {
    
    let activated = false;
    const radioButtons = document.querySelectorAll('#themeSwitcher input[type="radio"]');
    const fieldset = document.querySelector('fieldset');
    
    /**
     * Toggles the display of theme radio buttons and adjusts fieldset width on hamburger button click.
     */
    document.querySelector('.hamburger-button').addEventListener('click', function() {
        activated = !activated;
        if (activated) {
            radioButtons.forEach(function(radioButton) {
                radioButton.style.display = 'inline-block'; // Change 'block' to whatever display value you need
                fieldset.style.width = '300px';
            });
        } else {
            radioButtons.forEach(function(radioButton) {
                radioButton.style.display = 'none'; // Change 'block' to whatever display value you need
                fieldset.style.width = '0';
            });
        }
    });

    const colorThemes = document.querySelectorAll('[name="theme"]');
    const iconMap = {
        'laker': {
            'indexButton': '../icons/dashboard-icon-white.png',
            'tasklistButton': '../icons/tasklist-icon-white.png',
            'calendarButton': '../icons/calendar-icon-white.png',
            'codelogButton': '../icons/codelog-icon-white.png',
            'documentationButton': '../icons/documentation-icon-white.png',
            'feedbackButton': '../icons/feedback-icon-white.png'
        },
        'light': {
            'indexButton': '../icons/dashboard-icon-black.png',
            'tasklistButton': '../icons/tasklist-icon-black.png',
            'calendarButton': '../icons/calendar-icon-black.png',
            'codelogButton': '../icons/codelog-icon-black.png',
            'documentationButton': '../icons/documentation-icon-black.png',
            'feedbackButton': '../icons/feedback-icon-black.png'
        },
        'dark': {
            'indexButton': '../icons/dashboard-icon-white.png',
            'tasklistButton': '../icons/tasklist-icon-white.png',
            'calendarButton': '../icons/calendar-icon-white.png',
            'codelogButton': '../icons/codelog-icon-white.png',
            'documentationButton': '../icons/documentation-icon-white.png',
            'feedbackButton': '../icons/feedback-icon-white.png'
        },
        'christmas': {
            'indexButton': '../icons/dashboard-icon-white.png',
            'tasklistButton': '../icons/tasklist-icon-white.png',
            'calendarButton': '../icons/calendar-icon-white.png',
            'codelogButton': '../icons/codelog-icon-white.png',
            'documentationButton': '../icons/documentation-icon-white.png',
            'feedbackButton': '../icons/feedback-icon-white.png'
        },
        'triton': {
            'indexButton': '../icons/dashboard-icon-yellow.png',
            'tasklistButton': '../icons/tasklist-icon-yellow.png',
            'calendarButton': '../icons/calendar-icon-yellow.png',
            'codelogButton': '../icons/codelog-icon-yellow.png',
            'documentationButton': '../icons/documentation-icon-yellow.png',
            'feedbackButton': '../icons/feedback-icon-yellow.png'
        }
    };

     // Adjust icon paths based on the current page
     function adjustIconPaths(iconMap) {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'index.html' || currentPage === '') {
            // We are on the dashboard page, adjust paths for other pages
            Object.keys(iconMap).forEach(theme => {
                iconMap[theme]['indexButton'] = iconMap[theme]['indexButton'].replace('../', './');
                iconMap[theme]['tasklistButton'] = iconMap[theme]['tasklistButton'].replace('../', './');
                iconMap[theme]['calendarButton'] = iconMap[theme]['calendarButton'].replace('../', './');
                iconMap[theme]['codelogButton'] = iconMap[theme]['codelogButton'].replace('../', './');
                iconMap[theme]['documentationButton'] = iconMap[theme]['documentationButton'].replace('../', './');
                iconMap[theme]['feedbackButton'] = iconMap[theme]['feedbackButton'].replace('../', './');
            });
        }
    }

    adjustIconPaths(iconMap);
  
    // Storing theme in localStorage
    const storeTheme = function(theme) {
        localStorage.setItem("theme", theme);
    };

    /**
     * Retrieves and applies the stored theme from localStorage.
     */
    const retrieveTheme = function() {
        let currentTheme = localStorage.getItem("theme");
        if (!currentTheme) {
            currentTheme = 'laker'; // Default theme if none is set
            storeTheme(currentTheme);
        }
        
        if (currentTheme) {
            colorThemes.forEach((themeOption) => {
                if (themeOption.id === currentTheme) {
                    themeOption.checked = true;
                    updateIcons(currentTheme);
                    // Here you can also apply the theme to your document, e.g.:
                    // document.documentElement.setAttribute('data-theme', currentTheme);
                }
            });
        }
    };

    /**
     * Adds event listeners to theme options for storing and updating icons.
     */
    colorThemes.forEach((themeOption) => {
        themeOption.addEventListener("change", () => {
            storeTheme(themeOption.id);
            updateIcons(themeOption.id);
        });
    });

    /**
     * Updates the icons based on the selected theme.
     * @param {string} theme - The selected theme.
     */
    function updateIcons(theme) {
        const buttons = document.querySelectorAll('.sideButton');
        buttons.forEach(button => {
            const buttonId = button.id;
            if (iconMap[theme][buttonId]) {
                button.querySelector('img').src = iconMap[theme][buttonId];
            }
        });
    }

    // Applying theme from localStorage on page load
    retrieveTheme();
});
