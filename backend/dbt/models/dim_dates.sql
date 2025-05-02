{{ config(materialized='table') }}

WITH date_spine AS (
    -- Generate dates from 2020-01-01 to 2030-12-31
    -- Adjust the range as needed for your business needs
    {{ dbt_utils.date_spine(
        datepart="day",
        start_date="cast('2020-01-01' as date)",
        end_date="cast('2030-12-31' as date)"
       )
    }}
)

SELECT
    -- Primary key
    ROW_NUMBER() OVER (ORDER BY date_day) AS id,
    
    -- Date attributes
    date_day AS full_date,
    EXTRACT(YEAR FROM date_day) AS year,
    EXTRACT(MONTH FROM date_day) AS month,
    EXTRACT(DAY FROM date_day) AS day,
    
    -- Time intelligence
    EXTRACT(QUARTER FROM date_day) AS quarter,
    EXTRACT(DOW FROM date_day) AS day_of_week,
    EXTRACT(DOY FROM date_day) AS day_of_year,
    
    -- Week calculations
    TO_CHAR(date_day, 'IYYY-IW') AS year_week,
    EXTRACT(WEEK FROM date_day) AS week_of_year,
    
    -- Month names
    TO_CHAR(date_day, 'Month') AS month_name,
    TO_CHAR(date_day, 'Mon') AS month_short_name,
    
    -- Day names
    TO_CHAR(date_day, 'Day') AS day_name,
    TO_CHAR(date_day, 'Dy') AS day_short_name,
    
    -- Fiscal year (assuming fiscal year starts in April)
    CASE 
        WHEN EXTRACT(MONTH FROM date_day) >= 4 THEN EXTRACT(YEAR FROM date_day)
        ELSE EXTRACT(YEAR FROM date_day) - 1
    END AS fiscal_year,
    
    -- Is weekend flag
    CASE
        WHEN EXTRACT(DOW FROM date_day) IN (0, 6) THEN TRUE 
        ELSE FALSE
    END AS is_weekend,
    
    -- Is holiday flag (placeholder - would need a holiday calendar)
    FALSE AS is_holiday,
    
    -- Month start and end flags
    CASE WHEN EXTRACT(DAY FROM date_day) = 1 THEN TRUE ELSE FALSE END AS is_month_start,
    CASE 
        WHEN date_day = DATE_TRUNC('MONTH', date_day) + INTERVAL '1 MONTH - 1 day' 
        THEN TRUE 
        ELSE FALSE 
    END AS is_month_end,
    
    -- Quarter start and end flags
    CASE 
        WHEN date_day = DATE_TRUNC('QUARTER', date_day) 
        THEN TRUE 
        ELSE FALSE 
    END AS is_quarter_start,
    CASE 
        WHEN date_day = DATE_TRUNC('QUARTER', date_day) + INTERVAL '3 MONTH - 1 day' 
        THEN TRUE 
        ELSE FALSE 
    END AS is_quarter_end,
    
    -- Year start and end flags
    CASE WHEN TO_CHAR(date_day, 'MMDD') = '0101' THEN TRUE ELSE FALSE END AS is_year_start,
    CASE WHEN TO_CHAR(date_day, 'MMDD') = '1231' THEN TRUE ELSE FALSE END AS is_year_end
    
FROM date_spine 