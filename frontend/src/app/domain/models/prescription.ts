export type PrescriptionType = 'Unstructured' | 'Structured';

export interface Prescriber {
  name: string;
  council: string;
  councilNumber: string;
  councilState: string;
}

export interface PrescriptionItem {
  id?: number;
  medicationId: number | null;
  medicationName: string;
  pharmaceuticalForm: string;
  dose: number;
  doseUnit: string;
  frequency: string;
  startDate: string;
  durationDays: number | null;
  continuousUse: boolean;
  administrationRoute: string;
  usageDeadline: string | null;
  notes: string | null;
}

export interface Prescription {
  id: number;
  patientId: number;
  patientName: string;
  prescriber: Prescriber;
  type: PrescriptionType;
  freeText: string | null;
  issuedAt: string;
  updatedAt: string | null;
  items: PrescriptionItem[];
}

export interface PrescriptionSummary {
  id: number;
  patientName: string;
  prescriberName: string;
  type: PrescriptionType;
  issuedAt: string;
  itemCount: number;
}

export interface SavePrescription {
  patientId: number;
  prescriber: Prescriber;
  type: PrescriptionType;
  freeText: string | null;
  items: PrescriptionItem[];
}

export const PRESCRIPTION_TYPE_LABELS: Record<PrescriptionType, string> = {
  Unstructured: 'Texto livre',
  Structured: 'Estruturada',
};
