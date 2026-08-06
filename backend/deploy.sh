#!/bin/bash

# Ranglar
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Airtime Backend Deployment Script${NC}"

# .env faylini tekshirish
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env fayli topilmadi!${NC}"
    exit 1
fi

# Docker o'rnatilganligini tekshirish
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker o'rnatilmagan!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Muhit tekshirildi${NC}"

# Eski container va image larni o'chirish
echo -e "${BLUE}🧹 Eski container va image larni tozalash...${NC}"
docker stop airtime-backend 2>/dev/null || true
docker rm airtime-backend 2>/dev/null || true
docker rmi airtime-backend 2>/dev/null || true

# Yangi image build qilish
echo -e "${BLUE}🏗️ Docker image build qilinmoqda...${NC}"
docker build -t airtime-backend .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Image build qilishda xatolik!${NC}"
    exit 1
fi

# Papkalarni yaratish
echo -e "${BLUE}📁 Media va static papkalarni tayyorlash...${NC}"
mkdir -p media staticfiles data
chmod 777 media staticfiles data

# Containerni ishga tushirish
echo -e "${BLUE}🚀 Container ishga tushirilmoqda...${NC}"
docker run -d \
    --name airtime-backend \
    -p 8000:8000 \
    --env-file .env \
    -v $(pwd)/media:/app/media \
    -v $(pwd)/staticfiles:/app/staticfiles \
    -v $(pwd)/data:/app/data \
    --restart unless-stopped \
    airtime-backend

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Container ishga tushirishda xatolik!${NC}"
    exit 1
fi

# Container loglarini tekshirish
echo -e "${BLUE}📝 Container loglari tekshirilmoqda...${NC}"
sleep 5
docker logs airtime-backend

echo -e "${GREEN}✅ Deployment muvaffaqiyatli yakunlandi!${NC}"
echo -e "${BLUE}ℹ️ API docs: http://localhost:8000/api/docs/${NC}"
echo -e "${BLUE}ℹ️ Admin panel: http://localhost:8000/admin/${NC}" 