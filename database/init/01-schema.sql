SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS patients (
    id          INT          NOT NULL AUTO_INCREMENT,
    full_name   VARCHAR(150) NOT NULL,
    cpf         CHAR(11)     NOT NULL,
    birth_date  DATE         NOT NULL,
    sex         VARCHAR(10)  NOT NULL,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT pk_patients PRIMARY KEY (id),
    CONSTRAINT uq_patients_cpf UNIQUE (cpf),
    CONSTRAINT ck_patients_sex CHECK (sex IN ('Female', 'Male', 'Other'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS medications (
    id                  INT          NOT NULL AUTO_INCREMENT,
    name                VARCHAR(150) NOT NULL,
    active_ingredient   VARCHAR(150) NOT NULL,
    pharmaceutical_form VARCHAR(50)  NOT NULL,
    concentration       VARCHAR(50)  NULL,
    CONSTRAINT pk_medications PRIMARY KEY (id),
    CONSTRAINT uq_medications UNIQUE (name, pharmaceutical_form, concentration),
    INDEX ix_medications_name (name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS prescriptions (
    id                        INT          NOT NULL AUTO_INCREMENT,
    patient_id                INT          NOT NULL,
    type                      VARCHAR(20)  NOT NULL,
    free_text                 TEXT         NULL,
    prescriber_name           VARCHAR(150) NOT NULL,
    prescriber_council        VARCHAR(10)  NOT NULL,
    prescriber_council_number VARCHAR(20)  NOT NULL,
    prescriber_council_state  CHAR(2)      NOT NULL,
    issued_at                 DATETIME(6)  NOT NULL,
    updated_at                DATETIME(6)  NULL,
    CONSTRAINT pk_prescriptions PRIMARY KEY (id),
    CONSTRAINT fk_prescriptions_patient FOREIGN KEY (patient_id)
        REFERENCES patients (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_prescriptions_type CHECK (type IN ('Unstructured', 'Structured')),
    CONSTRAINT ck_prescriptions_free_text CHECK (
        (type = 'Unstructured' AND free_text IS NOT NULL) OR
        (type = 'Structured' AND free_text IS NULL)
    ),
    INDEX ix_prescriptions_patient (patient_id),
    INDEX ix_prescriptions_issued_at (issued_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS prescription_items (
    id                   INT            NOT NULL AUTO_INCREMENT,
    prescription_id      INT            NOT NULL,
    medication_id        INT            NULL,
    medication_name      VARCHAR(200)   NOT NULL,
    pharmaceutical_form  VARCHAR(50)    NOT NULL,
    dose                 DECIMAL(10, 3) NOT NULL,
    dose_unit            VARCHAR(20)    NOT NULL,
    frequency            VARCHAR(60)    NOT NULL,
    start_date           DATE           NOT NULL,
    duration_days        INT            NULL,
    continuous_use       TINYINT(1)     NOT NULL DEFAULT 0,
    administration_route VARCHAR(40)    NOT NULL,
    usage_deadline       DATE           NULL,
    notes                VARCHAR(1000)  NULL,
    CONSTRAINT pk_prescription_items PRIMARY KEY (id),
    CONSTRAINT fk_prescription_items_prescription FOREIGN KEY (prescription_id)
        REFERENCES prescriptions (id) ON DELETE CASCADE,
    CONSTRAINT fk_prescription_items_medication FOREIGN KEY (medication_id)
        REFERENCES medications (id) ON DELETE RESTRICT,
    CONSTRAINT ck_prescription_items_dose CHECK (dose > 0),
    CONSTRAINT ck_prescription_items_duration CHECK (
        (continuous_use = 1 AND duration_days IS NULL) OR
        (continuous_use = 0 AND duration_days BETWEEN 1 AND 365)
    ),
    CONSTRAINT ck_prescription_items_deadline CHECK (usage_deadline IS NULL OR usage_deadline >= start_date),
    INDEX ix_prescription_items_prescription (prescription_id),
    INDEX ix_prescription_items_medication (medication_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
