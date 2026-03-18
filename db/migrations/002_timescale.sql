CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable('check_results', 'checked_at');

-- Continuous aggregate for dashboard queries
CREATE MATERIALIZED VIEW check_summary_1min
WITH (timescaledb.continuous) AS
SELECT
  monitor_id,
  time_bucket('1 minute', checked_at) AS bucket,
  AVG(response_ms) AS avg_response_ms,
  COUNT(*) AS total_checks,
  COUNT(*) FILTER (WHERE status_ok) AS ok_checks
FROM check_results
GROUP BY monitor_id, bucket;