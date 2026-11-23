import { Observable } from 'rxjs';
import { Medication } from '../models/medication';
import { Patient } from '../models/patient';

export abstract class CatalogRepository {
  abstract listPatients(): Observable<Patient[]>;
  abstract searchMedications(term: string, limit: number): Observable<Medication[]>;
}
