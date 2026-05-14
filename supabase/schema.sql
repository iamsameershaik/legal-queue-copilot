-- Legal Queue Copilot — Database Schema
-- Apply this in the Supabase SQL editor or via CLI: supabase db push
-- See docs/ARCHITECTURE_AND_DATA_FLOW.md for full schema rationale

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

CREATE INDEX IF NOT EXISTS idx_reviews_contract_id ON reviews(contract_id);
CREATE INDEX IF NOT EXISTS idx_human_decisions_review_id ON human_decisions(review_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_reviews_risk_level ON reviews(risk_level);
