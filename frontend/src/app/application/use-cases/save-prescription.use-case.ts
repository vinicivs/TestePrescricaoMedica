import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Prescription, SavePrescription } from '../../domain/models/prescription';
import { PrescriptionRepository } from '../../domain/repositories/prescription.repository';
import { validateFreeText, validateItem, validateStructuredItems } from '../../domain/rules/prescription.rules';

export class PrescriptionValidationError extends Error {}

@Injectable({ providedIn: 'root' })
export class SavePrescriptionUseCase {
  private readonly repository = inject(PrescriptionRepository);

  execute(prescription: SavePrescription, id?: number): Observable<Prescription> {
    const error = this.validate(prescription);
    if (error) return throwError(() => new PrescriptionValidationError(error));

    return id ? this.repository.update(id, prescription) : this.repository.create(prescription);
  }

  private validate(prescription: SavePrescription): string | null {
    if (prescription.type === 'Unstructured') return validateFreeText(prescription.freeText);

    const listError = validateStructuredItems(prescription.items);
    if (listError) return listError;

    const index = prescription.items.findIndex((item) => validateItem(item).length > 0);
    return index >= 0 ? `Item ${index + 1}: ${validateItem(prescription.items[index]).join(' ')}` : null;
  }
}
