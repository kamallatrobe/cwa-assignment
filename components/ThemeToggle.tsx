'use client';

import { useEffect, useState } from 'react';
import { setCookie, getCookie } from '@/lib/cookies';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = (getCookie('theme') as 'light' | 'dark') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    document.body.style.setProperty('--bg', saved === 'light' ? '#fff' : '#111');
    document.body.style.color = saved === 'light' ? '#111' : '#f6f6f6';
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setCookie('theme', next, 365);
    document.documentElement.setAttribute('data-theme', next);
    document.body.style.setProperty('--bg', next === 'light' ? '#fff' : '#111');
    document.body.style.color = next === 'light' ? '#111' : '#f6f6f6';
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'transparent' }}
    >
      {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}
