import { inject, Injectable } from '@angular/core';
import { CatalogRepository } from '../../domain/repositories/catalog.repository';

@Injectable({ providedIn: 'root' })
export class ListPatientsUseCase {
  private readonly repository = inject(CatalogRepository);

  execute() {
    return this.repository.listPatients();
  }
}

@Injectable({ providedIn: 'root' })
export class SearchMedicationsUseCase {
  private readonly repository = inject(CatalogRepository);

  execute(term: string, limit = 15) {
    return this.repository.searchMedications(term, limit);
  }
}
