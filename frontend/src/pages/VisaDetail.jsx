import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Clock, Info, CheckCircle2, Menu, Users, Minus, Plus, RotateCcw, CalendarDays, CalendarClock, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { FlagIcon } from '../components/ui/FlagIcon';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const REQUIRED_DOCS = {
  tourist: [
    { label: 'Passport', info: 'Valid for at least 6 months beyond your stay' },
    { label: 'Headshot or a selfie', info: 'Recent photo with white background, no glasses' },
    { label: 'Accommodation details (hotel address)', info: 'Name and address of your hotel or host' },
  ],
  business: [
    { label: 'Passport', info: 'Valid for at least 6 months beyond your stay' },
    { label: 'Headshot or a selfie', info: 'Recent photo with white background, no glasses' },
    { label: 'Business invitation letter', info: 'From an Indian company or organisation' },
    { label: 'Company registration documents', info: 'Proof of your company or self-employment' },
  ],
  medical: [
    { label: 'Passport', info: 'Valid for at least 6 months beyond your stay' },
    { label: 'Headshot or a selfie', info: 'Recent photo with white background, no glasses' },
    { label: 'Medical appointment letter', info: 'From the Indian hospital or clinic' },
    { label: 'Hospital documentation', info: 'Doctor referral or diagnostic report' },
  ],
  medical_attendant: [
    { label: 'Passport', info: 'Valid for at least 6 months beyond your stay' },
    { label: 'Headshot or a selfie', info: 'Recent photo with white background, no glasses' },
    { label: "Medical visa holder's documents", info: "Copy of the patient's medical visa" },
  ],
  conference: [
    { label: 'Passport', info: 'Valid for at least 6 months beyond your stay' },
    { label: 'Headshot or a selfie', info: 'Recent photo with white background, no glasses' },
    { label: 'Conference invitation letter', info: 'From the organising body in India' },
  ],
  transit: [
    { label: 'Passport', info: 'Valid for at least 6 months beyond your stay' },
    { label: 'Onward ticket', info: 'Confirmed booking showing your next destination' },
    { label: 'Headshot or a selfie', info: 'Recent photo with white background, no glasses' },
  ],
};

const VISA_DESCRIPTION = (visa, passportCountryName) => {
  const country = passportCountryName ? `${passportCountryName} passport holders` : 'eligible travellers';
  switch (visa.visa_type) {
    case 'tourist':
      return `${country} need a visa to travel to India. An Indian eVisa is a travel document that allows you to enter India ${visa.entries.toLowerCase()} through one of their main airports, seaports or land border crossings, and explore the country for a maximum stay of ${visa.stay_duration}. The visa is valid for ${visa.validity} from the date of issue. This application process is entirely online, and there's no need to send any documentation to the embassy or consulate.`;
    case 'business':
      return `${country} travelling to India for business purposes require an Indian Business eVisa. It permits ${visa.entries.toLowerCase()} entries and allows a stay of up to ${visa.stay_duration} per visit. The visa is valid for ${visa.validity} and the application is completed entirely online.`;
    case 'medical':
      return `${country} seeking medical treatment in India require an Indian Medical eVisa. This authorises ${visa.entries.toLowerCase()} entries and allows a stay of up to ${visa.stay_duration}. The eVisa is valid for ${visa.validity} from the date of issue and the full application is submitted online.`;
    case 'medical_attendant':
      return `Accompanying a Medical eVisa holder? ${country} can apply for an Indian Medical Attendant eVisa, which grants ${visa.entries.toLowerCase()} entries and a stay of up to ${visa.stay_duration}. The visa is valid for ${visa.validity} and applied for entirely online.`;
    case 'conference':
      return `${country} attending a conference or seminar in India should apply for an Indian Conference eVisa. It allows a single entry and a stay of up to ${visa.stay_duration}, valid for ${visa.validity} from issue date. The application is completed fully online.`;
    case 'transit':
      return `${country} transiting through India can apply for an Indian Transit eVisa, allowing a stay of up to ${visa.stay_duration}. The visa permits ${visa.entries.toLowerCase()} entries and is valid for ${visa.validity}. The application is completed entirely online.`;
    default:
      return `An Indian eVisa is required for ${country} to enter India. The visa is valid for ${visa.validity} and allows a stay of up to ${visa.stay_duration}. This application is completed entirely online.`;
  }
};

