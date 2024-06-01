function setTheme(theme) {
    const root = document.documentElement;
    if (theme==='dark') {
      root.style.setProperty('background', 'var(--bg-color-dark)');
      root.style.setProperty('color','var(--text-color-dark)');
    }
  
    else {
      root.style.setProperty('background', 'var(--bg-color-normal)');
      root.style.setProperty('color','var(--text-color-normal)');
    }
  }
  
  function toggleTheme() {
    console.log('clicked checkbox');
    const currTheme = localStorage.getItem('theme') || 'normal';
    let newTheme = '';
    if (currTheme==='normal'){
      newTheme = 'dark';
    }
    else {
      newTheme='normal';
    }

    localStorage.setItem('theme',newTheme);
    setTheme(newTheme);
  }
  
  function setSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme){
      setTheme(savedTheme);
      document.getElementById('themeToggle').checked = savedTheme ==='dark';
    }
  }
  
  document.addEventListener
  
  document.addEventListener('DOMContentLoaded', setSavedTheme);