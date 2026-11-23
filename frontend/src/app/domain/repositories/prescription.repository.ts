import { Observable } from 'rxjs';
import { Page, PageRequest, Sort } from '../models/page';
import { Prescription, PrescriptionSummary, PrescriptionType, SavePrescription } from '../models/prescription';

export type PrescriptionSortField = 'issuedAt' | 'patientName' | 'prescriberName';

export interface PrescriptionFilter {
  search?: string;
  type?: PrescriptionType | null;
}

export interface PrescriptionListQuery extends PageRequest {
  filter: PrescriptionFilter;
  sort: Sort<PrescriptionSortField>;
}

export abstract class PrescriptionRepository {
  abstract list(query: PrescriptionListQuery): Observable<Page<PrescriptionSummary>>;
  abstract getById(id: number): Observable<Prescription>;
  abstract create(prescription: SavePrescription): Observable<Prescription>;
  abstract update(id: number, prescription: SavePrescription): Observable<Prescription>;
  abstract delete(id: number): Observable<void>;
}
