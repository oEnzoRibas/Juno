export const locales = {
  en: { lang: 'pt-BR', href: '/?lang=pt-BR', label: 'Português (Brasil)' },
  'pt-BR': { lang: 'en', href: '/', label: 'English' },
} as const;

export const messages = {
  en: {
    title: 'Workspace setup',
    description: 'The Juno web service is running.',
  },
  'pt-BR': {
    title: 'Configuração do espaço de trabalho',
    description: 'O serviço web do Juno está em execução.',
  },
} as const;
