document.addEventListener('DOMContentLoaded', () => {
    const colorThemes = document.querySelectorAll('[name="theme"]');
    console.log(colorThemes);
  
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
  