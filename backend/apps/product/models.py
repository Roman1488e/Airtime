from django.db import models
from parler.models import TranslatableModel, TranslatedFields
from apps.utils import generate_unique_filename
from django.utils.text import slugify
import uuid
from ckeditor.fields import RichTextField


class Category(TranslatableModel):
    translations = TranslatedFields(
        title=models.CharField(max_length=255),
    )
    image = models.ImageField(upload_to=generate_unique_filename, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    slug = models.SlugField(unique=True, blank=True)

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Get the title in the default language
            title = self.safe_translation_getter("title", any_language=True)
            # Create a base slug from the title
            base_slug = slugify(title)
            # Add a unique identifier
            unique_id = str(uuid.uuid4())[:8]
            self.slug = f"{base_slug}-{unique_id}"
        super().save(*args, **kwargs)

class Product(TranslatableModel):
    translations = TranslatedFields(
        title=models.CharField(max_length=255),
        description=models.TextField(),
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Get the title in the default language
            title = self.safe_translation_getter("title", any_language=True)
            # Create a base slug from the title
            base_slug = slugify(title)
            # Add a unique identifier
            unique_id = str(uuid.uuid4())[:8]
            self.slug = f"{base_slug}-{unique_id}"
        super().save(*args, **kwargs)

class ProductImage(models.Model):
    image = models.ImageField(upload_to=generate_unique_filename)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_images')

    def __str__(self):
        return self.image.name

class ShortDescription(TranslatableModel):
    translations = TranslatedFields(
        key=models.CharField(max_length=255),
        value=RichTextField(),
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='short_descriptions')

    def __str__(self):
        return self.safe_translation_getter("key", any_language=True)

class Barcode(TranslatableModel):
    translations = TranslatedFields(
        title=models.CharField(max_length=255),
    )
    key=models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='barcodes')

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True)

class Banner(TranslatableModel):
    translations = TranslatedFields(
        title=models.CharField(max_length=255, null=True, blank=True),
        description=RichTextField(null=True, blank=True),
    )
    web_image = models.ImageField(upload_to=generate_unique_filename)
    rsp_image = models.ImageField(upload_to=generate_unique_filename, null=True, blank=True)
    is_advertisement = models.BooleanField(default=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or f"Banner: {self.product or self.category or 'General'}"