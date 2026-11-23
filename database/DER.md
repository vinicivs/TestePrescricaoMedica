# DER – Prescrição Médica

```mermaid
erDiagram
    PATIENTS ||--o{ PRESCRIPTIONS : "possui"
    PRESCRIPTIONS ||--o{ PRESCRIPTION_ITEMS : "contém"
    MEDICATIONS |o--o{ PRESCRIPTION_ITEMS : "referenciado por"

    PATIENTS {
        int id PK
        varchar full_name
        char cpf UK
        date birth_date
        varchar sex "Female | Male | Other"
        datetime created_at
    }

    MEDICATIONS {
        int id PK
        varchar name
        varchar active_ingredient
        varchar pharmaceutical_form
        varchar concentration
    }

    PRESCRIPTIONS {
        int id PK
        int patient_id FK
        varchar type "Unstructured | Structured"
        text free_text "obrigatório se Unstructured"
        varchar prescriber_name
        varchar prescriber_council
        varchar prescriber_council_number
        char prescriber_council_state
        datetime issued_at
        datetime updated_at
    }

    PRESCRIPTION_ITEMS {
        int id PK
        int prescription_id FK
        int medication_id FK "NULL = não cadastrado"
        varchar medication_name
        varchar pharmaceutical_form
        decimal dose
        varchar dose_unit
        varchar frequency
        date start_date
        int duration_days "NULL se uso contínuo"
        tinyint continuous_use
        varchar administration_route
        date usage_deadline
        varchar notes
    }
```

## Relacionamentos e integridade

| Relação | Cardinalidade | FK / Ação |
|---|---|---|
| Paciente → Prescrição | 1 : N | `prescriptions.patient_id` → `patients.id` (`ON DELETE RESTRICT`) |
| Prescrição → Item | 1 : N | `prescription_items.prescription_id` → `prescriptions.id` (`ON DELETE CASCADE`) |
| Medicamento → Item | 0..1 : N | `prescription_items.medication_id` → `medications.id` (`ON DELETE RESTRICT`, coluna anulável) |

Restrições `CHECK` no banco reforçam as regras de negócio:

- `ck_prescriptions_free_text`: receita `Unstructured` exige `free_text`; `Structured` não tem `free_text`.
- `ck_prescription_items_dose`: `dose > 0`.
- `ck_prescription_items_duration`: uso contínuo ⇒ sem duração; senão, duração entre 1 e 365 dias.
- `ck_prescription_items_deadline`: prazo de utilização ≥ início do tratamento.

Scripts: [`init/01-schema.sql`](init/01-schema.sql) (estrutura) e [`init/02-seed.sql`](init/02-seed.sql) (pacientes, medicamentos e prescrições de exemplo).
