// Generic Translation turini aniqlash

// Lug'at tuzilishini aniq ko'rinishda aniqlash
export interface Dictionary {
  common: {
    home: string;
    categories: string;
    featuredProducts: string;
    products: string;
    aboutUs: string;
    contacts: string;
    selectLanguage: string;
    learnMore: string;
    searchProducts: string;
    loading: string;
    noProductsFound: string;
    english: string;
    russian: string;
    uzbek: string;
    recentlyViewed: string;
    searchResults: string;
    allProducts: string;
    filters: string;
    clearAll: string;
    search: string;
    availability: string;
    famousProducts: string;
    clearFilters: string;
    noProductsFoundMessage: string;
    showFilters: string;
    hideFilters: string;
    gridView: string;
    listView: string;
    productsFound: string;
    productsFoundInCategory: string;
    previousPage: string;
    nextPage: string;
    footer: {
      description: string;
    };
  };
  contacts: {
    title: string;
    getInTouch: string;
    contactMessage: string;
    email: string;
    phone: string;
    address: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sending: string;
    successMessage: string;
    errorMessage: string;
    message: string;
    sendMessage: string;
    faqTitle: string;
    contactUs: string;
  };
  featured: {
    title: string;
  };
  home: {
    shopByCategories: string;
    popularProducts: string;
    discountedProducts: string;
    contactTitle: string;
    contactSubtitle: string;
    contactDescription: string;
    formTitle: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submitButton: string;
    socialTitle: string;
  };
  about: {
    title: string;
    ourProducts: string;
    ourBrands: string;
    ourMission: string;
    noDescription: string;
    missionStatement: string;
  };
  seo?: {
    productsDescription: string;
    categoryDescription: string;
    searchDescription: string;
    homeDescription: string;
    aboutDescription: string;
    contactsDescription: string;
  };
  product: {
    description: string;
    specifications: string;
    relatedProducts: string;
    addToCart: string;
    outOfStock: string;
    inStock: string;
    price: string;
    discountedPrice: string;
    category: string;
    brand: string;
    model: string;
    warranty: string;
    features: string;
    reviews: string;
    writeReview: string;
    noReviews: string;
    reviewsCount: string;
    rating: string;
    submitReview: string;
    reviewTitle: string;
    reviewContent: string;
    yourRating: string;
    yourName: string;
    yourEmail: string;
    thankYouForReview: string;
    errorSubmittingReview: string;
  };
}
type ID = number | string;
export type Translation<T> = Record<Locale, T>;

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ShortDescription {
  id: ID;
  translations: Translation<{ key: string; value: string }>;
  key: string;
  value: string;
}

export interface Category {
  id: ID;
  // translations: Translation<{ title: string }>;
  translations: {
    uz: {
      title: string;
    };
    ru: {
      title: string;
    };
    en: {
      title: string;
    };
  };
  image: string;
  slug: string;
  is_featured: boolean;
}

export interface BarCode {
  id: ID;
  translations: number[];
  key: string;
  value: string;
}

export interface Product {
  id: ID;
  translations: Translation<{ title: string; description: string }>;
  title: string;
  description: string;
  price: string;
  discounted_price: string | null;
  is_available: boolean;
  slug: string;
  product_images: {
    id: ID;
    image: string;
  }[];
  short_descriptions: ShortDescription[];
  category: Category;
  created_at: string;
  updated_at: string;
  barcodes: BarCode[];
}

// Banner item from API
export interface BannerItem {
  id: ID;
  translations: Translation<{ title?: string; description?: string }>;
  web_image: string;
  rsp_image: string | null;
  is_advertisement: boolean;
  product: Product | null;
  category: Category | null;
}

// Transformed slide for the carousel
export interface HeroSlide {
  id: string | number;
  translations: Translation<{
    title: string;
    description: string;
  }>;
  backgroundImage: string;
  ctaLink: string | false;
}

export interface Brands {
  id: ID;
  logo_image: string;
  company_name: string;
  company_url: string;
}

// Qo'llab-quvvatlanadigan tillar uchun aniq tur
export type Locale = "en" | "ru" | "uz";

// getDictionary funksiyasi uchun Promise turini aniqlash
export type GetDictionaryType = (locale: string) => Promise<Dictionary>;

export interface FAQ {
  id: ID;
  translations: Translation<{ title: string }>;
  questions_answers: {
    id: ID;
    translations: Translation<{ question: string; answer: string }>;
  }[];
}

export interface AboutCompany {
  id: ID;
  translations: Translation<{ title: string; description: string }>;

  image: string | null;
}

export interface AboutImage {
  id: ID;
  image: string;
}

export interface ContactInfo {
  id: ID;
  translations: Translation<{ address: string }>;
  phone_1: string;
  phone_2: string;
  email: string;
  map: string;
}

export interface SocialLinks {
  id: ID;
  instagram: string;
  facebook: string;
  telegram: string;
}