const FAQS = [
  {
    q: 'How do I apply?',
    a: 'Fill in the online application form with your personal and travel details, upload the required documents, and pay the visa fee. You will receive your eVisa by email once approved.',
  },
  {
    q: 'When should I apply if my trip is in a few months?',
    a: "We recommend applying at least 4 days before your intended arrival date. If your trip is months away, you can apply closer to your travel date as the visa validity starts from the date of issue. Don't apply more than 120 days before your trip.",
  },
  {
    q: 'How can I check status of my application?',
    a: 'Log in to your account and visit "My Applications" to see the current status of your application in real time.',
  },
  {
    q: 'Can I use my visa to re-enter the country?',
    a: 'It depends on your visa type. A Double or Multiple entry visa allows re-entry. A Single entry visa does not — you would need to apply for a new visa.',
  },
  {
    q: 'Can I apply without having a return flight?',
    a: "Yes, you can start your application without a confirmed return flight. You'll only need to provide your accommodation details and intended travel dates.",
  },
  {
    q: 'Do I need to apply for my kids?',
    a: 'Yes, every traveller — including minors and infants — requires their own individual visa application.',
  },
  {
    q: "Can I apply for a visa if I'm arriving by cruise ship?",
    a: 'Yes, Indian eVisas are valid for entry at designated seaports as well as airports. Check the list of approved ports of entry when applying.',
  },
];

const InfoTooltip = ({ text }) => (
  <span className="relative group inline-flex">
    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
    {text && (
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block z-10 w-48 rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg">
        {text}
      </span>
    )}
  </span>
);

