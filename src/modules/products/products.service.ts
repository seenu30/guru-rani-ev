import { productsQueries, type ProductWithVariants } from './products.queries';
import { NotFoundError } from '@/lib/errors';
import { formatPrice } from '@/lib/utils';

export interface FormattedProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  imageUrl: string | null;
  variants: FormattedVariant[];
}

export interface FormattedVariant {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  range: number;
  topSpeed: number;
  battery: string;
  chargingTime: string;
  motorPower: string;
  bootSpace: number | null;
  colors: FormattedColor[];
}

export interface FormattedColor {
  id: string;
  name: string;
  hexCode: string;
  imageUrl: string | null;
}

function formatProduct(product: ProductWithVariants): FormattedProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    tagline: product.tagline,
    description: product.description,
    imageUrl: product.image_url,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      price: variant.price / 100, // Convert from paise to rupees
      formattedPrice: formatPrice(variant.price / 100),
      range: variant.range_km,
      topSpeed: variant.top_speed,
      battery: variant.battery,
      chargingTime: variant.charging_time,
      motorPower: variant.motor_power,
      bootSpace: variant.boot_space,
      colors: (variant.colors || []).map((color) => ({
        id: color.id,
        name: color.name,
        hexCode: color.hex_code,
        imageUrl: color.image_url,
      })),
    })),
  };
}

export const productsService = {
  /**
   * Get all products
   */
  async getAllProducts() {
    const models = await productsQueries.getAll();
    return models;
  },

  /**
   * Get a product by slug with all details
   */
  async getProductBySlug(slug: string): Promise<FormattedProduct> {
    const product = await productsQueries.getBySlug(slug);

    if (!product) {
      throw new NotFoundError('Product');
    }

    return formatProduct(product);
  },

  /**
   * Get all products for comparison view
   */
  async getProductsForComparison(): Promise<FormattedProduct[]> {
    const products = await productsQueries.getAllForComparison();
    return products.map(formatProduct);
  },

  /**
   * Get featured products for homepage
   */
  async getFeaturedProducts(limit: number = 3) {
    const products = await productsQueries.getFeatured(limit);

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      tagline: product.tagline,
      imageUrl: product.image_url,
      startingPrice: product.variants?.[0]
        ? formatPrice(product.variants[0].price / 100)
        : null,
      range: product.variants?.[0]?.range_km || null,
      topSpeed: product.variants?.[0]?.top_speed || null,
    }));
  },

  /**
   * Get price range for a model
   */
  async getPriceRange(modelId: string) {
    const product = await productsQueries.getById(modelId);

    if (!product) {
      throw new NotFoundError('Product');
    }

    // This would need variants to calculate - simplified for now
    return {
      min: 79999,
      max: 149999,
    };
  },
};

export default productsService;
