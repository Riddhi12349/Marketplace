import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.theme === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [darkMode]);

  return { darkMode, setDarkMode };
};
