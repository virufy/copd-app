export const reportProblemForm = {
  en: 'https://docs.google.com/forms/d/e/1FAIpQLScYsWESIcn1uyEzFQT464qLSYZuUduHzThgTRPJODTQcCwz5w/viewform',
  es: 'https://docs.google.com/forms/d/1svBSWjeLzFKpOuuau5RrdSO3jCiT-SCi-I02DxkNoEw/viewform',
};

declare global {
  type ReportProblemLanguage = keyof typeof reportProblemForm;
}
