import requests
from django.conf import settings
import uuid
import os
from rest_framework.exceptions import ValidationError


def generate_unique_filename(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return filename


class SymbolValidationMixin:
    def validate_symbols(self, data):
        fields_to_check = [
            "title_en",
            "title_uz",
            "title_ru",
            "sub_title_en",
            "sub_title_uz",
            "sub_title_ru",
        ]

        for field in fields_to_check:
            if field in data and any(char in data[field] for char in "\<>&"):
                raise ValidationError(f"Field '{field}' contains disallowed symbols.")

    def validate(self, data):
        self.validate_symbols(data)
        return data
    
