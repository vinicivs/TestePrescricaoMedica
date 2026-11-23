import { PrescriptionItem } from '../models/prescription';
import { validateFreeText, validateItem, validateStructuredItems } from './prescription.rules';

const validItem: PrescriptionItem = {
  medicationId: 1,
  medicationName: 'Amoxicilina 500 mg',
  pharmaceuticalForm: 'Cápsula',
  dose: 500,
  doseUnit: 'mg',
  frequency: '8 em 8 horas',
  startDate: '2026-01-10',
  durationDays: 7,
  continuousUse: false,
  administrationRoute: 'Oral',
  usageDeadline: null,
  notes: null,
};

describe('prescription rules', () => {
  it('ECF.10.01 requires free text', () => {
    expect(validateFreeText('   ')).toContain('ECF.10.01');
    expect(validateFreeText('Repouso')).toBeNull();
  });

  it('ECF.10.03 requires at least one item', () => {
    expect(validateStructuredItems([])).toContain('ECF.10.03');
  });

  it('ECF.10.03 rejects the same catalogued medication twice', () => {
    expect(validateStructuredItems([validItem, validItem])).toContain('mais de uma vez');
    expect(validateStructuredItems([validItem, { ...validItem, medicationId: null }])).toBeNull();
  });

  it('accepts a complete item', () => {
    expect(validateItem(validItem)).toEqual([]);
  });

  it('requires duration unless continuous use', () => {
    expect(validateItem({ ...validItem, durationDays: null })).not.toEqual([]);
    expect(validateItem({ ...validItem, durationDays: null, continuousUse: true })).toEqual([]);
    expect(validateItem({ ...validItem, continuousUse: true })).not.toEqual([]);
  });

  it('rejects a usage deadline before the start date', () => {
    expect(validateItem({ ...validItem, usageDeadline: '2026-01-01' })).not.toEqual([]);
  });
});
