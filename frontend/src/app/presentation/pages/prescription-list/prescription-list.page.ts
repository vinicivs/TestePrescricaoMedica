import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { DeletePrescriptionUseCase } from '../../../application/use-cases/delete-prescription.use-case';
import { ListPrescriptionsUseCase } from '../../../application/use-cases/list-prescriptions.use-case';
import { toErrorMessage } from '../../../data/http/api-error';
import { SortDirection } from '../../../domain/models/page';
import { PRESCRIPTION_TYPE_LABELS, PrescriptionSummary, PrescriptionType } from '../../../domain/models/prescription';
import { PrescriptionSortField } from '../../../domain/repositories/prescription.repository';

@Component({
  selector: 'app-prescription-list-page',
  imports: [RouterLink, DatePipe],
  templateUrl: './prescription-list.page.html',
})
export class PrescriptionListPage {
  private readonly listPrescriptions = inject(ListPrescriptionsUseCase);
  private readonly deletePrescription = inject(DeletePrescriptionUseCase);
  private readonly reload$ = new Subject<number>();

  protected readonly typeLabels = PRESCRIPTION_TYPE_LABELS;
  protected readonly pageSize = 10;

  protected readonly items = signal<PrescriptionSummary[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly search = signal('');
  protected readonly type = signal<PrescriptionType | null>(null);
  protected readonly sortField = signal<PrescriptionSortField>('issuedAt');
  protected readonly sortDirection = signal<SortDirection>('desc');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.reload$
      .pipe(
        debounceTime(0),
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(() =>
          this.listPrescriptions.execute({
            page: this.page(),
            pageSize: this.pageSize,
            filter: { search: this.search(), type: this.type() },
            sort: { field: this.sortField(), direction: this.sortDirection() },
          }),
        ),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe({
        next: (result) => {
          this.items.set(result.items);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(toErrorMessage(err));
          this.loading.set(false);
        },
      });

    this.load();
  }

  protected get totalPages(): number {
    return Math.max(1, Math.ceil(this.total() / this.pageSize));
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
    this.load();
  }

  protected onTypeChange(value: string): void {
    this.type.set((value || null) as PrescriptionType | null);
    this.page.set(1);
    this.load();
  }

  protected sortBy(field: PrescriptionSortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.load();
  }

  protected sortIndicator(field: PrescriptionSortField): string {
    if (this.sortField() !== field) return '';
    return this.sortDirection() === 'asc' ? '▲' : '▼';
  }

  protected goTo(page: number): void {
    this.page.set(Math.min(Math.max(1, page), this.totalPages));
    this.load();
  }

  protected remove(prescription: PrescriptionSummary): void {
    if (!confirm(`Excluir a prescrição #${prescription.id} de ${prescription.patientName}?`)) return;

    this.deletePrescription.execute(prescription.id).subscribe({
      next: () => {
        if (this.items().length === 1 && this.page() > 1) this.page.update((p) => p - 1);
        this.load();
      },
      error: (err) => this.error.set(toErrorMessage(err)),
    });
  }

  private load(): void {
    this.reload$.next(Date.now());
  }
}
