import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DeletePrescriptionUseCase } from '../../../application/use-cases/delete-prescription.use-case';
import { GetPrescriptionUseCase } from '../../../application/use-cases/get-prescription.use-case';
import { toErrorMessage } from '../../../data/http/api-error';
import { PRESCRIPTION_TYPE_LABELS, Prescription } from '../../../domain/models/prescription';

@Component({
  selector: 'app-prescription-detail-page',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './prescription-detail.page.html',
})
export class PrescriptionDetailPage {
  private readonly getPrescription = inject(GetPrescriptionUseCase);
  private readonly deletePrescription = inject(DeletePrescriptionUseCase);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly typeLabels = PRESCRIPTION_TYPE_LABELS;
  protected readonly prescription = signal<Prescription | null>(null);
  protected readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = Number(this.id());
      this.getPrescription.execute(id).subscribe({
        next: (prescription) => this.prescription.set(prescription),
        error: (err) => this.error.set(toErrorMessage(err)),
      });
    });
  }

  protected print(): void {
    window.print();
  }

  protected remove(prescription: Prescription): void {
    if (!confirm(`Excluir a prescrição #${prescription.id}?`)) return;

    this.deletePrescription.execute(prescription.id).subscribe({
      next: () => this.router.navigate(['/prescriptions']),
      error: (err) => this.error.set(toErrorMessage(err)),
    });
  }
}
