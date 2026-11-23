import { inject, Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Medication, medicationDisplayName } from '../../domain/models/medication';
import { Prescription, PrescriptionItem, PrescriptionType, SavePrescription } from '../../domain/models/prescription';
import { FREE_TEXT_MAX_LENGTH, MAX_DURATION_DAYS } from '../../domain/rules/prescription.rules';

export type ItemForm = FormGroup<{
  medicationId: FormControl<number | null>;
  medicationName: FormControl<string>;
  pharmaceuticalForm: FormControl<string>;
  dose: FormControl<number | null>;
  doseUnit: FormControl<string>;
  frequency: FormControl<string>;
  startDate: FormControl<string>;
  durationDays: FormControl<number | null>;
  continuousUse: FormControl<boolean>;
  administrationRoute: FormControl<string>;
  usageDeadline: FormControl<string | null>;
  notes: FormControl<string | null>;
}>;

export type PrescriptionForm = FormGroup<{
  patientId: FormControl<number | null>;
  prescriberName: FormControl<string>;
  prescriberCouncil: FormControl<string>;
  prescriberCouncilNumber: FormControl<string>;
  prescriberCouncilState: FormControl<string>;
  type: FormControl<PrescriptionType>;
  freeText: FormControl<string>;
  items: FormArray<ItemForm>;
}>;

export function today(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

@Injectable({ providedIn: 'root' })
export class PrescriptionFormFactory {
  private readonly fb = inject(NonNullableFormBuilder);

  createForm(): PrescriptionForm {
    return this.fb.group({
      patientId: new FormControl<number | null>(null, Validators.required),
      prescriberName: this.fb.control('', [Validators.required, Validators.maxLength(150)]),
      prescriberCouncil: this.fb.control('CRM', [Validators.required, Validators.maxLength(10)]),
      prescriberCouncilNumber: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      prescriberCouncilState: this.fb.control('', [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)]),
      type: this.fb.control<PrescriptionType>('Structured'),
      freeText: this.fb.control('', Validators.maxLength(FREE_TEXT_MAX_LENGTH)),
      items: this.fb.array<ItemForm>([]),
    });
  }

  createItem(item?: Partial<PrescriptionItem>): ItemForm {
    const form: ItemForm = this.fb.group({
      medicationId: new FormControl<number | null>(item?.medicationId ?? null),
      medicationName: this.fb.control(item?.medicationName ?? '', [Validators.required, Validators.maxLength(200)]),
      pharmaceuticalForm: this.fb.control(item?.pharmaceuticalForm ?? '', [Validators.required, Validators.maxLength(50)]),
      dose: new FormControl<number | null>(item?.dose ?? null, [Validators.required, Validators.min(0.001)]),
      doseUnit: this.fb.control(item?.doseUnit ?? '', [Validators.required, Validators.maxLength(20)]),
      frequency: this.fb.control(item?.frequency ?? '', [Validators.required, Validators.maxLength(60)]),
      startDate: this.fb.control(item?.startDate ?? today(), Validators.required),
      durationDays: new FormControl<number | null>(item?.durationDays ?? null, [
        Validators.min(1),
        Validators.max(MAX_DURATION_DAYS),
      ]),
      continuousUse: this.fb.control(item?.continuousUse ?? false),
      administrationRoute: this.fb.control(item?.administrationRoute ?? 'Oral', [Validators.required, Validators.maxLength(40)]),
      usageDeadline: new FormControl<string | null>(item?.usageDeadline ?? null),
      notes: new FormControl<string | null>(item?.notes ?? null, Validators.maxLength(1000)),
    });

    this.syncDuration(form);
    form.controls.continuousUse.valueChanges.subscribe(() => this.syncDuration(form));

    return form;
  }

  applyMedication(item: ItemForm, medication: Medication): void {
    item.patchValue({
      medicationId: medication.id,
      medicationName: medicationDisplayName(medication),
      pharmaceuticalForm: medication.pharmaceuticalForm,
    });
  }

  useFreeMedicationName(item: ItemForm, name: string): void {
    item.patchValue({ medicationId: null, medicationName: name.trim() });
  }

  fill(form: PrescriptionForm, prescription: Prescription): void {
    form.patchValue({
      patientId: prescription.patientId,
      prescriberName: prescription.prescriber.name,
      prescriberCouncil: prescription.prescriber.council,
      prescriberCouncilNumber: prescription.prescriber.councilNumber,
      prescriberCouncilState: prescription.prescriber.councilState,
      type: prescription.type,
      freeText: prescription.freeText ?? '',
    });

    form.controls.items.clear();
    prescription.items.forEach((item) => form.controls.items.push(this.createItem(item)));
  }

  toModel(form: PrescriptionForm): SavePrescription {
    const value = form.getRawValue();

    return {
      patientId: value.patientId ?? 0,
      prescriber: {
        name: value.prescriberName.trim(),
        council: value.prescriberCouncil.trim().toUpperCase(),
        councilNumber: value.prescriberCouncilNumber.trim(),
        councilState: value.prescriberCouncilState.trim().toUpperCase(),
      },
      type: value.type,
      freeText: value.type === 'Unstructured' ? value.freeText : null,
      items:
        value.type === 'Structured'
          ? value.items.map((item) => ({
              ...item,
              dose: item.dose ?? 0,
              durationDays: item.continuousUse ? null : item.durationDays,
            }))
          : [],
    };
  }

  private syncDuration(form: ItemForm): void {
    const duration = form.controls.durationDays;
    if (form.controls.continuousUse.value) {
      duration.setValue(null);
      duration.disable({ emitEvent: false });
    } else {
      duration.enable({ emitEvent: false });
    }
  }
}
