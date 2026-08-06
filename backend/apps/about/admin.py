from django.contrib import admin
from parler.admin import TranslatableAdmin, TranslatableStackedInline
from .models import Contact, Social, Service, ContactForm, FAQs, QuestionAnswer, OPImage, AboutCompany, Brand, TelegramUser, TelegramBot
from django.utils.html import format_html
import requests


@admin.register(Contact)
class ContactAdmin(TranslatableAdmin):
    list_display = ('address', 'phone_1', 'phone_2', 'email')
    search_fields = ('translations__address', 'email')


@admin.register(Social)
class SocialAdmin(admin.ModelAdmin):
    list_display = ('instagram', 'facebook', 'telegram')
    search_fields = ('instagram', 'facebook', 'telegram')


@admin.register(Service)
class ServiceAdmin(TranslatableAdmin):
    list_display = ('title',)
    search_fields = ('translations__title',)


@admin.register(ContactForm)
class ContactFormAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'created_at')
    readonly_fields = ('created_at', 'updated_at')


class QuestionAnswerInline(TranslatableStackedInline):
    model = QuestionAnswer
    extra = 1
    fields = ('question', 'answer')


@admin.register(FAQs)
class FAQsAdmin(TranslatableAdmin):
    list_display = ('title', 'get_questions_count')
    search_fields = ('translations__title',)
    inlines = [QuestionAnswerInline]
    
    def get_questions_count(self, obj):
        return obj.questions_answers.count()
    get_questions_count.short_description = "Savollar soni"

    def get_fieldsets(self, request, obj=None):
        return [
            (None, {
                'fields': (
                    'title',
                )
            }),
        ]


@admin.register(OPImage)
class OPImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'image')


@admin.register(AboutCompany)
class AboutCompanyAdmin(TranslatableAdmin):
    list_display = ('title', 'image')
    search_fields = ('translations__title',)

    def get_fieldsets(self, request, obj=None):
        return [
            (None, {
                'fields': (
                    'title',
                    'description',
                    'image',
                )
            }),
        ]


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'company_url')
    search_fields = ('company_name',)


@admin.register(TelegramUser)
class TelegramUserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('user_id',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(TelegramBot)
class TelegramBotAdmin(admin.ModelAdmin):
    list_display = ('name', 'username', 'get_bot_link', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'username', 'token')
    readonly_fields = ('created_at', 'updated_at', 'get_bot_link')
    fieldsets = (
        ('Bot Information', {
            'fields': ('name', 'username', 'token', 'is_active', 'get_bot_link')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_bot_link(self, obj):
        if obj.username:
            return format_html('<a href="https://t.me/{}" target="_blank">@{}</a>', obj.username, obj.username)
        return '-'
    get_bot_link.short_description = 'Bot Link'

    def save_model(self, request, obj, form, change):
        try:
            # Get bot info from Telegram API
            bot_info_url = f"https://api.telegram.org/bot{obj.token}/getMe"
            response = requests.get(bot_info_url, timeout=5)
            
            if response.status_code == 200:
                bot_data = response.json()
                if bot_data.get('ok'):
                    bot_info = bot_data.get('result', {})
                    obj.name = bot_info.get('first_name', '')
                    obj.username = bot_info.get('username', '')
                    self.message_user(request, f"✅ Bot ma'lumotlari muvaffaqiyatli olingan: {obj.name} (@{obj.username})")
                else:
                    self.message_user(request, "⚠️ Bot ma'lumotlarini olishda xatolik yuz berdi", level='WARNING')
            else:
                self.message_user(request, "⚠️ Bot ma'lumotlarini olishda xatolik yuz berdi", level='WARNING')
        except Exception as e:
            self.message_user(request, f"❌ Xatolik yuz berdi: {str(e)}", level='ERROR')

        super().save_model(request, obj, form, change)
