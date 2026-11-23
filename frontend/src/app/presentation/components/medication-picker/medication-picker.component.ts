import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from 'rxjs';
import { SearchMedicationsUseCase } from '../../../application/use-cases/catalog.use-cases';
import { Medication } from '../../../domain/models/medication';

@Component({
  selector: 'app-medication-picker',
  templateUrl: './medication-picker.component.html',
})
export class MedicationPickerComponent {
  private readonly searchMedications = inject(SearchMedicationsUseCase);
  private readonly terms = new Subject<string>();

  readonly selected = output<Medication>();
  readonly freeText = output<string>();

  protected readonly term = signal('');
  protected readonly results = signal<Medication[]>([]);
  protected readonly open = signal(false);
  protected readonly loading = signal(false);
  protected readonly activeIndex = signal(-1);

  constructor() {
    this.terms
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => this.searchMedications.execute(term).pipe(catchError(() => of([])))),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((medications) => {
        this.results.set(medications);
        this.activeIndex.set(-1);
        this.loading.set(false);
      });
  }

  protected onInput(value: string): void {
    this.term.set(value);
    this.open.set(true);
    this.terms.next(value);
  }

  protected onFocus(): void {
    this.open.set(true);
    this.terms.next(this.term());
  }

  protected onKeydown(event: KeyboardEvent): void {
    const total = this.results().length;
    if (event.key === 'ArrowDown' && total) {
      event.preventDefault();
      this.activeIndex.update((i) => (i + 1) % total);
    } else if (event.key === 'ArrowUp' && total) {
      event.preventDefault();
      this.activeIndex.update((i) => (i <= 0 ? total - 1 : i - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const medication = this.results()[this.activeIndex()];
      if (medication) this.choose(medication);
      else this.useTypedName();
    } else if (event.key === 'Escape') {
      this.open.set(false);
    }
  }

  protected choose(medication: Medication): void {
    this.selected.emit(medication);
    this.reset();
  }

  protected useTypedName(): void {
    const name = this.term().trim();
    if (!name) return;
    this.freeText.emit(name);
    this.reset();
  }

  protected close(): void {
    setTimeout(() => this.open.set(false), 150);
  }

  private reset(): void {
    this.term.set('');
    this.results.set([]);
    this.open.set(false);
  }
}
