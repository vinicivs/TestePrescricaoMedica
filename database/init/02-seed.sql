SET NAMES utf8mb4;

INSERT INTO patients (full_name, cpf, birth_date, sex) VALUES
    ('Maria Aparecida da Silva', '52998224725', '1958-03-14', 'Female'),
    ('João Pedro Oliveira',      '11144477735', '1985-07-22', 'Male'),
    ('Ana Beatriz Costa',        '39053344705', '1992-11-02', 'Female'),
    ('Carlos Eduardo Lima',      '87748248800', '1974-01-30', 'Male'),
    ('Fernanda Rocha Martins',   '15350946056', '2001-05-18', 'Female'),
    ('Rafael Souza Andrade',     '74682489070', '1967-09-09', 'Male');

INSERT INTO medications (name, active_ingredient, pharmaceutical_form, concentration) VALUES
    ('Dipirona Sódica',         'Dipirona monoidratada',         'Comprimido',          '500 mg'),
    ('Dipirona Sódica',         'Dipirona monoidratada',         'Solução oral (gotas)', '500 mg/mL'),
    ('Paracetamol',             'Paracetamol',                   'Comprimido',          '750 mg'),
    ('Ibuprofeno',              'Ibuprofeno',                    'Comprimido revestido', '600 mg'),
    ('Amoxicilina',             'Amoxicilina tri-hidratada',     'Cápsula',             '500 mg'),
    ('Amoxicilina + Clavulanato','Amoxicilina + ácido clavulânico','Comprimido revestido', '875 mg + 125 mg'),
    ('Azitromicina',            'Azitromicina di-hidratada',     'Comprimido revestido', '500 mg'),
    ('Losartana Potássica',     'Losartana potássica',           'Comprimido revestido', '50 mg'),
    ('Hidroclorotiazida',       'Hidroclorotiazida',             'Comprimido',          '25 mg'),
    ('Metformina',              'Cloridrato de metformina',      'Comprimido',          '850 mg'),
    ('Sinvastatina',            'Sinvastatina',                  'Comprimido revestido', '20 mg'),
    ('Omeprazol',               'Omeprazol',                     'Cápsula',             '20 mg'),
    ('Prednisona',              'Prednisona',                    'Comprimido',          '20 mg'),
    ('Loratadina',              'Loratadina',                    'Comprimido',          '10 mg'),
    ('Salbutamol',              'Sulfato de salbutamol',         'Aerossol inalatório', '100 mcg/dose'),
    ('Ceftriaxona',             'Ceftriaxona dissódica',         'Pó para solução injetável', '1 g');

INSERT INTO prescriptions (patient_id, type, free_text, prescriber_name, prescriber_council,
                           prescriber_council_number, prescriber_council_state, issued_at)
VALUES
    (1, 'Structured', NULL, 'Dra. Juliana Mendes', 'CRM', '123456', 'SP', '2026-11-10 14:30:00'),
    (2, 'Unstructured',
     'Uso oral:\n1. Paracetamol 750 mg — tomar 1 comprimido de 6 em 6 horas se dor ou febre, por até 3 dias.\n2. Repouso relativo e hidratação abundante.',
     'Dr. Ricardo Alves', 'CRM', '654321', 'RJ', '2026-11-12 09:15:00'),
    (4, 'Structured', NULL, 'Dra. Juliana Mendes', 'CRM', '123456', 'SP', '2026-11-18 16:45:00');

INSERT INTO prescription_items (prescription_id, medication_id, medication_name, pharmaceutical_form, dose, dose_unit,
                                frequency, start_date, duration_days, continuous_use, administration_route,
                                usage_deadline, notes)
VALUES
    (1, 8,  'Losartana Potássica 50 mg', 'Comprimido revestido', 1, 'comprimido', '1 vez ao dia',     '2026-11-10', NULL, 1, 'Oral', NULL, 'Tomar pela manhã.'),
    (1, 9,  'Hidroclorotiazida 25 mg',   'Comprimido',           1, 'comprimido', '1 vez ao dia',     '2026-11-10', NULL, 1, 'Oral', NULL, NULL),
    (3, 5,  'Amoxicilina 500 mg',        'Cápsula',              500, 'mg',       '8 em 8 horas',     '2026-11-18', 7, 0, 'Oral', '2026-11-25', 'Completar o tratamento mesmo com melhora dos sintomas.'),
    (3, NULL, 'Própolis 11% (manipulado)', 'Solução oral',       20, 'gotas',     '12 em 12 horas',   '2026-11-18', 10, 0, 'Oral', NULL, 'Medicamento manipulado, não padronizado na instituição.');
