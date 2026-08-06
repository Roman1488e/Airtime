from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter
from apps.product.models import (
    Product, Category, Banner, ShortDescription,
    Barcode, ProductImage
)
from apps.product.serializers import (
    ProductSerializer, CategorySerializer, BannerSerializer,
    RecommendedProductSerializer, ShortDescriptionSerializer,
    BarcodeSerializer, ProductImageSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from apps.product.filters import ProductFilter
from apps.product.pagination import CustomPagination
from random import sample
from django.core.exceptions import ObjectDoesNotExist

# Product List & Detail Views
@extend_schema(
    tags=['products'],
    parameters=[
        OpenApiParameter(
            name='category_slug',
            description='Filter products by category slug',
            required=False,
            type=str
        )
    ]
)
class ProductListView(ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = ProductFilter
    pagination_class = CustomPagination
    ordering_fields = ["price", "created_at"]
    search_fields = ["translations__title", "translations__description"]

    def get_queryset(self):
        queryset = Product.objects.filter(is_available=True).select_related('category').prefetch_related(
            'product_images',
            'short_descriptions',
            'barcodes',
            'barcodes__translations',
            'category__translations'
        )
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

    @extend_schema(tags=["products"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

@extend_schema(tags=['products'])
class ProductDetailView(RetrieveAPIView):
    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Product.objects.select_related('category').prefetch_related(
            'product_images',
            'short_descriptions',
            'barcodes',
            'barcodes__translations',
            'category__translations'
        )

    def get_object(self):
        try:
            return super().get_object()
        except ObjectDoesNotExist:
            return Response(
                {"message": "Mahsulot topilmadi"},
                status=HTTP_404_NOT_FOUND
            )

    @extend_schema(tags=["products"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

@extend_schema(tags=['products'])
class RecommendedProductsView(ListAPIView):
    queryset = Product.objects.none()  # Default empty queryset
    serializer_class = RecommendedProductSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Product.objects.none()
        return Product.objects.filter(is_available=True).order_by('?')[:6]

    @extend_schema(tags=["products"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


# Category Views
@extend_schema(tags=['categories'])
class CategoryListView(ListAPIView):
    queryset = Category.objects.all().prefetch_related('translations')
    serializer_class = CategorySerializer

    @extend_schema(tags=["categories"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

@extend_schema(tags=['categories'])
class CategoryDetailView(RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_object(self):
        try:
            return super().get_object()
        except ObjectDoesNotExist:
            return Response(
                {"message": "Kategoriya topilmadi"},
                status=HTTP_404_NOT_FOUND
            )

    @extend_schema(tags=["categories"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


# Banner Views
@extend_schema(tags=['banners'])
class BannerListView(ListAPIView):
    queryset = Banner.objects.filter(is_advertisement=False)
    serializer_class = BannerSerializer

    @extend_schema(tags=["banners"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

@extend_schema(tags=['banners'])
class AdvertisementBannerListView(ListAPIView):
    queryset = Banner.objects.filter(is_advertisement=True)
    serializer_class = BannerSerializer

    @extend_schema(tags=["banners"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

@extend_schema(tags=['banners'])
class BannerDetailView(RetrieveAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    lookup_field = "pk"

    def get_object(self):
        try:
            return super().get_object()
        except ObjectDoesNotExist:
            return Response(
                {"message": "Banner topilmadi"},
                status=HTTP_404_NOT_FOUND
            )

    @extend_schema(tags=["banners"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


# ShortDescription Views
@extend_schema(tags=['short-descriptions'])
class ShortDescriptionListView(ListAPIView):
    queryset = ShortDescription.objects.all()
    serializer_class = ShortDescriptionSerializer

    @extend_schema(tags=["short-descriptions"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

@extend_schema(tags=['short-descriptions'])
class ShortDescriptionDetailView(RetrieveAPIView):
    queryset = ShortDescription.objects.all()
    serializer_class = ShortDescriptionSerializer
    lookup_field = "pk"

    def get_object(self):
        try:
            return super().get_object()
        except ObjectDoesNotExist:
            return Response(
                {"message": "Qisqa tavsif topilmadi"},
                status=HTTP_404_NOT_FOUND
            )

    @extend_schema(tags=["short-descriptions"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


# Barcode Views
@extend_schema(tags=['barcodes'])
class BarcodeListView(ListAPIView):
    queryset = Barcode.objects.all()
    serializer_class = BarcodeSerializer

    @extend_schema(tags=["barcodes"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

@extend_schema(tags=['barcodes'])
class BarcodeDetailView(RetrieveAPIView):
    queryset = Barcode.objects.all()
    serializer_class = BarcodeSerializer
    lookup_field = "pk"

    def get_object(self):
        try:
            return super().get_object()
        except ObjectDoesNotExist:
            return Response(
                {"message": "Shtrix kod topilmadi"},
                status=HTTP_404_NOT_FOUND
            )

    @extend_schema(tags=["barcodes"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


# ProductImage Views
@extend_schema(tags=['product-images'])
class ProductImageListView(ListAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer

    @extend_schema(tags=["product-images"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

@extend_schema(tags=['product-images'])
class ProductImageDetailView(RetrieveAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    lookup_field = "pk"

    def get_object(self):
        try:
            return super().get_object()
        except ObjectDoesNotExist:
            return Response(
                {"message": "Rasm topilmadi"},
                status=HTTP_404_NOT_FOUND
            )

    @extend_schema(tags=["product-images"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
