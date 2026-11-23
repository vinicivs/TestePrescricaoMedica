import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Medication } from '../../domain/models/medication';
import { Patient } from '../../domain/models/patient';
import { CatalogRepository } from '../../domain/repositories/catalog.repository';
import { ODataCollection, ODataQuery } from '../odata/odata-query';
import { API_ENDPOINTS } from './api-endpoints';

interface PatientODataDto {
  Id: number;
  FullName: string;
  Cpf: string;
  BirthDate: string;
}

interface MedicationODataDto {
  Id: number;
  Name: string;
  ActiveIngredient: string;
  PharmaceuticalForm: string;
  Concentration: string | null;
}

@Injectable()
export class CatalogHttpRepository extends CatalogRepository {
  private readonly http = inject(HttpClient);

  listPatients(): Observable<Patient[]> {
    const params = ODataQuery.create()
      .select('Id', 'FullName', 'Cpf', 'BirthDate')
      .orderBy('FullName')
      .top(100)
      .build();

    return this.http.get<ODataCollection<PatientODataDto>>(API_ENDPOINTS.odataPatients, { params }).pipe(
      map((response) =>
        response.value.map((p) => ({ id: p.Id, fullName: p.FullName, cpf: p.Cpf, birthDate: p.BirthDate })),
      ),
    );
  }

  searchMedications(term: string, limit: number): Observable<Medication[]> {
    const search = term.trim().toLowerCase();
    const query = ODataQuery.create().orderBy('Name').top(limit);

    if (search) {
      const escaped = ODataQuery.escape(search);
      query.filter(`contains(tolower(Name),'${escaped}') or contains(tolower(ActiveIngredient),'${escaped}')`);
    }

    return this.http
      .get<ODataCollection<MedicationODataDto>>(API_ENDPOINTS.odataMedications, { params: query.build() })
      .pipe(
        map((response) =>
          response.value.map((m) => ({
            id: m.Id,
            name: m.Name,
            activeIngredient: m.ActiveIngredient,
            pharmaceuticalForm: m.PharmaceuticalForm,
            concentration: m.Concentration,
          })),
        ),
      );
  }
}
