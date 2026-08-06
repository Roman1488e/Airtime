# Airtime B2B Platform Backend

Django-based backend for Airtime B2B platform with multi-language support and modern API documentation.

## 🚀 Quick Start

### Prerequisites

- Docker installed
- PostgreSQL server running
- Redis server running
- `.env` file configured

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:

```env
SECRET_KEY=your-secret-key
DEBUG=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=airtime_db
DB_USER=airtime_user
DB_PASS=your-password
DB_HOST=your-db-host
DB_PORT=5432
REDIS_HOST=your-redis-host
REDIS_PORT=6379
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
```

### Building and Running

1. Build Docker image:

```bash
docker build -t airtime-backend .
```

2. Run container:

```bash
docker run -d \
  --name airtime-backend \
  -p 8000:8000 \
  --env-file .env \
  -v $(pwd)/media:/app/media \
  -v $(pwd)/staticfiles:/app/staticfiles \
  airtime-backend
```

### Development Commands

Check logs:

```bash
docker logs -f airtime-backend
```

Execute management commands:

```bash
docker exec -it airtime-backend python manage.py createsuperuser
```

### API Documentation

After running the container, access:

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

## 📁 Project Structure

```
airtime/
├── apps/
│   ├── about/       # About pages, FAQs, Company info
│   └── product/     # Products, Categories, Banners
├── config/          # Project settings
├── media/          # User uploaded files
├── staticfiles/    # Static files
└── locale/         # Translation files
```

## 🔧 Features

- Multi-language support (UZ, RU, EN)
- PostgreSQL database
- Redis caching
- CKEditor 5 integration
- DRF Spectacular API docs
- JWT Authentication
- Docker deployment ready

## 📝 Notes

- Static and media files are mounted as volumes
- Gunicorn is configured with 3 workers and 2 threads per worker
- Database migrations run automatically on startup
- Healthcheck ensures PostgreSQL is ready before starting

## 🔐 Security

- Debug mode should be False in production
- Use strong SECRET_KEY
- Configure ALLOWED_HOSTS properly
- Set up proper CORS settings
- Use HTTPS in production

## 🆘 Troubleshooting

If container fails to start:

1. Check PostgreSQL connection
2. Verify environment variables
3. Check logs: `docker logs airtime-backend`
4. Ensure proper permissions for media and static volumes