const VisaDetail = () => {
  const { visaId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const passportCode = searchParams.get('passport') || '';
  const passportName = searchParams.get('passportName') || passportCode;

  const [visaOption, setVisaOption] = useState(null);
  const [countryDemonym, setCountryDemonym] = useState('');
  const [loading, setLoading] = useState(true);
  const [travellers, setTravellers] = useState(1);
  const [feeDisplayMode, setFeeDisplayMode] = useState('full_breakdown');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/utility/settings`);
        if (res.ok) {
          const data = await res.json();
          setFeeDisplayMode(data.fee_display_mode ?? 'full_breakdown');
        }
      } catch (e) {
        // default to full breakdown
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchVisaOption = async () => {
      const countryCode = visaId.split('-')[0].toUpperCase();
      try {
        const res = await fetch(`${BACKEND_URL}/api/countries/${countryCode}/visa-options`);
        if (res.ok) {
          const data = await res.json();
          const option = (data.options || []).find(o => o.id === visaId);
          setVisaOption(option || null);
          setCountryDemonym(data.country_demonym || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchVisaOption();
  }, [visaId]);

  const handleStartApplication = () => {
    navigate(`/apply/${visaId}`, { state: { passportName, passportDemonym: countryDemonym } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!visaOption) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">Visa option not found.</p>
        <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const docs = REQUIRED_DOCS[visaOption.visa_type] || REQUIRED_DOCS.tourist;
  const description = VISA_DESCRIPTION(visaOption, countryDemonym || passportName);
  const discount = parseFloat(visaOption.discount_amount) || 0;
  const basePrice = visaOption.price;
  const displayedUnitPrice =
    feeDisplayMode === 'our_fee_only'
      ? parseFloat(visaOption.our_fee) || 0
      : feeDisplayMode === 'with_discount'
      ? Math.max(0, basePrice - discount)
      : basePrice;
  const totalPrice = displayedUnitPrice * travellers;
  const totalGovtFee = visaOption.govt_fee * travellers;
  const totalProcessingFee = visaOption.processing_fee * travellers;
  const totalOurFee = visaOption.our_fee * travellers;
  const totalDiscount = discount * travellers;

  const displayDemonym = countryDemonym || passportName;
  const headerTitle = displayDemonym
    ? `${visaOption.name} for ${displayDemonym} Citizens`
    : visaOption.name;

  return (
    <div className="min-h-screen bg-white">
      {/* Page-level top bar (separate from global Header) */}
      <div className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center gap-2 flex-1 justify-center min-w-0 px-2">
            <FlagIcon code="IN" width={20} height={15} />
            <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">
              {headerTitle}
            </span>
          </div>

          <button
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Visa type heading */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-5">eVisa</h1>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <RotateCcw className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span>Entries: <span className="font-medium">{visaOption.entries}</span></span>
                  <InfoTooltip text="Number of times you can enter India with this visa." />
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CalendarDays className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span>Maximum Stay: <span className="font-medium">{visaOption.stay_duration}</span></span>
                  <InfoTooltip text="Maximum continuous stay allowed per entry." />
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CalendarClock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span>Validity: <span className="font-medium">{visaOption.validity}</span></span>
                  <InfoTooltip text="Period within which you must use the visa after it is issued." />
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span>Travel Purpose: <span className="font-medium">{visaOption.purpose}</span></span>
                  <InfoTooltip text="The permitted reason for your visit to India." />
                </li>
              </ul>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{description}</p>

            {/* What you need */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What you need</h2>
              <ul className="space-y-3">
                {docs.map((doc) => (
                  <li key={doc.label} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span>{doc.label}</span>
                    <InfoTooltip text={doc.info} />
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Frequently asked questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger className="text-left text-gray-800 font-normal text-base hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 border border-gray-200 rounded-xl shadow-sm">

              {/* Earliest Approval */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                <Clock className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{visaOption.approved_by}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>Earliest Approval</span>
                    <InfoTooltip text={`If you apply now, the earliest you could receive your visa is ${visaOption.approved_by}.`} />
                  </div>
                </div>
              </div>

              {/* Travellers */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>Travellers</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTravellers(t => Math.max(1, t - 1))}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
                    disabled={travellers <= 1}
                    aria-label="Decrease travellers"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-medium text-gray-900">{travellers}</span>
                  <button
                    onClick={() => setTravellers(t => t + 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="Increase travellers"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Price summary */}
              <div className="px-5 py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Price</span>
                  <span className="font-bold text-gray-900">
                    ${displayedUnitPrice.toFixed(2)} × {travellers}
                  </span>
                </div>
                {feeDisplayMode === 'with_discount' && discount > 0 && (
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Original price</span>
                    <span className="line-through">${(basePrice * travellers).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Fee breakdown — controlled by Utility > Pricing Display */}
              {feeDisplayMode === 'full_breakdown' && (
                <div className="px-5 pb-4 space-y-2 border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>Government fee</span>
                      <InfoTooltip text="Fee paid directly to the Indian government." />
                    </div>
                    <span>${totalGovtFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>Government processing fee</span>
                      <InfoTooltip text="A small processing charge applied by the government (2.5% of government fee)." />
                    </div>
                    <span>${totalProcessingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>Service fee</span>
                      <InfoTooltip text="Our fee for reviewing and processing your application." />
                    </div>
                    <span>${totalOurFee.toFixed(2)}</span>
                  </div>
                </div>
              )}
              {feeDisplayMode === 'our_fee_only' && (
                <div className="px-5 pb-4 space-y-2 border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>Service fee</span>
                      <InfoTooltip text="Our fee for reviewing and processing your application." />
                    </div>
                    <span>${totalOurFee.toFixed(2)}</span>
                  </div>
                </div>
              )}
              {feeDisplayMode === 'with_discount' && discount > 0 && (
                <div className="px-5 pb-2 border-t border-gray-100 pt-2">
                  <div className="flex items-center justify-between text-sm text-green-600 font-medium">
                    <div className="flex items-center gap-1">
                      <span>Discount applied</span>
                      <InfoTooltip text="Special discount applied to your order." />
                    </div>
                    <span>-${totalDiscount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="px-5 pb-5">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold py-3"
                  onClick={handleStartApplication}
                >
                  Start Application
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VisaDetail;
