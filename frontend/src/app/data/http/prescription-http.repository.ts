import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Page } from '../../domain/models/page';
import { Prescription, PrescriptionSummary, SavePrescription } from '../../domain/models/prescription';
import {
  PrescriptionListQuery,
  PrescriptionRepository,
  PrescriptionSortField,
} from '../../domain/repositories/prescription.repository';
import { ODataCollection, ODataQuery } from '../odata/odata-query';
import { API_ENDPOINTS } from './api-endpoints';
import { PrescriptionDto, PrescriptionMapper, PrescriptionSummaryODataDto } from './prescription.mapper';

const SORT_FIELDS: Record<PrescriptionSortField, string> = {
  issuedAt: 'IssuedAt',
  patientName: 'PatientName',
  prescriberName: 'PrescriberName',
};

@Injectable()
export class PrescriptionHttpRepository extends PrescriptionRepository {
  private readonly http = inject(HttpClient);

  list(query: PrescriptionListQuery): Observable<Page<PrescriptionSummary>> {
    const params = ODataQuery.create()
      .select('Id', 'PatientName', 'PrescriberName', 'Type', 'IssuedAt', 'ItemCount')
      .contains('PatientName', query.filter.search)
      .equals('Type', query.filter.type)
      .orderBy(SORT_FIELDS[query.sort.field], query.sort.direction)
      .page(query.page, query.pageSize)
      .count()
      .build();

    return this.http
      .get<ODataCollection<PrescriptionSummaryODataDto>>(API_ENDPOINTS.odataPrescriptions, { params })
      .pipe(
        map((response) => ({
          items: response.value.map(PrescriptionMapper.summaryToDomain),
          total: response['@odata.count'] ?? response.value.length,
        })),
      );
  }

  getById(id: number): Observable<Prescription> {
    return this.http
      .get<PrescriptionDto>(`${API_ENDPOINTS.prescriptions}/${id}`)
      .pipe(map(PrescriptionMapper.toDomain));
  }

  create(prescription: SavePrescription): Observable<Prescription> {
    return this.http
      .post<PrescriptionDto>(API_ENDPOINTS.prescriptions, PrescriptionMapper.toRequest(prescription))
      .pipe(map(PrescriptionMapper.toDomain));
  }

  update(id: number, prescription: SavePrescription): Observable<Prescription> {
    return this.http
      .put<PrescriptionDto>(`${API_ENDPOINTS.prescriptions}/${id}`, PrescriptionMapper.toRequest(prescription))
      .pipe(map(PrescriptionMapper.toDomain));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.prescriptions}/${id}`);
  }
}
