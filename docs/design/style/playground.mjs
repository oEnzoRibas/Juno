import { translate } from './copy.mjs';

const organizations = {
  purple: {
    name: 'Atlas Júnior Engenharia',
    role: 'admin',
    people: [
      ['Ana Costa', 'ana@example.invalid', 'admin', 'active', '2024-04-12'],
      ['Leo Martins', 'leo@example.invalid', 'member', 'active', '2025-02-15'],
      ['Mia Ribeiro', 'mia@example.invalid', 'member', 'inactive', '2025-11-20'],
      ['Sofia Lima', 'sofia.antunes.ribeiro.lima@example.invalid', 'member', 'active', '2026-01-08'],
    ],
  },
  teal: {
    name: 'Maré Alta Design',
    role: 'admin',
    people: [
      ['Iara Santos', 'iara@example.invalid', 'admin', 'active', '2024-08-22'],
      ['Noah Almeida', 'noah@example.invalid', 'member', 'active', '2025-01-27'],
    ],
  },
  coral: { name: 'Estúdio Horizonte', role: 'member', people: [] },
};
const glyphs = {
  dashboard: 'M3 10l9-7 9 7v10H3zM9 20v-6h6v6',
  organizations: 'M3 21V7h8V3h10v18zM7 11h1m-1 4h1m6-7h3m-3 4h3m-3 4h3',
  members: 'M3 20v-2c0-3 3-4 6-4s6 1 6 4v2m2-6c2 0 4 1 4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  account: 'M4 21v-2c0-3 4-5 8-5s8 2 8 5v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  menu: 'M3 6h18M3 12h18M3 18h18',
  arrow: 'm9 5 7 7-7 7',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18m-2-11a2 2 0 1 1 3 1.7c-1 .5-1 1.3-1 2.3m0 3h.01',
};
const screens = ['dashboard', 'organizations', 'members', 'account', 'platform', 'auth', 'library'];
const emptyFilter = () => ({ prefix: '', role: 'all', status: 'all' });
const state = {
  lang: 'pt-BR',
  theme: 'light',
  font: 'nunito',
  palette: 'purple',
  org: 'purple',
  width: 'auto',
  screen: 'members',
  compact: false,
  filter: emptyFilter(),
  feedback: 'empty',
};
const org = () => organizations[state.org];
const t = (key) => translate(key, state.lang);
const safe = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (symbol) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[symbol],
  );
const icon = (name) =>
  glyphs[name]
    ? '<svg aria-hidden="true" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' +
      glyphs[name] +
      '"></path></svg>'
    : '';
const btn = (label, action, kind = 'secondary', attrs = '') =>
  '<button class="btn ' + kind + '" type="button" data-action="' + action + '" ' + attrs + '>' + label + '</button>';
const nav = (key) =>
  '<button type="button" class="nav-item" data-action="' +
  key +
  '" title="' +
  t(key) +
  '" ' +
  (state.screen === key ? 'aria-current="page"' : '') +
  '>' +
  icon(key) +
  '<span class="nav-label">' +
  t(key) +
  '</span></button>';
const field = (label, name, type = 'text', attrs = '') =>
  '<label class="field">' + t(label) + '<input type="' + type + '" name="' + name + '" ' + attrs + '></label>';
const select = (label, name, options, selected) =>
  '<label class="field">' +
  t(label) +
  '<select name="' +
  name +
  '">' +
  options
    .map(
      ([value, key]) =>
        '<option value="' + value + '" ' + (selected === value ? 'selected' : '') + '>' + t(key) + '</option>',
    )
    .join('') +
  '</select></label>';
const options = (...keys) => keys.map((key) => [key, key]);
const card = (title, body) => '<section class="card"><h2>' + t(title) + '</h2>' + body + '</section>';
const notice = (kind, message, actions = '') => '<div class="notice ' + kind + '">' + t(message) + actions + '</div>';
const heading = (key, description) =>
  '<div class="page-head"><div><h1 id="screen-title" tabindex="-1">' +
  t(key) +
  '</h1>' +
  (description ? '<p>' + t(description) + '</p>' : '') +
  '</div></div>';
