import type { ShellLocale } from '../../../(shell)/_components/shell-data';

const en = {
  title: 'Organization profile',
  description: 'Update your organization’s display name and workspace accent.',
  name: 'Organization name',
  accent: 'Workspace accent',
  accentHint: 'Enter a six-digit hex color, for example #7565F5.',
  save: 'Save profile',
  saving: 'Saving profile…',
  saved: 'Organization profile saved.',
  invalid: 'Enter a name of 1–120 characters and a six-digit hex color.',
  unavailable: 'The profile could not be saved. Try again.',
  dashboard: 'Back to dashboard',
};

export const profileMessages: Record<ShellLocale, typeof en> = {
  en,
  'pt-BR': {
    title: 'Perfil da organização',
    description: 'Atualize o nome de exibição e a cor de destaque da sua organização.',
    name: 'Nome da organização',
    accent: 'Cor de destaque',
    accentHint: 'Digite uma cor hexadecimal de seis dígitos, por exemplo #7565F5.',
    save: 'Salvar perfil',
    saving: 'Salvando perfil…',
    saved: 'Perfil da organização salvo.',
    invalid: 'Digite um nome de 1 a 120 caracteres e uma cor hexadecimal de seis dígitos.',
    unavailable: 'Não foi possível salvar o perfil. Tente novamente.',
    dashboard: 'Voltar ao painel',
  },
};
