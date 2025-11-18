-- Create the github_webhooks table
CREATE TABLE IF NOT EXISTS github_webhooks (
    id SERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_github_webhooks_created_at ON github_webhooks(created_at);

-- Create an index on payload for JSONB queries
CREATE INDEX IF NOT EXISTS idx_github_webhooks_payload ON github_webhooks USING GIN(payload);
