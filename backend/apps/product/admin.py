from django.contrib import admin
from parler.admin import TranslatableAdmin, TranslatableStackedInline
from .models import Product, Category, ProductImage, ShortDescription, Banner, Barcode
from django.utils.html import format_html

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ('image', 'preview')
    readonly_fields = ('preview',)

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image.url)
        return "-"
    preview.short_description = "Ko'rinish"

class ShortDescriptionInline(TranslatableStackedInline):
    model = ShortDescription
    extra = 1

class BarcodeInline(TranslatableStackedInline):
    model = Barcode
    extra = 1

@admin.register(Product)
class ProductAdmin(TranslatableAdmin):
    list_display = ("title", "price", "discounted_price", "is_available", "created_at")
    list_filter = ("is_available", "category")
    search_fields = ("translations__title",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")
    inlines = [ProductImageInline, ShortDescriptionInline, BarcodeInline]

    def get_fieldsets(self, request, obj=None):
        return [
            (None, {
                'fields': (
                    'title',
                    'description',
                    'price',
                    'discounted_price',
                    'is_available',
                    'category',
                    'created_at',
                    'updated_at'
                )
            }),
        ]

@admin.register(Category)
class CategoryAdmin(TranslatableAdmin):
    list_display = ("title", "is_featured")
    search_fields = ("translations__title",)
    list_filter = ("is_featured",)

    def get_fieldsets(self, request, obj=None):
        return [
            (None, {
                'fields': (
                    'title',
                    'image',
                    'is_featured'
                )
            }),
        ]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("id", "image", "preview")
    readonly_fields = ('preview',)

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image.url)
        return "-"
    preview.short_description = "Ko'rinish"

@admin.register(ShortDescription)
class ShortDescriptionAdmin(TranslatableAdmin):
    list_display = ("key", "value", "product")

    def get_fieldsets(self, request, obj=None):
        return [
            (None, {
                'fields': (
                    'key',
                    'value',
                    'product'
                )
            }),
        ]

@admin.register(Barcode)
class BarcodeAdmin(TranslatableAdmin):
    list_display = ("title", "value", "product")

    def get_fieldsets(self, request, obj=None):
        return [
            (None, {
                'fields': (
                    'title',
                    'value',
                    'product'
                )
            }),
        ]

from django.contrib import admin
from apps.product.models import Banner

@admin.register(Banner)
class BannerAdmin(TranslatableAdmin):
    list_display = ("title", "is_advertisement", "product", "category")
    list_filter = ("is_advertisement",)
    search_fields = ("translations__title", "translations__description", "product__translations__title", "category__translations__title")

    def get_fieldsets(self, request, obj=None):
        return [
            (None, {
                'fields': (
                    'title',
                    'description',
                    'web_image',
                    'rsp_image',
                    'is_advertisement',
                    'product',
                    'category'
                )
            }),
        ]
