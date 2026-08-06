from django_filters import FilterSet, CharFilter, NumberFilter, OrderingFilter
from django.db.models import Q
from .models import Product

class ProductFilter(FilterSet):
    category = CharFilter(method="filter_category")
    category_slug = CharFilter(field_name="category__slug")
    min_price = NumberFilter(field_name="price", lookup_expr="gte")
    max_price = NumberFilter(field_name="price", lookup_expr="lte")
    ordering = OrderingFilter(fields=("price", "translations__title"))

    def filter_category(self, queryset, name, value):
        return queryset.filter(category__translations__title__icontains=value)

    class Meta:
        model = Product
        fields = ["category", "category_slug", "min_price", "max_price"]
