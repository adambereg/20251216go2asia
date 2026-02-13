-- =====================================================================
-- 01_schema_inventory.sql
-- Neon Schema Inventory: Tables, Columns, Constraints, Indexes, Enums
-- =====================================================================
-- 
-- Purpose: Complete inventory of database schema structure
-- Usage: Run in Neon Console SQL Editor or via psql
-- 
-- Output: Structured information about all tables, columns, constraints,
--         indexes, and enum types in the database.
-- =====================================================================

\echo '====================================================================='
\echo 'SCHEMA INVENTORY: Tables and Views'
\echo '====================================================================='

SELECT 
    table_schema,
    table_name,
    table_type,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_schema)||'.'||quote_ident(table_name))) AS size
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY table_schema, table_name;

\echo ''
\echo '====================================================================='
\echo 'SCHEMA INVENTORY: Columns by Table'
\echo '====================================================================='

SELECT 
    table_schema,
    table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns
WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY table_schema, table_name, ordinal_position;

\echo ''
\echo '====================================================================='
\echo 'SCHEMA INVENTORY: Primary Keys'
\echo '====================================================================='

SELECT 
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY tc.table_schema, tc.table_name, kcu.ordinal_position;

\echo ''
\echo '====================================================================='
\echo 'SCHEMA INVENTORY: Unique Constraints'
\echo '====================================================================='

SELECT 
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
GROUP BY tc.table_schema, tc.table_name, tc.constraint_name
ORDER BY tc.table_schema, tc.table_name, tc.constraint_name;

\echo ''
\echo '====================================================================='
\echo 'SCHEMA INVENTORY: Foreign Keys'
\echo '====================================================================='

SELECT 
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY tc.table_schema, tc.table_name, kcu.ordinal_position;

\echo ''
\echo '====================================================================='
\echo 'SCHEMA INVENTORY: Indexes'
\echo '====================================================================='

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY schemaname, tablename, indexname;

\echo ''
\echo '====================================================================='
\echo 'SCHEMA INVENTORY: Enum Types'
\echo '====================================================================='

SELECT 
    t.typname AS enum_name,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname NOT LIKE 'pg_%'
GROUP BY t.typname
ORDER BY t.typname;

\echo ''
\echo '====================================================================='
\echo 'SCHEMA INVENTORY: Table Sizes (Top 20)'
\echo '====================================================================='

SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

\echo ''
\echo '====================================================================='
\echo 'SCHEMA INVENTORY: Summary'
\echo '====================================================================='

SELECT 
    'Tables' AS object_type,
    COUNT(*) AS count
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND table_type = 'BASE TABLE'
UNION ALL
SELECT 
    'Views' AS object_type,
    COUNT(*) AS count
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND table_type = 'VIEW'
UNION ALL
SELECT 
    'Indexes' AS object_type,
    COUNT(*) AS count
FROM pg_indexes
WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
UNION ALL
SELECT 
    'Foreign Keys' AS object_type,
    COUNT(*) AS count
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
UNION ALL
SELECT 
    'Enum Types' AS object_type,
    COUNT(DISTINCT t.typname) AS count
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname NOT LIKE 'pg_%';
