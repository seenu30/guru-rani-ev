/**
 * Placeholder product data for development
 * Use this before Supabase is connected
 */

export interface PlaceholderColor {
  id: string;
  name: string;
  hexCode: string;
  imageUrl: string | null;
}

export interface PlaceholderVariant {
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
  colors: PlaceholderColor[];
}

export interface PlaceholderProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  imageUrl: string | null;
  variants: PlaceholderVariant[];
}

export const placeholderProducts: PlaceholderProduct[] = [
  {
    id: '1',
    name: 'Guru Rani X',
    slug: 'guru-rani-x',
    tagline: 'The Ultimate Urban Commuter',
    description:
      'Experience the perfect blend of style, performance, and sustainability. The Guru Rani X is designed for the modern Indian commuter who demands more from their ride.',
    imageUrl: null,
    variants: [
      {
        id: 'v1',
        name: 'Standard',
        price: 99999,
        formattedPrice: '₹99,999',
        range: 100,
        topSpeed: 70,
        battery: '2.5 kWh',
        chargingTime: '4 hours',
        motorPower: '3.5 kW',
        bootSpace: 22,
        colors: [
          { id: 'c1', name: 'Cosmic Black', hexCode: '#1a1a1a', imageUrl: null },
          { id: 'c2', name: 'Pearl White', hexCode: '#f5f5f5', imageUrl: null },
          { id: 'c3', name: 'Racing Red', hexCode: '#dc2626', imageUrl: null },
        ],
      },
      {
        id: 'v2',
        name: 'Pro',
        price: 124999,
        formattedPrice: '₹1,24,999',
        range: 130,
        topSpeed: 80,
        battery: '3.5 kWh',
        chargingTime: '5 hours',
        motorPower: '4.5 kW',
        bootSpace: 28,
        colors: [
          { id: 'c4', name: 'Cosmic Black', hexCode: '#1a1a1a', imageUrl: null },
          { id: 'c5', name: 'Pearl White', hexCode: '#f5f5f5', imageUrl: null },
          { id: 'c6', name: 'Racing Red', hexCode: '#dc2626', imageUrl: null },
          { id: 'c7', name: 'Ocean Blue', hexCode: '#0ea5e9', imageUrl: null },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Guru Rani S',
    slug: 'guru-rani-s',
    tagline: 'Smart. Simple. Sustainable.',
    description:
      'The perfect entry point to electric mobility. Guru Rani S offers everything you need for your daily commute at an accessible price point.',
    imageUrl: null,
    variants: [
      {
        id: 'v3',
        name: 'Base',
        price: 79999,
        formattedPrice: '₹79,999',
        range: 80,
        topSpeed: 60,
        battery: '2.0 kWh',
        chargingTime: '3.5 hours',
        motorPower: '2.5 kW',
        bootSpace: 18,
        colors: [
          { id: 'c8', name: 'Midnight Blue', hexCode: '#1e3a5f', imageUrl: null },
          { id: 'c9', name: 'Silver Storm', hexCode: '#9ca3af', imageUrl: null },
          { id: 'c10', name: 'Forest Green', hexCode: '#166534', imageUrl: null },
        ],
      },
      {
        id: 'v4',
        name: 'Plus',
        price: 94999,
        formattedPrice: '₹94,999',
        range: 100,
        topSpeed: 70,
        battery: '2.5 kWh',
        chargingTime: '4 hours',
        motorPower: '3.0 kW',
        bootSpace: 22,
        colors: [
          { id: 'c11', name: 'Midnight Blue', hexCode: '#1e3a5f', imageUrl: null },
          { id: 'c12', name: 'Silver Storm', hexCode: '#9ca3af', imageUrl: null },
          { id: 'c13', name: 'Forest Green', hexCode: '#166534', imageUrl: null },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Guru Rani Pro Max',
    slug: 'guru-rani-pro-max',
    tagline: 'Power Meets Performance',
    description:
      'For those who want it all. The Pro Max delivers unmatched range, speed, and features for the most demanding riders.',
    imageUrl: null,
    variants: [
      {
        id: 'v5',
        name: 'Pro Max',
        price: 149999,
        formattedPrice: '₹1,49,999',
        range: 160,
        topSpeed: 100,
        battery: '4.0 kWh',
        chargingTime: '6 hours',
        motorPower: '6.0 kW',
        bootSpace: 32,
        colors: [
          { id: 'c14', name: 'Stealth Black', hexCode: '#0a0a0a', imageUrl: null },
          { id: 'c15', name: 'Glacier White', hexCode: '#ffffff', imageUrl: null },
          { id: 'c16', name: 'Sunset Orange', hexCode: '#f97316', imageUrl: null },
        ],
      },
    ],
  },
];

export const placeholderDealers = [
  {
    id: 'd1',
    name: 'Guru Rani Experience Center - Mumbai',
    address: '123 EV Plaza, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '+91 22 1234 5678',
    email: 'mumbai@gururani.in',
    latitude: 19.0596,
    longitude: 72.8295,
    timings: 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM',
  },
  {
    id: 'd2',
    name: 'Guru Rani Showroom - Delhi',
    address: '45 Green Avenue, Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    phone: '+91 11 2345 6789',
    email: 'delhi@gururani.in',
    latitude: 28.6315,
    longitude: 77.2167,
    timings: 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM',
  },
  {
    id: 'd3',
    name: 'Guru Rani Hub - Bangalore',
    address: '78 Tech Park Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    phone: '+91 80 3456 7890',
    email: 'bangalore@gururani.in',
    latitude: 12.9352,
    longitude: 77.6245,
    timings: 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM',
  },
];

export const placeholderFAQs = [
  {
    category: 'Ownership & Delivery',
    items: [
      {
        id: 'f1',
        question: 'What documents do I need to purchase a Guru Rani scooter?',
        answer:
          'You need a valid ID proof (Aadhaar/PAN), address proof, and passport-size photographs. For financing, additional income proof may be required.',
      },
      {
        id: 'f2',
        question: 'How long does delivery take?',
        answer:
          'Standard delivery takes 7-14 business days after order confirmation, depending on your location and color availability.',
      },
    ],
  },
  {
    category: 'Charging & Battery',
    items: [
      {
        id: 'f3',
        question: 'How do I charge my Guru Rani scooter?',
        answer:
          'Simply plug in the portable charger (included) to any standard 15A socket. No special installation required.',
      },
      {
        id: 'f4',
        question: 'What is the battery warranty?',
        answer: 'We offer a 3-year or 50,000 km warranty on the battery pack, whichever comes first.',
      },
    ],
  },
  {
    category: 'Government Subsidies',
    items: [
      {
        id: 'f5',
        question: 'Am I eligible for FAME-II subsidy?',
        answer:
          'Yes! All Guru Rani scooters are eligible for FAME-II subsidy up to ₹15,000, which is already reflected in our ex-showroom prices.',
      },
    ],
  },
];

export const placeholderTestimonials = [
  {
    id: 't1',
    name: 'Rajesh Kumar',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    text: 'Switched from my petrol bike to Guru Rani X six months ago. Best decision ever! The range is perfect for my daily commute, and I am saving over ₹3,000 every month on fuel.',
    productName: 'Guru Rani X',
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    location: 'Bangalore, Karnataka',
    rating: 5,
    text: 'As a first-time EV owner, I was nervous about charging and range. But the Guru Rani S has exceeded all my expectations. Simple, reliable, and so much fun to ride!',
    productName: 'Guru Rani S',
  },
  {
    id: 't3',
    name: 'Amit Patel',
    location: 'Delhi',
    rating: 5,
    text: 'The Pro Max is an absolute beast! 160km range means I never worry about charging during my long rides. The acceleration is addictive.',
    productName: 'Guru Rani Pro Max',
  },
];

// Calculator defaults
export const calculatorDefaults = {
  petrolPrice: 105, // INR per liter
  electricityPrice: 8, // INR per unit
  avgPetrolMileage: 45, // km per liter
  avgEvEfficiency: 15, // km per unit
};
