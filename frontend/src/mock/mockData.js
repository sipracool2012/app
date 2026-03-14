// Mock data for Sherpa visa application clone

export const visaOptions = [
  {
    id: 'india-30day',
    country: 'India',
    name: '30 day Indian Tourist eVisa',
    price: 72.62,
    entries: 'Double',
    stayDuration: '30 days',
    validity: '120 days',
    purpose: 'Tourism',
    approvalTime: '5 business days',
    approvedBy: 'March 19'
  },
  {
    id: 'india-1year',
    country: 'India',
    name: '1 year Indian Tourist eVisa',
    price: 124.80,
    entries: 'Multiple',
    stayDuration: '180 days',
    validity: '1 year',
    purpose: 'Tourism',
    approvalTime: '5 business days',
    approvedBy: 'March 19'
  },
  {
    id: 'india-5year',
    country: 'India',
    name: '5 year Indian Tourist eVisa',
    price: 244.80,
    entries: 'Multiple',
    stayDuration: '180 days',
    validity: '5 years',
    purpose: 'Tourism',
    approvalTime: '5 business days',
    approvedBy: 'March 19'
  }
];

export const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' }
];

export const destinations = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' }
];

export const partnerLogos = [
  { name: 'American Airlines', url: 'https://apply.joinsherpa.com/assets/img/partner-logos/americanairlines.svg' },
  { name: 'British Airways', url: 'https://apply.joinsherpa.com/assets/img/partner-logos/britishairways.svg' },
  { name: 'Air Canada', url: 'https://apply.joinsherpa.com/assets/img/partner-logos/aircanada.svg' },
  { name: 'Expedia Group', url: 'https://apply.joinsherpa.com/assets/img/partner-logos/expediagroup.svg' },
  { name: 'Air Transat', url: 'https://apply.joinsherpa.com/assets/img/partner-logos/airtransat.svg' }
];

export const testimonials = [
  {
    id: 1,
    name: 'Robert Flather',
    rating: 5,
    time: '1 hour ago',
    text: 'I have used Sherpa twice and have been very happy with their service on both occasions. Very speedy, not overpriced and very straightforward to apply for a visa.'
  },
  {
    id: 2,
    name: 'Peter',
    rating: 5,
    time: '1 hour ago',
    text: 'Very informative, good advice and on-time service'
  },
  {
    id: 3,
    name: 'Steve Wilkinson',
    rating: 5,
    time: '2 hours ago',
    text: 'Made my Namibia visa really simple and easy to apply for. It arrived within twelve hours!'
  },
  {
    id: 4,
    name: 'Natalya',
    rating: 5,
    time: '3 hours ago',
    text: 'Excellent very good job 👍'
  },
  {
    id: 5,
    name: 'Lorna',
    rating: 5,
    time: '4 hours ago',
    text: 'So easy, having spent 30 mins fighting with the online visa application myself. Got my visa quickly and with no fuss. Recommended'
  }
];

export const mockApplications = [
  {
    id: 'APP001',
    email: 'john.doe@email.com',
    fullName: 'John Doe',
    nationality: 'United States',
    destination: 'India',
    visaType: '30 day Indian Tourist eVisa',
    status: 'pending',
    submittedDate: '2026-03-10T10:30:00Z',
    expectedArrival: '2026-04-15'
  },
  {
    id: 'APP002',
    email: 'jane.smith@email.com',
    fullName: 'Jane Smith',
    nationality: 'United Kingdom',
    destination: 'India',
    visaType: '1 year Indian Tourist eVisa',
    status: 'approved',
    submittedDate: '2026-03-08T14:20:00Z',
    expectedArrival: '2026-04-20'
  },
  {
    id: 'APP003',
    email: 'mike.johnson@email.com',
    fullName: 'Mike Johnson',
    nationality: 'Canada',
    destination: 'India',
    visaType: '5 year Indian Tourist eVisa',
    status: 'rejected',
    submittedDate: '2026-03-05T09:15:00Z',
    expectedArrival: '2026-05-01'
  }
];
