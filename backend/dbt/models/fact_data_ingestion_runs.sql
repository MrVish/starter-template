{{ config(materialized='incremental', unique_key='id') }}

WITH ingestion_runs AS (
    -- Data ingestion run information
    -- In a real implementation, this would come from ETL logs
    SELECT 
        ir.run_id,
        ir.data_source_id,
        ir.start_time,
        ir.end_time,
        ir.status,
        ir.records_processed,
        ir.records_succeeded,
        ir.records_failed,
        ir.error_message,
        ir.file_name,
        ir.load_timestamp
    FROM stg.stg_data_ingestion_runs ir
)

SELECT
    ir.run_id AS id,
    -- Foreign keys
    ir.data_source_id AS source_key,
    dd.id AS date_key,
    
    -- Run details
    ir.start_time AS run_start_time,
    ir.end_time AS run_end_time,
    ir.status,
    ir.records_processed,
    ir.records_succeeded,
    ir.records_failed,
    ir.error_message,
    ir.file_name,
    
    -- Derived metrics
    DATE_PART('minute', ir.end_time - ir.start_time) AS run_duration_minutes,
    
    CASE 
        WHEN ir.records_processed > 0 
        THEN ROUND((ir.records_succeeded::NUMERIC / ir.records_processed) * 100, 2)
        ELSE 0
    END AS success_rate,
    
    CASE
        WHEN ir.status = 'COMPLETED' AND ir.records_failed = 0 THEN 'SUCCESS'
        WHEN ir.status = 'COMPLETED' AND ir.records_failed > 0 
            AND ir.records_succeeded > 0 THEN 'PARTIAL_SUCCESS'
        WHEN ir.status = 'FAILED' THEN 'FAILURE'
        WHEN ir.status = 'RUNNING' THEN 'IN_PROGRESS'
        ELSE ir.status
    END AS run_result,
    
    -- Metadata
    ir.load_timestamp AS load_dts
FROM ingestion_runs ir
-- Join to dimension tables
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = DATE(ir.start_time)
JOIN {{ ref('dim_data_sources') }} ds ON ds.id = ir.data_source_id

{% if is_incremental() %}
  WHERE ir.load_timestamp > (SELECT max(load_dts) FROM {{ this }})
{% endif %} 