# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings
ENV PIP_DEFAULT_TIMEOUT=300

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    gettext \
    postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create directories
RUN mkdir -p /app/staticfiles \
    && mkdir -p /app/media \
    && mkdir -p /app/locale \
    && mkdir -p /app/static \
    && mkdir -p /app/static/ckeditor \
    && mkdir -p /app/media/uploads/ckeditor

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --retries 10 -r requirements.txt

# Copy project files
COPY . .

# Create .env file with required variables
RUN echo "SECRET_KEY='django-insecure-temporary-key-for-build'" > .env && \
    echo "DEBUG=True" >> .env && \
    echo "BOT_TOKEN=7753057059:AAGAkddnZ0MwoaOaaUJQjP02iw7mBToYvFg" >> .env && \
    echo "USER_IDS=1835816946 6812140791 686980246" >> .env && \
    echo "DB_ENGINE=django.db.backends.postgresql" >> .env && \
    echo "DB_NAME=airtime_db" >> .env && \
    echo "DB_USER=airtime_user" >> .env && \
    echo "DB_PASS=airtime_password" >> .env && \
    echo "DB_HOST=db" >> .env && \
    echo "DB_PORT=5432" >> .env

# Make entrypoint script executable and set proper permissions
RUN chmod +x /app/entrypoint.sh && \
    chown -R www-data:www-data /app

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Set entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Default command (can be overridden in docker-compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 