export interface Medication {
  id: number;
  name: string;
  activeIngredient: string;
  pharmaceuticalForm: string;
  concentration: string | null;
}

export function medicationDisplayName(medication: Medication): string {
  return medication.concentration ? `${medication.name} ${medication.concentration}` : medication.name;
}
