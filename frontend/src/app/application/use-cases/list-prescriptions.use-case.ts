import { inject, Injectable } from '@angular/core';
import { PrescriptionListQuery, PrescriptionRepository } from '../../domain/repositories/prescription.repository';

@Injectable({ providedIn: 'root' })
export class ListPrescriptionsUseCase {
  private readonly repository = inject(PrescriptionRepository);

  execute(query: PrescriptionListQuery) {
    return this.repository.list(query);
  }
}
