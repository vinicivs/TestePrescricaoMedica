import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ListPatientsUseCase } from '../../../application/use-cases/catalog.use-cases';
import { GetPrescriptionUseCase } from '../../../application/use-cases/get-prescription.use-case';
import {
  PrescriptionValidationError,
  SavePrescriptionUseCase,
} from '../../../application/use-cases/save-prescription.use-case';
import { toErrorMessage } from '../../../data/http/api-error';
import { Medication } from '../../../domain/models/medication';
import { Patient } from '../../../domain/models/patient';
import { PrescriptionType } from '../../../domain/models/prescription';
import { FREE_TEXT_MAX_LENGTH } from '../../../domain/rules/prescription.rules';
import { MedicationPickerComponent } from '../../components/medication-picker/medication-picker.component';
import { ItemForm, PrescriptionFormFactory } from '../../forms/prescription-form.factory';

@Component({
  selector: 'app-prescription-form-page',
  imports: [ReactiveFormsModule, RouterLink, MedicationPickerComponent],
  templateUrl: './prescription-form.page.html',
})
export class PrescriptionFormPage implements OnInit {
  private readonly formFactory = inject(PrescriptionFormFactory);
  private readonly listPatients = inject(ListPatientsUseCase);
  private readonly getPrescription = inject(GetPrescriptionUseCase);
  private readonly savePrescription = inject(SavePrescriptionUseCase);
  private readonly router = inject(Router);

  readonly id = input<string>();

  protected readonly form = this.formFactory.createForm();
  protected readonly patients = signal<Patient[]>([]);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly freeTextMaxLength = FREE_TEXT_MAX_LENGTH;

  protected readonly pharmaceuticalForms = [
    'Comprimido', 'Comprimido revestido', 'Cápsula', 'Solução oral', 'Solução oral (gotas)', 'Suspensão oral',
    'Xarope', 'Ampola', 'Pó para solução injetável', 'Pomada', 'Creme', 'Aerossol inalatório', 'Colírio',
  ];
  protected readonly routes = [
    'Oral', 'Sublingual', 'Intravenosa', 'Intramuscular', 'Subcutânea', 'Tópica', 'Inalatória', 'Nasal',
    'Oftálmica', 'Otológica', 'Retal', 'Vaginal', 'Transdérmica',
  ];
  protected readonly frequencies = [
    '1 vez ao dia', '12 em 12 horas', '8 em 8 horas', '6 em 6 horas', '4 em 4 horas', 'Se necessário',
  ];

  protected get isEdit(): boolean {
    return !!this.id();
  }

  protected get items() {
    return this.form.controls.items;
  }

  protected get type(): PrescriptionType {
    return this.form.controls.type.value;
  }

  ngOnInit(): void {
    this.listPatients.execute().subscribe({
      next: (patients) => this.patients.set(patients),
      error: (err) => this.error.set(toErrorMessage(err)),
    });

    const id = this.id();
    if (id) {
      this.getPrescription.execute(Number(id)).subscribe({
        next: (prescription) => this.formFactory.fill(this.form, prescription),
        error: (err) => this.error.set(toErrorMessage(err)),
      });
    } else {
      this.addItem();
    }
  }

  protected addItem(): void {
    this.items.push(this.formFactory.createItem());
  }

  protected removeItem(index: number): void {
    this.items.removeAt(index);
  }

  protected selectMedication(item: ItemForm, medication: Medication): void {
    this.formFactory.applyMedication(item, medication);
  }

  protected useFreeName(item: ItemForm, name: string): void {
    this.formFactory.useFreeMedicationName(item, name);
  }

  protected clearMedication(item: ItemForm): void {
    item.patchValue({ medicationId: null, medicationName: '' });
  }

  protected invalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    this.error.set(null);

    const headerControls = ['patientId', 'prescriberName', 'prescriberCouncil', 'prescriberCouncilNumber', 'prescriberCouncilState'] as const;
    const headerInvalid = headerControls.some((name) => this.form.controls[name].invalid);
    const itemsInvalid = this.type === 'Structured' && this.items.invalid;

    if (headerInvalid || itemsInvalid) {
      this.form.markAllAsTouched();
      this.error.set('Preencha corretamente os campos destacados.');
      return;
    }

    this.saving.set(true);
    const id = this.id() ? Number(this.id()) : undefined;

    this.savePrescription.execute(this.formFactory.toModel(this.form), id).subscribe({
      next: (saved) => this.router.navigate(['/prescriptions', saved.id]),
      error: (err) => {
        this.saving.set(false);
        this.error.set(err instanceof PrescriptionValidationError ? err.message : toErrorMessage(err));
      },
    });
  }
}
