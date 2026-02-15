/**
 * Placeholder blog data for development
 */

export interface PlaceholderBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
}

export const placeholderBlogPosts: PlaceholderBlogPost[] = [
  {
    id: 'b1',
    title: 'The Complete Guide to EV Charging at Home',
    slug: 'complete-guide-ev-charging-home',
    excerpt:
      'Everything you need to know about setting up a home charging station for your electric scooter, from outlet types to safety tips.',
    content: `
# The Complete Guide to EV Charging at Home

Charging your electric scooter at home is one of the biggest advantages of EV ownership. No more trips to the petrol station, no more fluctuating fuel prices – just plug in and charge.

## What You Need

### Standard 15A Socket
Most electric scooters, including all Guru Rani models, come with a portable charger that works with any standard 15A socket. This is the same socket you use for your air conditioner or microwave.

### Dedicated Circuit (Recommended)
While not mandatory, we recommend having a dedicated circuit for your EV charger. This ensures:
- Consistent power delivery
- Reduced risk of overloading
- Faster charging times

## Charging Times

| Model | Battery | Full Charge Time |
|-------|---------|------------------|
| Guru Rani S | 2.0 kWh | 3.5 hours |
| Guru Rani X | 2.5 kWh | 4 hours |
| Guru Rani Pro Max | 4.0 kWh | 6 hours |

## Safety Tips

1. **Never use extension cords** – Always plug directly into a wall socket
2. **Keep the charging area dry** – Avoid outdoor charging in rain
3. **Regular inspections** – Check your charging cable for wear and tear
4. **Don't overcharge** – Modern EVs have protection, but unplugging after full charge is good practice

## Cost Savings

The average electricity rate in India is about ₹8 per unit. With an average efficiency of 15 km per unit, your running cost is approximately **₹0.53 per kilometer** – that's nearly 10x cheaper than petrol!

## Conclusion

Home charging is simple, convenient, and cost-effective. With a Guru Rani scooter, you're always ready to ride.
    `,
    coverImage: null,
    category: 'Guides',
    author: 'Guru Rani Team',
    publishedAt: '2024-01-15',
    readTime: 5,
  },
  {
    id: 'b2',
    title: 'FAME-II Subsidy Explained: How to Maximize Your Savings',
    slug: 'fame-ii-subsidy-explained',
    excerpt:
      'A detailed breakdown of the FAME-II subsidy scheme and how Guru Rani customers can benefit from government incentives.',
    content: `
# FAME-II Subsidy Explained

The FAME-II (Faster Adoption and Manufacturing of Electric Vehicles) scheme is the Indian government's initiative to promote electric mobility. Here's how you can benefit.

## What is FAME-II?

FAME-II offers direct subsidies on electric vehicle purchases to make them more affordable. For electric two-wheelers, the subsidy is calculated based on battery capacity.

## Current Subsidy Rates

As of 2024:
- **₹10,000 per kWh** of battery capacity
- Maximum cap of **₹15,000** per vehicle

## Guru Rani Subsidy Benefits

| Model | Battery | Subsidy |
|-------|---------|---------|
| Guru Rani S | 2.0 kWh | ₹15,000 |
| Guru Rani X | 2.5 kWh | ₹15,000 |
| Guru Rani Pro Max | 4.0 kWh | ₹15,000 |

All Guru Rani models qualify for the maximum subsidy of ₹15,000!

## State Subsidies

Many states offer additional incentives:
- **Delhi**: ₹5,000 + road tax waiver
- **Gujarat**: ₹10,000 early bird bonus
- **Maharashtra**: Road tax exemption
- **Karnataka**: ₹5,000 additional subsidy

## How to Avail

1. Choose your Guru Rani model
2. The FAME-II subsidy is automatically applied at purchase
3. State subsidies may require separate application
4. Our dealers will guide you through the process

## Conclusion

With FAME-II and state subsidies combined, you can save up to ₹30,000 on your Guru Rani purchase!
    `,
    coverImage: null,
    category: 'News',
    author: 'Guru Rani Team',
    publishedAt: '2024-01-10',
    readTime: 4,
  },
  {
    id: 'b3',
    title: '5 Reasons Why Electric Scooters Are Perfect for Indian Cities',
    slug: 'electric-scooters-perfect-indian-cities',
    excerpt:
      'From traffic navigation to low running costs, discover why electric scooters are the ideal urban mobility solution for India.',
    content: `
# 5 Reasons Why Electric Scooters Are Perfect for Indian Cities

India's urban landscape presents unique challenges for commuters. Here's why electric scooters like Guru Rani are the perfect solution.

## 1. Navigate Traffic with Ease

Electric scooters offer instant torque and nimble handling, perfect for weaving through congested city streets. The compact size makes parking a breeze.

## 2. Incredible Cost Savings

| Expense | Petrol Scooter | Guru Rani EV |
|---------|----------------|--------------|
| Running cost/km | ₹2.50 | ₹0.50 |
| Monthly fuel (30km/day) | ₹2,250 | ₹450 |
| Annual savings | - | **₹21,600** |

## 3. Zero Emissions, Clean Air

With air quality becoming a major concern in Indian cities, every electric scooter on the road makes a difference. Be part of the solution.

## 4. Low Maintenance

No oil changes, no clutch plates, no chain adjustments. Electric scooters have fewer moving parts, meaning:
- Lower maintenance costs
- Less time in service centers
- Longer component life

## 5. Silent Operation

Enjoy a peaceful ride without engine noise. Your neighbors will thank you when you leave early in the morning!

## Conclusion

Electric scooters aren't just good for the environment – they're practical, economical, and perfect for the Indian urban lifestyle.
    `,
    coverImage: null,
    category: 'Lifestyle',
    author: 'Guru Rani Team',
    publishedAt: '2024-01-05',
    readTime: 3,
  },
  {
    id: 'b4',
    title: 'Battery Care 101: Maximize Your EV Battery Life',
    slug: 'battery-care-maximize-ev-life',
    excerpt:
      'Simple tips and best practices to ensure your electric scooter battery lasts longer and performs better.',
    content: `
# Battery Care 101: Maximize Your EV Battery Life

Your battery is the heart of your electric scooter. With proper care, it can last for years and hundreds of thousands of kilometers.

## Understanding Lithium-Ion Batteries

Guru Rani scooters use advanced lithium-ion battery technology, similar to what's in your smartphone but much more robust.

## Best Practices

### 1. Avoid Deep Discharge
Try not to let your battery drop below 20% regularly. Shallow discharges are better for battery health.

### 2. Don't Overcharge
While our BMS (Battery Management System) protects against overcharging, it's good practice to unplug once fully charged.

### 3. Store Properly
If storing for extended periods:
- Keep charge between 40-60%
- Store in a cool, dry place
- Charge once every 2-3 months

### 4. Temperature Matters
- Avoid charging in extreme heat (>45°C)
- Don't park in direct sunlight for extended periods
- Winter charging takes longer – that's normal!

## Signs of Battery Health

Your Guru Rani app shows battery health percentage. Here's what to expect:
- **Year 1-2**: 95-100% capacity
- **Year 3-4**: 85-95% capacity
- **Year 5+**: 75-85% capacity

## Warranty Coverage

All Guru Rani batteries come with:
- 3-year warranty
- 50,000 km coverage
- Free replacement if capacity drops below 70%

## Conclusion

With these simple tips, your battery will deliver optimal performance for years to come.
    `,
    coverImage: null,
    category: 'Guides',
    author: 'Guru Rani Team',
    publishedAt: '2024-01-01',
    readTime: 4,
  },
];

export const blogCategories = ['All', 'Guides', 'News', 'Lifestyle'];
