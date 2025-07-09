import { useEffect, useState } from "react";


export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(()=>{
    const saved = localStorage.getItem('theme');
    if(saved) {
      return saved ==='dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(()=>{
    console.log('Dark mode:', isDarkMode);
    if(isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light')
    }
  },[isDarkMode]);

  return {
    isDarkMode,
    toggleDarkMode: () => setIsDarkMode((prev) => !prev),
  }
};