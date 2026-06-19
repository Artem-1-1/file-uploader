import { browser } from '$app/environment';

const getInitialTheme = () => {
  if (browser) {
    return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  }
  return 'light';
};

export const themeSignal = $state({
  current: getInitialTheme()
});

export function toggleTheme() {
  const newTheme = themeSignal.current === 'dark' ? 'light' : 'dark';
  themeSignal.current = newTheme;

  if (browser) {
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    const maxAge = 365 * 24 * 60 * 60;
    document.cookie = `theme=${newTheme}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}