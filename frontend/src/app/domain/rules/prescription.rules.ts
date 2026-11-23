import { PrescriptionItem, PrescriptionType } from '../models/prescription';

export const FREE_TEXT_MAX_LENGTH = 4000;
export const MAX_DURATION_DAYS = 365;

export function validateFreeText(text: string | null | undefined): string | null {
  const value = text?.trim() ?? '';
  if (!value) return 'ECF.10.01: o texto da receita é obrigatório.';
  if (value.length > FREE_TEXT_MAX_LENGTH) return `ECF.10.01: o texto deve ter no máximo ${FREE_TEXT_MAX_LENGTH} caracteres.`;
  return null;
}

export function validateItem(item: Partial<PrescriptionItem>): string[] {
  const errors: string[] = [];

  if (!item.medicationName?.trim()) errors.push('Informe o medicamento ou princípio ativo.');
  if (!item.pharmaceuticalForm?.trim()) errors.push('Informe a forma farmacêutica.');
  if (!item.dose || item.dose <= 0) errors.push('A dose deve ser maior que zero.');
  if (!item.doseUnit?.trim()) errors.push('Informe a unidade da dose.');
  if (!item.frequency?.trim()) errors.push('Informe a frequência.');
  if (!item.startDate) errors.push('Informe o início do tratamento.');
  if (!item.administrationRoute?.trim()) errors.push('Informe a via de administração.');

  if (item.continuousUse) {
    if (item.durationDays != null) errors.push('Uso contínuo não deve ter duração.');
  } else if (!item.durationDays || item.durationDays <= 0) {
    errors.push('Informe a duração em dias ou marque como uso contínuo.');
  } else if (item.durationDays > MAX_DURATION_DAYS) {
    errors.push(`A duração não pode exceder ${MAX_DURATION_DAYS} dias.`);
  }

  if (item.usageDeadline && item.startDate && item.usageDeadline < item.startDate) {
    errors.push('O prazo de utilização não pode ser anterior ao início do tratamento.');
  }

  return errors;
}

export function validateStructuredItems(items: Partial<PrescriptionItem>[]): string | null {
  if (items.length === 0) return 'ECF.10.03: a receita estruturada deve conter ao menos um medicamento.';

  const catalogIds = items.map((i) => i.medicationId).filter((id): id is number => id != null);
  if (new Set(catalogIds).size !== catalogIds.length) return 'ECF.10.03: o mesmo medicamento foi informado mais de uma vez.';

  return null;
}

export function requiresItems(type: PrescriptionType): boolean {
  return type === 'Structured';
}
