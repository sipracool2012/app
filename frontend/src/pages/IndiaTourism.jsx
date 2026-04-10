import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Sun, Utensils, Camera, Landmark, Waves, TreePine, ChevronDown, ChevronUp, Star } from 'lucide-react';

const DESTINATIONS = [
  {
    name: 'Taj Mahal, Agra',
    tag: 'UNESCO Heritage',
    tagColor: 'bg-yellow-500',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    desc: 'One of the Seven Wonders of the World — a breathtaking white-marble mausoleum on the banks of the Yamuna river.',
  },
  {
    name: 'Kerala Backwaters',
    tag: 'Nature',
    tagColor: 'bg-green-500',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    desc: 'Glide through emerald lagoons and palm-fringed canals on a traditional houseboat in God\'s Own Country.',
  },
  {
    name: 'Rajasthan',
    tag: 'Culture',
    tagColor: 'bg-orange-500',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    desc: 'Majestic forts, vibrant bazaars and golden deserts — the Land of Kings is unlike anywhere else on Earth.',
  },
  {
    name: 'Goa Beaches',
    tag: 'Beach',
    tagColor: 'bg-blue-500',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    desc: 'Sun-soaked shores, Portuguese architecture, fresh seafood and legendary sunsets along 100 km of coastline.',
  },
  {
    name: 'Varanasi',
    tag: 'Spiritual',
    tagColor: 'bg-purple-500',
    img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
    desc: 'Witness the eternal Ganga Aarti on the ghats of the world\'s oldest continuously inhabited city.',
  },
  {
    name: 'Himachal Pradesh',
    tag: 'Adventure',
    tagColor: 'bg-cyan-600',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    desc: 'Snow-capped peaks, alpine meadows and hill stations nestled in the mighty Himalayas.',
  },
];

const EXPERIENCES = [
  { icon: <Utensils className="w-7 h-7" />, title: 'Cuisine', desc: 'From butter chicken in Delhi to dosa in Chennai — every state is a new culinary universe.' },
  { icon: <Landmark className="w-7 h-7" />, title: 'Heritage', desc: 'Over 3,000 years of history: Mughal forts, ancient temples, Buddhist stupas and colonial architecture.' },
  { icon: <Waves className="w-7 h-7" />, title: 'Coastline', desc: '7,500 km of coastline spanning the Arabian Sea, Indian Ocean and Bay of Bengal.' },
  { icon: <TreePine className="w-7 h-7" />, title: 'Wildlife', desc: 'Bengal tigers, Asiatic lions, Indian elephants and over 1,300 bird species in their natural habitat.' },
  { icon: <Sun className="w-7 h-7" />, title: 'Festivals', desc: 'Diwali, Holi, Navratri, Pongal — India\'s festivals are a riot of colour, music and joy.' },
  { icon: <Camera className="w-7 h-7" />, title: 'Photography', desc: 'Every street corner is a composition — from misty mountain villages to neon-lit city nights.' },
];

const FAQS = [
  {
    q: 'Do I need a visa to visit India?',
    a: 'Most passport holders require a visa. Citizens of 193+ nationalities are eligible for India eVisa — a convenient online process. Clear eVisa Services helps you verify all required documents and prepares your documentation so your submission on the official portal is error-free.',
  },
  {
    q: 'What is the best time to visit India?',
    a: 'October to March is generally the best time for most of India — pleasant temperatures and low humidity. The Himalayas are best in summer (April–June). The Kerala backwaters are beautiful year-round. Monsoon season (July–September) transforms the landscape and is spectacular in the Western Ghats.',
  },
  {
    q: 'What India eVisa types are available for tourists?',
    a: 'Tourist eVisa comes in three durations: 30-day (single/double entry), 1-year (multiple entry), and 5-year (multiple entry). Each stay is limited to 90 or 180 days per visit depending on the visa type. Clear eVisa Services can help you choose the right type and prepare your documentation.',
  },
  {
    q: 'Is India safe to travel?',
    a: 'India is a safe and welcoming destination visited by millions of tourists every year. Standard travel precautions apply. The Government of India has significantly improved tourist infrastructure across all major destinations in recent years.',
  },
  {
    q: 'What currency is used in India?',
    a: 'The Indian Rupee (INR). ATMs are widely available in cities and tourist areas. Major credit cards are accepted at hotels, restaurants and larger shops. Carry some cash for local markets and rural areas.',
  },
];

const EVISA_STEPS = [
  { num: '01', title: 'Submit your details', desc: 'Fill in your personal information and travel dates on our platform.' },
  { num: '02', title: 'Upload documents', desc: 'We tell you exactly which documents are needed and verify every one of them for accuracy.' },
  { num: '03', title: 'Review your package', desc: 'Our team checks everything against India\'s eVisa requirements and prepares your documentation.' },
  { num: '04', title: 'Submit on official portal', desc: 'You submit your verified application directly on India\'s official portal (indianvisaonline.gov.in) with confidence.' },
];

