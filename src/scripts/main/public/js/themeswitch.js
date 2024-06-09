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
                    // Here you can also apply the theme to your document, e.g.:
                    // document.documentElement.setAttribute('data-theme', currentTheme);
                }
            });
        }
    };
  
    // Adding event listeners to theme options
    colorThemes.forEach((themeOption) => {
        themeOption.addEventListener("click", () => {
            storeTheme(themeOption.id);
            // Apply the theme immediately on click
            // document.documentElement.setAttribute('data-theme', themeOption.id);
        });
    });
  
    // Applying theme from localStorage on page load
    retrieveTheme();
  });
  