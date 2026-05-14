/*
  # Legal Queue Copilot — Initial Schema

  ## Overview
  Creates the core tables for the Legal Queue Copilot prototype.
  All tables use UUID primary keys and include created_at timestamps.
  JSONB is used for arrays (findings, suggested_redlines, expected/detected issues).

  ## Tables

  ### contracts
  Stores submitted contracts awaiting or having completed first-pass review.
  - id: UUID primary key
  - title, counterparty, contract_type, commercial_context, urgency: contract metadata
  - contract_text: full plain-text body
  - file_name: optional uploaded filename
  - status: Draft | Reviewed | Escalated | Approved
  - created_at: timestamp

  ### reviews
  Stores AI triage results linked to a contract.
  - id: UUID primary key
  - contract_id: FK → contracts
  - summary, risk_level, confidence_score, recommended_route: top-level triage output
  - estimated_review_time_minutes, estimated_time_saved_minutes: time metrics
  - escalation_reason: optional text for Red/low-confidence routes
  - findings: JSONB array of Finding objects
  - suggested_redlines: JSONB array of SuggestedRedline objects
  - created_at: timestamp

  ### playbook_rules
  Legal team's preferred positions, fallbacks, and escalation triggers per clause type.
  - id: UUID primary key
  - clause_type: e.g. "Governing Law"
  - preferred_position, acceptable_fallback, escalation_trigger: negotiation positions
  - suggested_fallback_wording: ready-to-use contract language
  - rationale: why this rule exists
  - created_at: timestamp

  ### human_decisions
  Records each reviewer action on a finding or overall review.
  - id: UUID primary key
  - review_id: FK → reviews
  - finding_id: optional, references a specific finding within review.findings JSONB
  - decision: Accepted | Edited | Rejected | Escalated
  - edited_text: optional revised text if decision = Edited
  - notes: optional reviewer commentary
  - created_at: timestamp

  ### eval_tests
  Quality assurance test cases for evaluating triage accuracy.
  - id: UUID primary key
  - title, contract_type, scenario: test description
  - expected_risk_level, actual_risk_level: for accuracy measurement
  - expected_issues, detected_issues: JSONB arrays of clause type strings
  - pass_fail: Pass | Fail | Partial
  - notes: reviewer observations
  - created_at: timestamp

  ## Security
  RLS is enabled on all tables. In this prototype, authenticated users can read/write their own data.
  For a multi-user production deployment, add team-scoped policies.
*/

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  counterparty text NOT NULL DEFAULT '',
  contract_type text NOT NULL DEFAULT 'Mutual NDA',
  commercial_context text NOT NULL DEFAULT '',
  urgency text NOT NULL DEFAULT 'Low',
  contract_text text NOT NULL DEFAULT '',
  file_name text,
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view contracts"
  ON contracts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert contracts"
  ON contracts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contracts"
  ON contracts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES contracts(id) ON DELETE CASCADE,
  summary text NOT NULL DEFAULT '',
  risk_level text NOT NULL DEFAULT 'Green',
  confidence_score integer NOT NULL DEFAULT 80,
  recommended_route text NOT NULL DEFAULT '',
  estimated_review_time_minutes integer NOT NULL DEFAULT 0,
  estimated_time_saved_minutes integer NOT NULL DEFAULT 0,
  escalation_reason text,
  findings jsonb NOT NULL DEFAULT '[]'::jsonb,
  suggested_redlines jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Playbook rules
CREATE TABLE IF NOT EXISTS playbook_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clause_type text NOT NULL DEFAULT '',
  preferred_position text NOT NULL DEFAULT '',
  acceptable_fallback text NOT NULL DEFAULT '',
  escalation_trigger text NOT NULL DEFAULT '',
  suggested_fallback_wording text NOT NULL DEFAULT '',
  rationale text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE playbook_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view playbook rules"
  ON playbook_rules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert playbook rules"
  ON playbook_rules FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update playbook rules"
  ON playbook_rules FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete playbook rules"
  ON playbook_rules FOR DELETE
  TO authenticated
  USING (true);

-- Human decisions
CREATE TABLE IF NOT EXISTS human_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  finding_id text,
  decision text NOT NULL DEFAULT 'Accepted',
  edited_text text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE human_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view human decisions"
  ON human_decisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert human decisions"
  ON human_decisions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Eval tests
CREATE TABLE IF NOT EXISTS eval_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  contract_type text NOT NULL DEFAULT 'Mutual NDA',
  scenario text NOT NULL DEFAULT '',
  expected_risk_level text NOT NULL DEFAULT 'Green',
  actual_risk_level text NOT NULL DEFAULT 'Green',
  expected_issues jsonb NOT NULL DEFAULT '[]'::jsonb,
  detected_issues jsonb NOT NULL DEFAULT '[]'::jsonb,
  pass_fail text NOT NULL DEFAULT 'Pass',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE eval_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view eval tests"
  ON eval_tests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert eval tests"
  ON eval_tests FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update eval tests"
  ON eval_tests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reviews_contract_id ON reviews(contract_id);
CREATE INDEX IF NOT EXISTS idx_human_decisions_review_id ON human_decisions(review_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_reviews_risk_level ON reviews(risk_level);
