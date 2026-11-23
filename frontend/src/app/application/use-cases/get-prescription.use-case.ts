import { inject, Injectable } from '@angular/core';
import { PrescriptionRepository } from '../../domain/repositories/prescription.repository';

@Injectable({ providedIn: 'root' })
export class GetPrescriptionUseCase {
  private readonly repository = inject(PrescriptionRepository);

  execute(id: number) {
    return this.repository.getById(id);
  }
}
