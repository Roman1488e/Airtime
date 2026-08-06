from django.core.validators import EmailValidator, RegexValidator, URLValidator
from django.db import models
from parler.models import TranslatableModel, TranslatedFields
from apps.utils import generate_unique_filename
from ckeditor.fields import RichTextField


class Contact(TranslatableModel):
    translations = TranslatedFields(
        address=models.CharField(max_length=255),
    )
    phone_regex = RegexValidator(
        regex=r"^\+?1?\d{9,15}$",
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.",
    )
    phone_1 = models.CharField(validators=[phone_regex], max_length=17, blank=True, unique=True)
    phone_2 = models.CharField(validators=[phone_regex], max_length=17, blank=True, unique=True)
    email = models.EmailField(max_length=255, unique=True, validators=[EmailValidator()])
    map = models.CharField(max_length=400)

    def __str__(self):
        return self.safe_translation_getter("address", any_language=True)


class Social(models.Model):
    instagram = models.URLField(max_length=255, blank=True, null=True, unique=True, validators=[URLValidator()])
    facebook = models.URLField(max_length=255, blank=True, null=True, unique=True, validators=[URLValidator()])
    telegram = models.CharField(max_length=255, blank=True, null=True, unique=True)

    def __str__(self):
        return "Social Links"


class Service(TranslatableModel):
    translations = TranslatedFields(
        title=models.CharField(max_length=255, null=True, blank=True),
        sub_title=models.CharField(max_length=255, null=True, blank=True),
    )
    image = models.ImageField(upload_to=generate_unique_filename, null=True, blank=True)

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or "Service"


class ContactForm(models.Model):
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(max_length=255, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Form"
        verbose_name_plural = "Contact Forms"

    def __str__(self):
        return f"{self.first_name or ''} {self.last_name or ''}".strip()


class QuestionAnswer(TranslatableModel):
    translations = TranslatedFields(
        question=models.CharField(max_length=255),
        answer=RichTextField(blank=True, null=True),
    )
    faq = models.ForeignKey('FAQs', on_delete=models.CASCADE, related_name='questions_answers')

    def __str__(self):
        return self.safe_translation_getter("question", any_language=True)


class FAQs(TranslatableModel):
    translations = TranslatedFields(
        title=models.CharField(max_length=255),
    )

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True)


class OPImage(models.Model):
    image = models.ImageField(upload_to="media/")
    def __str__(self):
        return self.image.name


class AboutCompany(TranslatableModel):
    translations = TranslatedFields(
        title=models.CharField(max_length=255),
        description=RichTextField(blank=True, null=True),
    )
    image = models.ImageField(upload_to=generate_unique_filename)

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True)


class Brand(models.Model):
    logo_image = models.ImageField(upload_to=generate_unique_filename)
    company_name = models.CharField(max_length=255)
    company_url = models.URLField(max_length=255, validators=[URLValidator()])

    class Meta:
        verbose_name = "Brand"
        verbose_name_plural = "Brands"

    def __str__(self):
        return self.company_name


class TelegramUser(models.Model):
    user_id = models.BigIntegerField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Telegram User {self.user_id}"

    class Meta:
        verbose_name = "Telegram User"
        verbose_name_plural = "Telegram Users"


class TelegramBot(models.Model):
    token = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.name and self.username:
            return f"{self.name} (@{self.username})"
        elif self.name:
            return self.name
        elif self.username:
            return f"@{self.username}"
        return f"Telegram Bot ({self.token[:10]}...)"

    def get_bot_link(self):
        if self.username:
            return f"https://t.me/{self.username}"
        return None

    class Meta:
        verbose_name = "Telegram Bot"
        verbose_name_plural = "Telegram Bots"

