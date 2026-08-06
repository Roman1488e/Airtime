from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer, TranslatedFieldsField

from apps.about.models import Contact, Service, Social, ContactForm, FAQs, QuestionAnswer, OPImage, AboutCompany, Brand, TelegramUser, TelegramBot
from apps.utils import SymbolValidationMixin


class ContactSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Contact)

    class Meta:
        model = Contact
        fields = ('id', 'translations', 'phone_1', 'phone_2', 'email', 'map')


class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = ('id', 'first_name', 'last_name', 'phone', 'email', 'message', 'created_at')
        read_only_fields = ('created_at',)


class ContactUsSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Contact)

    class Meta:
        model = Contact
        fields = ('id', 'translations', 'phone_1', 'phone_2', 'email', 'map')


class SocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Social
        fields = ('id', 'instagram', 'facebook', 'telegram')


class ServiceSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Service)

    class Meta:
        model = Service
        fields = ('id', 'translations', 'image')


class QuestionAnswerSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=QuestionAnswer)

    class Meta:
        model = QuestionAnswer
        fields = ('id', 'translations')


class FAQsSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=FAQs)
    questions_answers = QuestionAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = FAQs
        fields = ('id', 'translations', 'questions_answers')


class OPImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OPImage
        fields = ('id', 'image')


class AboutCompanySerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=AboutCompany)

    class Meta:
        model = AboutCompany
        fields = ('id', 'translations', 'image')


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ('id', 'logo_image', 'company_name', 'company_url')


class TelegramUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelegramUser
        fields = ('id', 'user_id', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')


class TelegramBotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelegramBot
        fields = ('id', 'token', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
