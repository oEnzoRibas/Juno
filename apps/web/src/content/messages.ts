export const locales = {
  en: { lang: 'pt-BR', href: '/?lang=pt-BR', label: 'Português (Brasil)' },
  'pt-BR': { lang: 'en', href: '/', label: 'English' },
} as const;

export const messages = {
  en: {
    signIn: 'Sign in',
    signOut: 'Sign out',
    signInError: 'Unable to sign in. Check your credentials or try again later.',
    email: 'Email address',
    password: 'Password',
    account: 'Your account',
    platformAdmin: 'Platform administration',
    title: 'Workspace setup',
    description: 'The Juno web service is running.',
  },
  'pt-BR': {
    signIn: 'Entrar',
    signOut: 'Sair',
    signInError: 'Não foi possível entrar. Verifique seus dados ou tente mais tarde.',
    email: 'E-mail',
    password: 'Senha',
    account: 'Sua conta',
    platformAdmin: 'Administração da plataforma',
    title: 'Configuração do espaço de trabalho',
    description: 'O serviço web do Juno está em execução.',
  },
} as const;
