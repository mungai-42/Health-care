#!/bin/sh

# PostgreSQL Database Backup script for Afya Flow Production
DB_HOST=${DATABASE_HOST:-"localhost"}
DB_PORT=${DATABASE_PORT:-5432}
DB_USER=${DATABASE_USER:-"postgres"}
DB_NAME=${DATABASE_NAME:-"afyaflow_prod"}
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/afyaflow"}

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "Starting database backup for $DB_NAME at $(date)..."

# Ensure directory exists
mkdir -p "$BACKUP_DIR"

# Execute gzipped pg_dump
# Note: Requires PG_PASSWORD / PGPASSWORD to be exported in environment
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup successfully written to $BACKUP_FILE"
else
  echo "Error: Database backup process encountered an error exit code" >&2
  exit 1
fi

# Prune dumps older than 7 days to preserve storage space
echo "Pruning backup catalogs older than 7 days..."
find "$BACKUP_DIR" -name "db_backup_${DB_NAME}_*.sql.gz" -mtime +7 -exec rm {} \;

echo "Backup maintenance cycle completed successfully at $(date)."
