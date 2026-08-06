#!/bin/sh

echo "Waiting for postgres..."
# Try to connect to PostgreSQL using pg_isready
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER
do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL started"

exec "$@" 