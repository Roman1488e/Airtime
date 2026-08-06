from django.test import TestCase
from datetime import datetime, timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import (
    Contact, Social, Service, ContactForm, 
    FAQs, OPImage, AboutCompany, Brand
)
from parler.models import TranslatableModel
import json

class AboutTests(APITestCase):
    def setUp(self):
        """Test uchun kerakli ma'lumotlarni tayyorlash"""
        self.client = APIClient()
        
        # Contact uchun test ma'lumotlari
        self.contact = Contact.objects.create(
            phone_1="+998901234567",
            phone_2="+998901234568",
            email="test@example.com",
            map="Test Map Location"
        )
        self.contact.set_current_language('uz')
        self.contact.address = "Test Address"
        self.contact.save()
        
        # Social uchun test ma'lumotlari
        self.social = Social.objects.create(
            instagram="https://instagram.com/test",
            facebook="https://facebook.com/test",
            telegram="@test"
        )
        
        # Service uchun test ma'lumotlari
        self.service = Service.objects.create()
        self.service.set_current_language('uz')
        self.service.title = "Test Service"
        self.service.sub_title = "Test Subtitle"
        self.service.save()
        
        # ContactForm uchun test ma'lumotlari
        self.contact_form = ContactForm.objects.create(
            first_name="Test",
            last_name="User",
            phone="+998901234567",
            email="test@example.com",
            message="Test Message"
        )
        
        # FAQs uchun test ma'lumotlari
        self.faq = FAQs.objects.create()
        self.faq.set_current_language('uz')
        self.faq.title = "Test FAQ"
        self.faq.save()
        
        # OPImage uchun test ma'lumotlari
        self.op_image = OPImage.objects.create(
            image=SimpleUploadedFile(
                name='test_image.jpg',
                content=b'',
                content_type='image/jpeg'
            )
        )
        
        # AboutCompany uchun test ma'lumotlari
        self.about_company = AboutCompany.objects.create()
        self.about_company.set_current_language('uz')
        self.about_company.title = "Test Company"
        self.about_company.description = "Test Description"
        self.about_company.save()
        
        # Brand uchun test ma'lumotlari
        self.brand = Brand.objects.create(
            logo_image=SimpleUploadedFile(
                name='test_logo.jpg',
                content=b'',
                content_type='image/jpeg'
            ),
            company_name="Test Company",
            company_url="https://testcompany.com"
        )

    # Contact testlari
    def test_get_contact_list(self):
        """Contact ro'yxatini olish"""
        response = self.client.get(reverse('about:contacts'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0)
        self.assertEqual(response.data[0]['phone_1'], self.contact.phone_1)

    def test_contact_translations(self):
        """Contact tarjimalarini tekshirish"""
        self.contact.set_current_language('ru')
        self.contact.address = "Test Address RU"
        self.contact.save()
        
        response = self.client.get(reverse('about:contacts'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(item['address'] == "Test Address" for item in response.data))

    # Social testlari
    def test_get_social_list(self):
        """Social ro'yxatini olish"""
        response = self.client.get(reverse('about:socials'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0)
        self.assertEqual(response.data[0]['instagram'], self.social.instagram)

    def test_social_unique_constraints(self):
        """Social unique constraintlarini tekshirish"""
        with self.assertRaises(Exception):
            Social.objects.create(
                instagram=self.social.instagram,
                facebook="https://facebook.com/test2",
                telegram="@test2"
            )

    # Service testlari
    def test_get_service_list(self):
        """Service ro'yxatini olish"""
        response = self.client.get(reverse('about:services'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0)
        self.assertEqual(response.data[0]['title'], "Test Service")

    def test_service_translations(self):
        """Service tarjimalarini tekshirish"""
        self.service.set_current_language('ru')
        self.service.title = "Test Service RU"
        self.service.save()
        
        response = self.client.get(reverse('about:services'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(item['title'] == "Test Service" for item in response.data))

    # ContactForm testlari
    def test_create_contact_form(self):
        """ContactForm yaratish"""
        data = {
            "first_name": "New",
            "last_name": "User",
            "phone": "+998901234569",
            "email": "new@example.com",
            "message": "New Message"
        }
        response = self.client.post(reverse('about:contact-forms'), data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(ContactForm.objects.filter(email="new@example.com").exists())

    def test_contact_form_validation(self):
        """ContactForm validatsiyasini tekshirish"""
        data = {
            "first_name": "Test",
            "email": "invalid-email"
        }
        response = self.client.post(reverse('about:contact-forms'), data)
        self.assertEqual(response.status_code, 400)

    # FAQs testlari
    def test_get_faqs_list(self):
        """FAQs ro'yxatini olish"""
        response = self.client.get(reverse('about:faqs'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0)
        self.assertEqual(response.data[0]['title'], "Test FAQ")

    def test_faqs_translations(self):
        """FAQs tarjimalarini tekshirish"""
        self.faq.set_current_language('ru')
        self.faq.title = "Test FAQ RU"
        self.faq.save()
        
        response = self.client.get(reverse('about:faqs'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(item['title'] == "Test FAQ" for item in response.data))

    # OPImage testlari
    def test_get_op_images_list(self):
        """OPImage ro'yxatini olish"""
        response = self.client.get(reverse('about:op-images'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0)
        self.assertTrue('image' in response.data[0])

    # AboutCompany testlari
    def test_get_about_company_list(self):
        """AboutCompany ro'yxatini olish"""
        response = self.client.get(reverse('about:about-company'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0)
        self.assertEqual(response.data[0]['title'], "Test Company")

    def test_about_company_translations(self):
        """AboutCompany tarjimalarini tekshirish"""
        self.about_company.set_current_language('ru')
        self.about_company.title = "Test Company RU"
        self.about_company.save()
        
        response = self.client.get(reverse('about:about-company'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(item['title'] == "Test Company" for item in response.data))

    # Brand testlari
    def test_get_brands_list(self):
        """Brand ro'yxatini olish"""
        response = self.client.get(reverse('about:brands'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0)
        self.assertEqual(response.data[0]['company_name'], "Test Company")

    def test_brand_validation(self):
        """Brand validatsiyasini tekshirish"""
        with self.assertRaises(Exception):
            Brand.objects.create(
                logo_image=SimpleUploadedFile(
                    name='test_logo2.jpg',
                    content=b'',
                    content_type='image/jpeg'
                ),
                company_name="Test Company 2",
                company_url="invalid-url"
            )
