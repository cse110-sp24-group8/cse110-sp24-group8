document.addEventListener('DOMContentLoaded', () => {


    
    let activated = false;
    const radioButtons = document.querySelectorAll('#themeSwitcher input[type="radio"]');
    const fieldset = document.querySelector('fieldset');
    document.querySelector('.hamburger-button').addEventListener('click', function() {
        activated = !activated;
        if (activated) {
            radioButtons.forEach(function(radioButton) {
                radioButton.style.display = 'inline-block'; // Change 'block' to whatever display value you need
                fieldset.style.width = '300px';
            });
        }
        else {
            radioButtons.forEach(function(radioButton) {
                radioButton.style.display = 'none'; // Change 'block' to whatever display value you need
                fieldset.style.width = '0';
            });
        }
    });

    const colorThemes = document.querySelectorAll('[name="theme"]');
    const iconMap = {
        'laker': {
            'indexButton': './icons/dashboard-icon-white.png',
            'tasklist': './icons/tasklist-icon-white.png',
            'calendar': './icons/calendar-icon-white.png',
            'codelog': './icons/codelog-icon-white.png',
            'documentation': './icons/documentation-icon-white.png',
            'feedback': './icons/feedback-icon-white.png'
        },
        'light': {
            'indexButton': './icons/dashboard-icon-black.png',
            'tasklist': './icons/tasklist-icon-black.png',
            'calendar': './icons/calendar-icon-black.png',
            'codelog': './icons/codelog-icon-black.png',
            'documentation': './icons/documentation-icon-black.png',
            'feedback': './icons/feedback-icon-black.png'
        },
        'dark': {
            'indexButton': './icons/dashboard-icon-white.png',
            'tasklist': './icons/tasklist-icon-white.png',
            'calendar': './icons/calendar-icon-white.png',
            'codelog': './icons/codelog-icon-white.png',
            'documentation': './icons/documentation-icon-white.png',
            'feedback': './icons/feedback-icon-white.png'
        },
        'christmas': {
            'indexButton': './icons/dashboard-icon-white.png',
            'tasklist': './icons/tasklist-icon-white.png',
            'calendar': './icons/calendar-icon-white.png',
            'codelog': './icons/codelog-icon-white.png',
            'documentation': './icons/documentation-icon-white.png',
            'feedback': './icons/feedback-icon-white.png'
        },
        'triton': {
            'indexButton': './icons/dashboard-icon-yellow.png',
            'tasklist': './icons/tasklist-icon-yellow.png',
            'calendar': './icons/calendar-icon-yellow.png',
            'codelog': './icons/codelog-icon-yellow.png',
            'documentation': './icons/documentation-icon-yellow.png',
            'feedback': './icons/feedback-icon-yellow.png'
        }
    };
  
    // Storing theme in localStorage
    const storeTheme = function(theme) {
        localStorage.setItem("theme", theme);
    };
  
    // Retrieving and applying theme from localStorage
    const retrieveTheme = function() {
        const currentTheme = localStorage.getItem("theme");
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
  
    // Adding event listeners to theme options
    colorThemes.forEach((themeOption) => {
        themeOption.addEventListener("change", () => {
            storeTheme(themeOption.id);
            updateIcons(themeOption.id);
        });
    });

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
  