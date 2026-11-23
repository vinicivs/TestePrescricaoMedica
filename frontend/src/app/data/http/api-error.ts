import { HttpErrorResponse } from '@angular/common/http';

interface ProblemDetails {
  title?: string;
  detail?: string;
  rule?: string;
  errors?: Record<string, string[]>;
}

export function toErrorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'Ocorreu um erro inesperado.';
  if (error.status === 0) return 'Não foi possível conectar à API.';

  const problem = error.error as ProblemDetails | null;
  if (!problem || typeof problem !== 'object') return `Erro ${error.status}.`;

  if (problem.errors) {
    return Object.values(problem.errors).flat().join(' ');
  }

  const detail = problem.detail ?? problem.title ?? `Erro ${error.status}.`;
  return problem.rule ? `[${problem.rule}] ${detail}` : detail;
}
