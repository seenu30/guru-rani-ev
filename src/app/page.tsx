import {
  Navbar,
  Footer,
  Hero,
  SavingsCalculator,
  FeaturedModels,
  TestimonialCarousel,
  WhyChooseUs,
  EnquiryForm,
} from '@/components/organisms';
import { productsQueries } from '@/modules/products/products.queries';

export default async function Home() {
  const products = await productsQueries.getFeatured(3);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedModels products={products} />
        <SavingsCalculator />
        <WhyChooseUs />
        <TestimonialCarousel />
        <EnquiryForm />
      </main>
      <Footer />
    </>
  );
}
