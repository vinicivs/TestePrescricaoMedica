import { Prescription, PrescriptionItem, PrescriptionSummary, PrescriptionType, SavePrescription } from '../../domain/models/prescription';

export interface PrescriptionItemDto {
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

export interface PrescriptionDto {
  id: number;
  patientId: number;
  patientName: string;
  prescriberName: string;
  prescriberCouncil: string;
  prescriberCouncilNumber: string;
  prescriberCouncilState: string;
  type: PrescriptionType;
  freeText: string | null;
  issuedAt: string;
  updatedAt: string | null;
  items: PrescriptionItemDto[];
}

export interface PrescriptionSummaryODataDto {
  Id: number;
  PatientName: string;
  PrescriberName: string;
  Type: PrescriptionType;
  IssuedAt: string;
  ItemCount: number;
}

export interface SavePrescriptionDto {
  patientId: number;
  prescriberName: string;
  prescriberCouncil: string;
  prescriberCouncilNumber: string;
  prescriberCouncilState: string;
  type: PrescriptionType;
  freeText: string | null;
  items: PrescriptionItemDto[];
}

export const PrescriptionMapper = {
  toDomain(dto: PrescriptionDto): Prescription {
    return {
      id: dto.id,
      patientId: dto.patientId,
      patientName: dto.patientName,
      prescriber: {
        name: dto.prescriberName,
        council: dto.prescriberCouncil,
        councilNumber: dto.prescriberCouncilNumber,
        councilState: dto.prescriberCouncilState,
      },
      type: dto.type,
      freeText: dto.freeText,
      issuedAt: dto.issuedAt,
      updatedAt: dto.updatedAt,
      items: dto.items.map((item) => ({ ...item })),
    };
  },

  summaryToDomain(dto: PrescriptionSummaryODataDto): PrescriptionSummary {
    return {
      id: dto.Id,
      patientName: dto.PatientName,
      prescriberName: dto.PrescriberName,
      type: dto.Type,
      issuedAt: dto.IssuedAt,
      itemCount: dto.ItemCount,
    };
  },

  toRequest(model: SavePrescription): SavePrescriptionDto {
    const structured = model.type === 'Structured';
    return {
      patientId: model.patientId,
      prescriberName: model.prescriber.name,
      prescriberCouncil: model.prescriber.council,
      prescriberCouncilNumber: model.prescriber.councilNumber,
      prescriberCouncilState: model.prescriber.councilState,
      type: model.type,
      freeText: structured ? null : model.freeText,
      items: structured ? model.items.map(toItemRequest) : [],
    };
  },
};

function toItemRequest(item: PrescriptionItem): PrescriptionItemDto {
  return {
    medicationId: item.medicationId,
    medicationName: item.medicationName,
    pharmaceuticalForm: item.pharmaceuticalForm,
    dose: Number(item.dose),
    doseUnit: item.doseUnit,
    frequency: item.frequency,
    startDate: item.startDate,
    durationDays: item.continuousUse ? null : item.durationDays,
    continuousUse: item.continuousUse,
    administrationRoute: item.administrationRoute,
    usageDeadline: item.usageDeadline || null,
    notes: item.notes?.trim() || null,
  };
}
