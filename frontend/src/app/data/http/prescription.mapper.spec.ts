import { SavePrescription } from '../../domain/models/prescription';
import { PrescriptionMapper } from './prescription.mapper';

const base: SavePrescription = {
  patientId: 1,
  prescriber: { name: 'Dra. Ana', council: 'CRM', councilNumber: '123', councilState: 'SP' },
  type: 'Unstructured',
  freeText: 'Repouso',
  items: [
    {
      medicationId: null,
      medicationName: 'Manipulado',
      pharmaceuticalForm: 'Cápsula',
      dose: 1,
      doseUnit: 'cápsula',
      frequency: '1 vez ao dia',
      startDate: '2026-01-10',
      durationDays: 10,
      continuousUse: true,
      administrationRoute: 'Oral',
      usageDeadline: '',
      notes: '  ',
    },
  ],
};

describe('PrescriptionMapper.toRequest', () => {
  it('drops items for unstructured prescriptions', () => {
    const request = PrescriptionMapper.toRequest(base);

    expect(request.items).toEqual([]);
    expect(request.freeText).toBe('Repouso');
    expect(request.prescriberCouncilState).toBe('SP');
  });

  it('drops free text and normalizes items for structured prescriptions', () => {
    const request = PrescriptionMapper.toRequest({ ...base, type: 'Structured' });

    expect(request.freeText).toBeNull();
    expect(request.items[0].durationDays).toBeNull();
    expect(request.items[0].usageDeadline).toBeNull();
    expect(request.items[0].notes).toBeNull();
  });
});
