'use client';

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { ShellIcon } from './shell-icon';
import styles from './application-shell.module.css';

type Theme = 'system' | 'light' | 'dark';
const key = 'juno.shell.preferences';
let temporaryPreference = '';
const PreferenceContext = createContext({ collapsed: false, theme: 'system' as Theme });

function subscribe(change: () => void) {
  window.addEventListener('storage', change);
  return () => window.removeEventListener('storage', change);
}

function read() {
  try {
    return window.localStorage.getItem(key) ?? temporaryPreference;
  } catch {
    return temporaryPreference;
  }
}

const initial = () => '';

/** Persist UI preferences independently of authentication or workspace state. */
export function ShellPreferences({ children }: { children: ReactNode }) {
  const saved = useSyncExternalStore(subscribe, read, initial);
  const [rail, mode] = saved.split(':');
  const collapsed = rail === 'compact';
  const theme = mode === 'light' || mode === 'dark' ? mode : 'system';
  return (
    <PreferenceContext.Provider value={{ collapsed, theme }}>
      <div className={styles.preferences} data-collapsed={collapsed} data-theme={theme}>{children}</div>
    </PreferenceContext.Provider>
  );
}

function save(value: string) {
  temporaryPreference = value;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preferences are optional when browser storage is unavailable.
  }
  window.dispatchEvent(new Event('storage'));
}

export function AccountMenu({ label, children }: { label: string; children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);

  return (
    <details className={styles.accountMenu} ref={details} onKeyDown={event => {
      if (event.key !== 'Escape' || !details.current?.open) return;
      details.current.open = false;
      summary.current?.focus();
    }}>
      <summary ref={summary} aria-label={label}><ShellIcon name="account" /></summary>
      <div className={styles.accountControls}>{children}</div>
    </details>
  );
}

export function ThemePicker({ label, system, light, dark }: Record<Theme | 'label', string>) {
  const { collapsed, theme } = useContext(PreferenceContext);
  return (
    <label className="form-field">
      {label}
      <select value={theme} onChange={event => save((collapsed ? 'compact:' : 'expanded:') + event.target.value)}>
        <option value="system">{system}</option>
        <option value="light">{light}</option>
        <option value="dark">{dark}</option>
      </select>
    </label>
  );
}

export function NavigationToggle({ expand, collapse, open, close, children }: {
  expand: string; collapse: string; open: string; close: string; children: ReactNode;
}) {
  const { collapsed, theme } = useContext(PreferenceContext);
  const [show, setShow] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const mobile = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 769px)');
    function closeOnDesktop() {
      if (desktop.matches) dialog.current?.close();
    }
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  function dismiss() {
    dialog.current?.close();
  }

  return (
    <>
      <button type="button" className={styles.desktopToggle} aria-label={collapsed ? expand : collapse}
        aria-controls="shell-sidebar" aria-expanded={!collapsed}
        onClick={() => save((collapsed ? 'expanded:' : 'compact:') + theme)}>
        <ShellIcon name="menu" />
      </button>
      <button ref={mobile} type="button" className={styles.mobileToggle} aria-label={open} aria-expanded={show}
        aria-controls="shell-drawer" onClick={() => {
          dialog.current?.showModal();
          setShow(true);
        }}>
        <ShellIcon name="menu" />
      </button>
      <dialog id="shell-drawer" className={styles.drawer} ref={dialog} aria-label={open}
        onClose={() => { setShow(false); mobile.current?.focus(); }} onClick={event => {
          if (event.target === event.currentTarget) dismiss();
        }}>
        <div className={styles.drawerInner}>
          <button type="button" className={styles.desktopIcon} aria-label={close} onClick={dismiss}><ShellIcon name="close" /></button>
          {show && <div onClick={event => {
            if (event.target instanceof Element && event.target.closest('a')) dismiss();
          }}>{children}</div>}
        </div>
      </dialog>
    </>
  );
}
