from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from drf_spectacular.utils import extend_schema
from rest_framework import status
from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
import requests

from .models import Contact, Social, Service, ContactForm, FAQs, OPImage, AboutCompany, Brand, TelegramUser, TelegramBot
from .serializers import (
    ContactSerializer, SocialSerializer, ServiceSerializer,
    ContactFormSerializer, FAQsSerializer, OPImageSerializer,
    AboutCompanySerializer, BrandSerializer, TelegramUserSerializer, TelegramBotSerializer
)

def send_telegram_message(user_id, message):
    # Get active bot token from database
    active_bot = TelegramBot.objects.filter(is_active=True).first()
    if not active_bot:
        print("❌ Active Telegram bot topilmadi!")
        return

    try:
        # Get bot info first
        bot_info_url = f"https://api.telegram.org/bot{active_bot.token}/getMe"
        bot_info_response = requests.get(bot_info_url, timeout=5)
        
        if bot_info_response.status_code == 200:
            bot_data = bot_info_response.json()
            if bot_data.get('ok'):
                bot_info = bot_data.get('result', {})
                # Update bot name and username if not set
                if not active_bot.name or not active_bot.username:
                    active_bot.name = bot_info.get('first_name', '')
                    active_bot.username = bot_info.get('username', '')
                    active_bot.save()

        # Send message
        response = requests.post(
            f"https://api.telegram.org/bot{active_bot.token}/sendMessage",
            json={
                "chat_id": user_id,
                "text": message,
                "parse_mode": "HTML"
            },
            timeout=5
        )
        if response.status_code == 200:
            print(f"✅ Xabar {user_id} ga yuborildi (@{active_bot.username})")
        else:
            print(f"❌ Xatolik yuz berdi: {response.text}")
    except Exception as e:
        print(f"❌ Telegram xato: {e}")

# 1. Contacts
class ContactListView(ListAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    @extend_schema(tags=["about - contact"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# 2. Socials
class SocialListView(ListAPIView):
    queryset = Social.objects.all()
    serializer_class = SocialSerializer

    @extend_schema(tags=["about - social"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# 3. Services
class ServiceListView(ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    @extend_schema(tags=["about - service"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# 4. ContactForm
class ContactFormCreateAPIView(CreateAPIView):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        
        # Get all active Telegram users
        active_users = TelegramUser.objects.filter(is_active=True)
        
        # Send notification to each active user
        for user in active_users:
            message = (
                f"📝 Yangi xabar!\n\n"
                f"👤 Ism: {instance.first_name} {instance.last_name}\n"
                f"📞 Telefon: {instance.phone}\n"
                f"📧 Email: {instance.email}\n"
                f"💬 Xabar: {instance.message}\n"
                f"⏰ Vaqt: {instance.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
            )
            
            try:
                send_telegram_message(user.user_id, message)
            except Exception as e:
                print(f"Failed to send message to user {user.user_id}: {str(e)}")

# 5. FAQs
class FAQsListView(ListAPIView):
    queryset = FAQs.objects.all()
    serializer_class = FAQsSerializer

    @extend_schema(tags=["about - faqs"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# 6. OP Images
class OPImageListView(ListAPIView):
    queryset = OPImage.objects.all()
    serializer_class = OPImageSerializer

    @extend_schema(tags=["about - op-images"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# 7. About Company
class AboutCompanyListView(ListAPIView):
    queryset = AboutCompany.objects.all()
    serializer_class = AboutCompanySerializer

    @extend_schema(tags=["about - about-company"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# 8. Brands
class BrandListView(ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

    @extend_schema(tags=["about - brands"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class TelegramUserViewSet(viewsets.ModelViewSet):
    queryset = TelegramUser.objects.all()
    serializer_class = TelegramUserSerializer
    permission_classes = [IsAdminUser]

class TelegramBotViewSet(viewsets.ModelViewSet):
    queryset = TelegramBot.objects.all()
    serializer_class = TelegramBotSerializer
    permission_classes = [IsAdminUser]