export default function IndiaTourism() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Hero ── */}
      <section className="relative h-[92vh] min-h-[560px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=85"
          alt="India — Gateway of India, Mumbai at dawn"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <MapPin className="w-4 h-4 text-orange-300" />
            Incredible India
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Discover the Soul<br />
            <span className="text-orange-400">of India</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ancient temples, royal palaces, golden beaches, and the world's most vibrant street life —
            all in one extraordinary country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-xl hover:shadow-orange-500/40 hover:scale-105"
            >
              Get Your India eVisa <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#destinations"
              className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all"
            >
              Explore Destinations
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="w-7 h-7" />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-6">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '28+', label: 'States & UTs' },
            { value: '40', label: 'UNESCO Heritage Sites' },
            { value: '193+', label: 'Nationalities Welcome' },
            { value: '0.5B+', label: 'Annual Visitor Moments' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold">{s.value}</div>
              <div className="text-sm text-orange-100 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Destinations ── */}
      <section id="destinations" className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-2">Where to go</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Iconic Destinations</h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">Six unmissable corners of a country that contains multitudes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {DESTINATIONS.map(d => (
              <div key={d.name} className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={d.img}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 ${d.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
                    {d.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" /> {d.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-bleed split: Taj + CTA ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1000&q=85"
              alt="India street life — rickshaws and colour"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="font-semibold text-lg">"The journey of a thousand colours"</p>
            </div>
          </div>
          <div>
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-3">Why India</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              A universe of<br />experiences in<br />one country
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {EXPERIENCES.map(e => (
                <div key={e.title} className="flex gap-3 items-start">
                  <div className="text-orange-500 mt-0.5 flex-shrink-0">{e.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{e.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo mosaic ── */}
      <section className="px-4 pb-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-2">A visual journey</p>
            <h2 className="text-4xl font-extrabold text-gray-900">India in frames</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden h-72 md:h-auto">
              <img src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80" alt="Holi festival" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-36">
              <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80" alt="Indian spices" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-36">
              <img src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80" alt="Elephant wildlife" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-36">
              <img src="https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?w=600&q=80" alt="Indian architecture detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-36">
              <img src="https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?w=600&q=80" alt="Indian dancer" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ── eVisa Process ── */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900 text-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-300 font-semibold uppercase tracking-widest text-sm mb-2">Clear eVisa Services</p>
            <h2 className="text-4xl md:text-5xl font-extrabold">Your eVisa, done right</h2>
            <p className="mt-4 text-blue-200 text-lg max-w-2xl mx-auto">
              We verify every document and prepare your complete documentation package so your official
              portal submission is error-free — giving your application the best chance of approval.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVISA_STEPS.map(s => (
              <div key={s.num} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15 hover:bg-white/15 transition-colors">
                <div className="text-4xl font-extrabold text-blue-300 mb-3">{s.num}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full text-lg transition-all shadow-xl hover:shadow-orange-500/30 hover:scale-105"
            >
              Start Your eVisa Now <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-blue-300 text-sm">
              Not affiliated with the Government of India. You submit on the official portal yourself.
            </p>
          </div>
        </div>
      </section>

      {/* ── Best time to visit ── */}
      <section className="py-20 bg-amber-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-2">Plan your trip</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Best time to visit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { season: 'Oct – Mar', label: 'Peak Season', color: 'border-green-500', badge: 'bg-green-100 text-green-700',
                desc: 'Cool and dry across most of the country. Best for the Golden Triangle, Rajasthan, Goa and South India. Festive season includes Diwali and Christmas.' },
              { season: 'Apr – Jun', label: 'Summer', color: 'border-orange-400', badge: 'bg-orange-100 text-orange-700',
                desc: 'Hot on the plains but perfect for the Himalayas and hill stations like Shimla, Manali and Ooty. Lighter crowds and lower prices in most areas.' },
              { season: 'Jul – Sep', label: 'Monsoon', color: 'border-blue-500', badge: 'bg-blue-100 text-blue-700',
                desc: 'Lush green landscapes and dramatic waterfalls. Kerala, Goa and the Western Ghats are spectacular. Hotels offer significant discounts.' },
            ].map(s => (
              <div key={s.season} className={`bg-white rounded-2xl shadow-md p-7 border-t-4 ${s.color}`}>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.badge}`}>{s.label}</span>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-3 mb-1">{s.season}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-2">Common questions</p>
            <h2 className="text-4xl font-extrabold text-gray-900">FAQs</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{f.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden py-24 px-4">
        <img
          src="https://images.unsplash.com/photo-1519922639192-e73293ca430e?w=1600&q=80"
          alt="India Holi festival crowd"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Your India adventure<br />starts with the right visa.
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Let Clear eVisa Services verify your documents and prepare your application package —
            so you can submit with complete confidence.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full text-xl transition-all shadow-2xl hover:scale-105"
          >
            Get Your India eVisa <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

    </div>
  );
}