const brand = '<span class="brand" aria-label="Juno">juno.</span>';
const languages = [
  ['pt-BR', 'Português (Brasil)'],
  ['en', 'English'],
];
const themes = options('light', 'dark');
const paletteOptions = options('purple', 'teal', 'coral');
const fontOptions = [
  ['nunito', 'Nunito'],
  ['system', 'system'],
];
const widths = [
  ['auto', 'full'],
  ...[320, 375, 390, 768, 1024, 1280, 1920].map((width) => [String(width), width + ' px']),
];
const badge = (status) => '<span class="badge ' + (status === 'active' ? 'good' : '') + '">' + t(status) + '</span>';
const date = (iso) =>
  new Intl.DateTimeFormat(state.lang, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(iso));

function reviewBar() {
  return (
    '<div class="review-title">' +
    brand +
    '<div><strong class="title">' +
    t('lab') +
    '</strong><br><small>' +
    t('disclaimer') +
    '</small></div></div><div class="controls">' +
    select('screen', 'screen', options(...screens), state.screen) +
    select('viewport', 'width', widths, state.width) +
    select('palette', 'palette', paletteOptions, state.palette) +
    select('font', 'font', fontOptions, state.font) +
    select('language', 'lang', languages, state.lang) +
    select('theme', 'theme', themes, state.theme) +
    '</div>'
  );
}
function shell(screen) {
  const keys = ['dashboard', 'organizations', ...(org().role === 'admin' ? ['members'] : []), 'account'];
  const breadcrumbs =
    '<nav class="crumb" aria-label="' +
    (state.lang === 'en' ? 'Breadcrumbs' : 'Caminho de navegação') +
    '">' +
    (state.screen === 'platform' ? t('platform') : org().name) +
    ' / <span aria-current="page">' +
    t(state.screen) +
    '</span></nav>';
  return (
    '<div class="shell" data-compact="' +
    state.compact +
    '"><aside class="rail">' +
    brand +
    btn(
      icon('organizations') + '<span class="nav-label">' + org().name + '</span>',
      'switcher',
      'secondary switcher',
      'aria-label="' + t('switcher') + '" title="' + t('switcher') + '" aria-haspopup="dialog"',
    ) +
    '<nav aria-label="' +
    t('workspace') +
    '">' +
    keys.map(nav).join('') +
    '</nav></aside><div><header class="app-header">' +
    btn(
      icon('menu'),
      'compact',
      'secondary icon-button desktop-only',
      'aria-label="' + t(state.compact ? 'expand' : 'compact') + '" aria-pressed="' + state.compact + '"',
    ) +
    btn(
      icon('menu'),
      'drawer',
      'secondary icon-button mobile-only',
      'aria-label="' + t('actions') + '" aria-haspopup="dialog"',
    ) +
    '<strong>' +
    org().name +
    '</strong>' +
    btn(icon('account') + ' ' + t('account'), 'account-popover', 'secondary desktop-only', 'aria-haspopup="dialog"') +
    '</header>' +
    '<main aria-labelledby="screen-title">' +
    breadcrumbs +
    screen +
    '</main><nav class="bottom" aria-label="' +
    t('workspace') +
    '">' +
    ['dashboard', 'organizations', 'account'].map(nav).join('') +
    '</nav></div></div>'
  );
}
function organizationList() {
  return (
    '<ul class="list">' +
    Object.entries(organizations)
      .map(
        ([key, item]) =>
          '<li><button class="row-link" type="button" data-org="' +
          key +
          '"><span class="row"><span class="avatar" aria-hidden="true">' +
          item.name[0] +
          '</span><span><strong>' +
          item.name +
          '</strong><br><small>' +
          t(item.role) +
          (state.org === key ? ' · ' + t('current') : '') +
          '</small></span></span>' +
          icon('arrow') +
          '</button></li>',
      )
      .join('') +
    '</ul>'
  );
}
function memberLink(person, index) {
  return (
    '<button class="row-link" type="button" data-member="' +
    index +
    '"><span class="row"><span class="avatar" aria-hidden="true">' +
    person[0][0] +
    '</span><span><strong>' +
    person[0] +
    '</strong><small>' +
    person[1] +
    '</small></span></span>' +
    icon('arrow') +
    '</button>'
  );
}
function members() {
  if (org().role !== 'admin') return heading('members') + notice('info', 'notAvailable') + btn(t('back'), 'dashboard');
  const filter = state.filter;
  const rows = org()
    .people.map((person, index) => ({ person, index }))
    .filter(
      ({ person }) =>
        person[1].startsWith(filter.prefix.toLowerCase()) &&
        (filter.role === 'all' || person[2] === filter.role) &&
        (filter.status === 'all' || person[3] === filter.status),
    );
  const form =
    '<form class="filters" data-form="filter">' +
    field('prefix', 'prefix', 'search', 'value="' + safe(filter.prefix) + '" placeholder="ana@"') +
    select('role', 'role', options('all', 'admin', 'member'), filter.role) +
    select('status', 'status', options('all', 'active', 'inactive'), filter.status) +
    '<button type="submit" class="btn primary">' +
    t('filter') +
    '</button></form><div class="actions">' +
    btn(t('reset'), 'reset', 'tertiary') +
    '</div>';
  const body = rows.length
    ? '<div class="table-scroll" tabindex="0" role="region" aria-label="' +
      t('recent') +
      '"><table><caption>' +
      rows.length +
      ' ' +
      t('recent').toLowerCase() +
      '</caption><thead><tr>' +
      ['members', 'role', 'status', 'joined'].map((key) => '<th scope="col">' + t(key) + '</th>').join('') +
      '</tr></thead><tbody>' +
      rows
        .map(
          ({ person, index }) =>
            '<tr><td>' +
            memberLink(person, index) +
            '</td><td>' +
            t(person[2]) +
            '</td><td>' +
            badge(person[3]) +
            '</td><td>' +
            date(person[4]) +
            '</td></tr>',
        )
        .join('') +
      '</tbody></table></div>' +
      '<ul class="list mobile-list">' +
      rows
        .map(
          ({ person, index }) =>
            '<li class="stack">' +
            memberLink(person, index) +
            '<small>' +
            t(person[2]) +
            ' · ' +
            t(person[3]) +
            '</small></li>',
        )
        .join('') +
      '</ul>'
    : notice('info', 'noResults');
  return (
    heading('members', 'membersCopy') +
    card('filters', form) +
    '<section class="card compact"><h2>' +
    t('recent') +
    '</h2>' +
    body +
    '</section>'
  );
}
const sampleFields = () =>
  field(
    'email',
    'sample-email',
    'email',
    'autocomplete="off" aria-describedby="email-error" placeholder="ana@example.invalid"',
  ) +
  '<small class="field-error" id="email-error"></small><div class="stack"><label class="field" for="demo-password">' +
  t('password') +
  '</label><div class="password">' +
  '<input id="demo-password" type="password" name="sample-password" autocomplete="off" aria-describedby="password-error">' +
  btn(t('reveal'), 'reveal', 'secondary', 'aria-controls="demo-password" aria-pressed="false"') +
  '</div><small class="field-error" id="password-error"></small></div>';
