from django.urls import path
from . import views

app_name = "product"

urlpatterns = [
    # Product Endpoints
    path("products/", views.ProductListView.as_view(), name="product-list"),
    path("products/recommended/", views.RecommendedProductsView.as_view(), name="recommended-products"),
    path("products/<slug:slug>/", views.ProductDetailView.as_view(), name="product-detail"),

    # Category Endpoints
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("categories/<slug:slug>/", views.CategoryDetailView.as_view(), name="category-detail"),

    # Banner Endpoints
    path("banners/", views.BannerListView.as_view(), name="banner-list"),
    path("banners/ad/", views.AdvertisementBannerListView.as_view(), name="advertisement-banner-list"),
    path("banners/<int:pk>/", views.BannerDetailView.as_view(), name="banner-detail"),

    # Short Description Endpoints
    path("descriptions/", views.ShortDescriptionListView.as_view(), name="description-list"),
    path("descriptions/<int:pk>/", views.ShortDescriptionDetailView.as_view(), name="description-detail"),

    # Barcode Endpoints
    path("barcodes/", views.BarcodeListView.as_view(), name="barcode-list"),
    path("barcodes/<int:pk>/", views.BarcodeDetailView.as_view(), name="barcode-detail"),

    # Product Images
    path("images/", views.ProductImageListView.as_view(), name="image-list"),
    path("images/<int:pk>/", views.ProductImageDetailView.as_view(), name="image-detail"),
]
