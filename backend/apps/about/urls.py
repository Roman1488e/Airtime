from django.urls import path
from .views import (
    ContactListView, SocialListView, ServiceListView,
    ContactFormCreateAPIView, FAQsListView, OPImageListView,
    AboutCompanyListView, BrandListView, TelegramUserViewSet, TelegramBotViewSet
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'telegram-users', TelegramUserViewSet, basename='telegram-user')
router.register(r'telegram-bots', TelegramBotViewSet, basename='telegram-bot')

app_name = "about"

urlpatterns = [
    path("contacts/", ContactListView.as_view(), name="contacts"),
    path("socials/", SocialListView.as_view(), name="socials"),
    path("services/", ServiceListView.as_view(), name="services"),
    path("contact-forms/", ContactFormCreateAPIView.as_view(), name="contact-forms"),
    path("faqs/", FAQsListView.as_view(), name="faqs"),
    path("op-images/", OPImageListView.as_view(), name="op-images"),
    path("about-company/", AboutCompanyListView.as_view(), name="about-company"),
    path("brands/", BrandListView.as_view(), name="brands"),
] + router.urls