function feedback() {
  return {
    empty: notice('info', 'emptyCopy'),
    loading:
      '<div class="stack" role="status">' + t('loading') + '…<div class="skeleton" aria-hidden="true"></div></div>',
    success: notice('success', 'success'),
    error: notice('error', 'errorCopy', '<div>' + btn(t('retry'), 'loading', 'tertiary') + '</div>'),
  }[state.feedback];
}
function library() {
  return (
    heading('library', 'componentCopy') +
    '<div class="grid">' +
    card(
      'buttonTitle',
      '<div class="actions">' +
        btn(t('primary'), 'sample', 'primary') +
        btn(t('secondary'), 'sample') +
        btn(t('tertiary'), 'sample', 'tertiary') +
        btn(t('destructive'), 'confirm', 'destructive', 'aria-haspopup="dialog"') +
        btn(t('disabled'), 'sample', 'secondary', 'disabled') +
        btn(t('pressed'), 'sample', 'primary sample-pressed') +
        btn(t('focused'), 'sample', 'secondary sample-focus') +
        btn(t('hover'), 'sample', 'secondary sample-hover') +
        btn(t('loading'), 'loading') +
        btn(
          icon('help'),
          'tip',
          'secondary icon-button',
          'aria-label="' + t('tip') + '" title="' + t('tip') + '" aria-haspopup="dialog"',
        ) +
        '</div>',
    ) +
    card(
      'inputTitle',
      '<form class="form" data-form="sample" novalidate>' +
        sampleFields() +
        select('role', 'sample-role', options('admin', 'member'), 'member') +
        '<label class="choice"><input type="checkbox" checked>' +
        t('contact') +
        '</label><fieldset><legend>' +
        t('method') +
        '</legend><label class="choice"><input type="radio" name="method" checked>' +
        t('immediate') +
        '</label><label class="choice"><input type="radio" name="method">' +
        t('later') +
        '</label></fieldset>' +
        '<button type="submit" class="btn primary">' +
        t('validate') +
        '</button><div role="status" data-form-status></div></form>',
    ) +
    card(
      'overlayTitle',
      '<div class="actions">' +
        btn(t('showDialog'), 'confirm', 'secondary', 'aria-haspopup="dialog"') +
        btn(t('popover'), 'tip', 'secondary', 'aria-haspopup="dialog"') +
        '</div>' +
        select('status', 'feedback', options('empty', 'loading', 'success', 'error'), state.feedback) +
        '<div id="feedback-example">' +
        feedback() +
        '</div>',
    ) +
    '</div>'
  );
}
function content() {
  switch (state.screen) {
    case 'members':
      return members();
    case 'organizations':
      return heading('organizations', 'orgCopy') + card('choose', organizationList());
    case 'account':
      return (
        heading('account', 'accountCopy') +
        card(
          'preferences',
          '<div class="form">' +
            select('language', 'lang', languages, state.lang) +
            select('theme', 'theme', themes, state.theme) +
            btn(t('mockSignout'), 'auth', 'tertiary') +
            '</div>',
        )
      );
    case 'platform':
      return (
        heading('platform', 'platformCopy') +
        card(
          'create',
          '<form class="form" data-form="platform">' +
            field('orgName', 'organization', 'text', 'required maxlength="120"') +
            field('slug', 'slug', 'text', 'required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" aria-describedby="slug-help"') +
            '<small id="slug-help">' +
            t('slugHelp') +
            '</small>' +
            '<div class="actions"><button class="btn primary" type="submit">' +
            t('create') +
            '</button>' +
            btn(t('cancel'), 'dashboard', 'tertiary') +
            '</div><div role="status" data-form-status></div></form>',
        )
      );
    case 'library':
      return library();
    default:
      return (
        '<section class="hero"><h1 id="screen-title" tabindex="-1">' +
        org().name +
        '</h1><p>' +
        t('dashCopy') +
        '</p></section><div class="grid">' +
        card('membership', '<p>' + t(org().role) + '</p>' + badge('active')) +
        (org().role === 'admin' ? card('people', btn(t('members'), 'members', 'primary')) : '') +
        card('organizations', btn(t('switcher'), 'switcher', 'secondary', 'aria-haspopup="dialog"')) +
        '</div>'
      );
  }
}
function authentication() {
  return (
    '<main class="auth" aria-labelledby="screen-title"><section class="auth-intro stack">' +
    brand +
    '<h2>' +
    t('intro') +
    '</h2><p>' +
    t('introCopy') +
    '</p></section>' +
    '<section class="card">' +
    heading('auth', 'authCopy') +
    '<form class="form" data-form="auth" novalidate>' +
    sampleFields() +
    '<button type="submit" class="btn primary">' +
    t('auth') +
    '</button></form></section></main>'
  );
}
const review = document.querySelector('#review');
const preview = document.querySelector('#preview');
const announcement = document.querySelector('#announcements');
let noticeTimer, feedbackTimer, releasePopover;
function announce(message) {
  clearTimeout(noticeTimer);
  announcement.textContent = message;
  noticeTimer = setTimeout(() => {
    announcement.textContent = '';
  }, 3000);
}
function applyAppearance() {
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.dataset.font = state.font;
  preview.dataset.palette = state.palette;
  preview.style.setProperty('--preview-width', state.width === 'auto' ? '1440px' : state.width + 'px');
}
function render(focus) {
  releasePopover?.();
  document.documentElement.lang = state.lang;
  applyAppearance();
  review.innerHTML = reviewBar();
  preview.innerHTML =
    (state.screen === 'auth' ? authentication() : shell(content())) +
    '<dialog id="overlay" aria-labelledby="overlay-title"></dialog><div popover id="popover" role="dialog" aria-labelledby="popover-title"></div>';
  if (focus === 'screen-title') document.querySelector('#screen-title')?.focus();
  else if (focus) document.querySelector('select[name="' + focus + '"]')?.focus();
}
function go(screen) {
  state.screen = screen;
  render('screen-title');
}
function dialog(trigger, title, body, kind = 'modal') {
  const panel = document.querySelector('#overlay');
  panel.dataset.kind = kind;
  if (kind === 'drawer') {
    const bounds = preview.getBoundingClientRect();
    panel.style.setProperty('--drawer-start', Math.max(0, bounds.left) + 'px');
    panel.style.setProperty('--drawer-width', Math.min(352, bounds.width - 32) + 'px');
  }
  panel.innerHTML =
    '<div class="stack"><div class="page-head"><h2 id="overlay-title">' +
    title +
    '</h2>' +
    btn(t('close'), 'close', 'tertiary', 'autofocus') +
    '</div>' +
    body +
    '</div>';
  panel.addEventListener(
    'close',
    () => {
      if (trigger.isConnected) trigger.focus();
    },
    { once: true },
  );
  panel.showModal();
}
function popover(trigger, title, body) {
  const pop = document.querySelector('#popover');
  pop.innerHTML =
    '<div class="stack"><h2 id="popover-title">' +
    title +
    '</h2>' +
    body +
    btn(t('close'), 'close-popover', 'tertiary') +
    '</div>';
  pop.showPopover();
  const fit = () => {
    const anchor = trigger.getBoundingClientRect();
    const bounds = preview.getBoundingClientRect();
    const left = Math.max(8, bounds.left + 8);
    const right = Math.min(innerWidth - 8, bounds.right - 8);
    pop.style.width = Math.min(264, right - left) + 'px';
    pop.style.left = Math.max(left, Math.min(anchor.right - pop.offsetWidth, right - pop.offsetWidth)) + 'px';
    pop.style.top = Math.max(8, Math.min(anchor.bottom + 7, innerHeight - pop.offsetHeight - 8)) + 'px';
  };
  releasePopover = () => {
    window.removeEventListener('resize', fit);
    window.removeEventListener('scroll', fit, true);
    releasePopover = undefined;
  };
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('scroll', fit, true);
  pop.addEventListener('toggle', (event) => {
    if (event.newState !== 'closed') return;
    releasePopover?.();
    if (trigger.isConnected && (document.activeElement === document.body || pop.contains(document.activeElement)))
      trigger.focus();
  });
  pop.querySelector('button').focus();
}
function setFeedback(value) {
  state.feedback = value;
  const sample = preview.querySelector('#feedback-example');
  if (sample) sample.innerHTML = feedback();
  const control = preview.querySelector('select[name=feedback]');
  if (control) control.value = value;
}
document.addEventListener('change', (event) => {
  const control = event.target;
  if (!(control instanceof HTMLSelectElement)) return;
  const { name, value } = control;
  if (name === 'feedback') {
    setFeedback(value);
    return;
  }
  if (name === 'screen') {
    go(value);
    return;
  }
  if (!['lang', 'theme', 'font', 'palette', 'width'].includes(name)) return;
  state[name] = value;
  if (name === 'lang') {
    render(name);
    return;
  }
  applyAppearance();
  for (const item of document.querySelectorAll('select[name="' + name + '"]')) item.value = value;
});
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('button');
  if (!trigger || trigger.disabled) return;
  const { action, org: next, member: index } = trigger.dataset;
  if (next && organizations[next]) {
    state.org = next;
    state.palette = next;
    state.filter = emptyFilter();
    go('dashboard');
    return;
  }
  if (index !== undefined) {
    const person = org().people[Number(index)];
    if (person)
      dialog(
        trigger,
        person[0],
        '<p>' +
          person[1] +
          '</p><dl><dt>' +
          t('role') +
          '</dt><dd>' +
          t(person[2]) +
          '</dd><dt>' +
          t('status') +
          '</dt><dd>' +
          badge(person[3]) +
          '</dd><dt>' +
          t('joined') +
          '</dt><dd>' +
          date(person[4]) +
          '</dd></dl>',
      );
    return;
  }
  if (screens.includes(action)) {
    go(action);
    return;
  }
  switch (action) {
    case 'compact':
      state.compact = !state.compact;
      render();
      preview.querySelector('[data-action=compact]')?.focus();
      break;
    case 'drawer':
      dialog(
        trigger,
        t('actions'),
        '<nav class="drawer-nav" aria-label="' +
          t('actions') +
          '">' +
          ['dashboard', 'organizations', ...(org().role === 'admin' ? ['members'] : []), 'account'].map(nav).join('') +
          '</nav>',
        'drawer',
      );
      break;
    case 'switcher':
      dialog(trigger, t('choose'), organizationList());
      break;
    case 'confirm':
      dialog(
        trigger,
        t('confirm'),
        '<p>' +
          t('confirmCopy') +
          '</p><div class="actions">' +
          btn(t('cancel'), 'close') +
          btn(t('confirm'), 'complete', 'destructive') +
          '</div>',
      );
      break;
    case 'close':
      document.querySelector('#overlay').close();
      break;
    case 'complete':
      document.querySelector('#overlay').close();
      announce(t('done'));
      break;
    case 'tip':
      popover(trigger, t('tip'), '<p>' + t('componentCopy') + '</p>');
      break;
    case 'account-popover':
      popover(trigger, t('account'), '<p>' + t('accountCopy') + '</p>' + nav('account'));
      break;
    case 'close-popover':
      document.querySelector('#popover').hidePopover();
      break;
    case 'reveal': {
      const input = document.querySelector('#demo-password');
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      trigger.textContent = t(visible ? 'hide' : 'reveal');
      trigger.setAttribute('aria-pressed', String(visible));
      break;
    }
    case 'reset':
      state.filter = emptyFilter();
      render('screen-title');
      break;
    case 'loading':
      if (feedbackTimer) return;
      trigger.disabled = true;
      trigger.setAttribute('aria-busy', 'true');
      setFeedback('loading');
      feedbackTimer = setTimeout(() => {
        feedbackTimer = undefined;
        if (state.feedback === 'loading') setFeedback('success');
        trigger.disabled = false;
        trigger.removeAttribute('aria-busy');
        announce(t('success'));
      }, 850);
      break;
    case 'sample':
      announce(t('done'));
      break;
  }
});
document.addEventListener('submit', (event) => {
  const form = event.target;
  if (!form.dataset.form) return;
  event.preventDefault();
  if (form.dataset.form === 'filter') {
    state.filter = Object.fromEntries(new FormData(form));
    render('screen-title');
    return;
  }
  if (form.dataset.form === 'platform') {
    form.querySelector('[data-form-status]').textContent = t('created');
    return;
  }
  const email = form.elements['sample-email'];
  const pass = form.elements['sample-password'];
  const invalidEmail = !email.value || !email.validity.valid;
  const invalidPassword = pass.value.length < 8;
  for (const [input, invalid, message] of [
    [email, invalidEmail, 'validEmail'],
    [pass, invalidPassword, 'validPassword'],
  ]) {
    input.setAttribute('aria-invalid', String(invalid));
    document.getElementById(input.getAttribute('aria-describedby')).textContent = invalid ? t(message) : '';
  }
  if (invalidEmail || invalidPassword) {
    (invalidEmail ? email : pass).focus();
    return;
  }
  if (form.dataset.form === 'auth') {
    form.reset();
    go('organizations');
  } else form.querySelector('[data-form-status]').textContent = t('valid');
});
render();
