import { Suspense } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { ZapLoader } from '@/components/atoms';
import EnquiryClient from './EnquiryClient';

export const metadata = {
  title: 'Get a Quote',
  description:
    'Get the best price on Guru Rani electric scooters. Fill out our enquiry form for a personalized quote with all applicable subsidies and offers.',
};

export default function EnquiryPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <ZapLoader size="lg" text="Loading..." />
            </div>
          }
        >
          <EnquiryClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
