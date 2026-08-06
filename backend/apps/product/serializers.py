from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer, TranslatedFieldsField

from apps.product.models import (
    Product, Category, ProductImage, ShortDescription, 
    Banner, Barcode
)


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']


class ShortDescriptionSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=ShortDescription)

    class Meta:
        model = ShortDescription
        fields = ['id', 'translations']


class BarcodeSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Barcode)

    class Meta:
        model = Barcode
        fields = ['id', 'translations', 'key', 'value']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        self._fill_translations(data)
        return data

    @staticmethod
    def _fill_translations(data):
        if 'translations' in data:
            for lang in ['uz', 'ru', 'en']:
                data['translations'].setdefault(lang, {})


class CategorySerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Category)

    class Meta:
        model = Category
        fields = ['id', 'translations', 'image', 'is_featured', 'slug']


class ProductSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Product)
    product_images = ProductImageSerializer(many=True, read_only=True)
    short_descriptions = ShortDescriptionSerializer(many=True, read_only=True)
    barcodes = BarcodeSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'translations', 'price', 'discounted_price',
            'is_available', 'slug', 'product_images',
            'short_descriptions', 'barcodes', 'category',
            'created_at', 'updated_at'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        self._fill_translations(data)
        return data

    @staticmethod
    def _fill_translations(data):
        if 'translations' in data:
            for lang in ['uz', 'ru', 'en']:
                data['translations'].setdefault(lang, {})


class BannerSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Banner)
    product = ProductSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Banner
        fields = [
            'id', 'translations', 'web_image', 'rsp_image',
            'is_advertisement', 'product', 'category'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        self._fill_translations(data)
        return data

    @staticmethod
    def _fill_translations(data):
        if 'translations' in data:
            for lang in ['uz', 'ru', 'en']:
                data['translations'].setdefault(lang, {})


class RecommendedProductSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Product)
    category = CategorySerializer(read_only=True)
    product_images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'translations', 'price', 'discounted_price',
            'category', 'product_images', 'slug'    
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        self._fill_translations(data)
        return data

    @staticmethod
    def _fill_translations(data):
        if 'translations' in data:
            for lang in ['uz', 'ru', 'en']:
                data['translations'].setdefault(lang, {})
