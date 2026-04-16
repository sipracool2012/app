import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MapPin, Sun, Utensils, Camera, Landmark, Waves, TreePine, ChevronDown, ChevronUp, Star } from 'lucide-react';

export default function IndiaTourism() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);

  const DESTINATIONS = [
    { name: t('pages.indiaTourism.destinations.tajMahal'),  tag: t('pages.indiaTourism.destinations.tajMahalTag'),  tagColor: 'bg-yellow-500', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',  desc: t('pages.indiaTourism.destinations.tajMahalDesc') },
    { name: t('pages.indiaTourism.destinations.kerala'),    tag: t('pages.indiaTourism.destinations.keralaTag'),    tagColor: 'bg-green-500',  img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',  desc: t('pages.indiaTourism.destinations.keralaDesc') },
    { name: t('pages.indiaTourism.destinations.rajasthan'), tag: t('pages.indiaTourism.destinations.rajasthanTag'), tagColor: 'bg-orange-500', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',  desc: t('pages.indiaTourism.destinations.rajasthanDesc') },
    { name: t('pages.indiaTourism.destinations.goa'),       tag: t('pages.indiaTourism.destinations.goaTag'),       tagColor: 'bg-blue-500',   img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',  desc: t('pages.indiaTourism.destinations.goaDesc') },
    { name: t('pages.indiaTourism.destinations.varanasi'),  tag: t('pages.indiaTourism.destinations.varanasiTag'),  tagColor: 'bg-purple-500', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',  desc: t('pages.indiaTourism.destinations.varanasiDesc') },
    { name: t('pages.indiaTourism.destinations.himachal'),  tag: t('pages.indiaTourism.destinations.himachalTag'),  tagColor: 'bg-cyan-600',   img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',  desc: t('pages.indiaTourism.destinations.himachalDesc') },
  ];

  const EXPERIENCES = [
    { icon: <Utensils className="w-7 h-7" />, title: t('pages.indiaTourism.whyIndia.cuisine'),     desc: t('pages.indiaTourism.whyIndia.cuisineDesc') },
    { icon: <Landmark className="w-7 h-7" />, title: t('pages.indiaTourism.whyIndia.heritage'),    desc: t('pages.indiaTourism.whyIndia.heritageDesc') },
    { icon: <Waves    className="w-7 h-7" />, title: t('pages.indiaTourism.whyIndia.coastline'),   desc: t('pages.indiaTourism.whyIndia.coastlineDesc') },
    { icon: <TreePine className="w-7 h-7" />, title: t('pages.indiaTourism.whyIndia.wildlife'),    desc: t('pages.indiaTourism.whyIndia.wildlifeDesc') },
    { icon: <Sun      className="w-7 h-7" />, title: t('pages.indiaTourism.whyIndia.festivals'),   desc: t('pages.indiaTourism.whyIndia.festivalsDesc') },
    { icon: <Camera   className="w-7 h-7" />, title: t('pages.indiaTourism.whyIndia.photography'), desc: t('pages.indiaTourism.whyIndia.photographyDesc') },
  ];

  const FAQS = [
    { q: t('pages.indiaTourism.faq.q1'), a: t('pages.indiaTourism.faq.a1') },
    { q: t('pages.indiaTourism.faq.q2'), a: t('pages.indiaTourism.faq.a2') },
    { q: t('pages.indiaTourism.faq.q3'), a: t('pages.indiaTourism.faq.a3') },
    { q: t('pages.indiaTourism.faq.q4'), a: t('pages.indiaTourism.faq.a4') },
    { q: t('pages.indiaTourism.faq.q5'), a: t('pages.indiaTourism.faq.a5') },
  ];

  const EVISA_STEPS = [
    { num: '01', title: t('pages.indiaTourism.evisaProcess.step1'), desc: t('pages.indiaTourism.evisaProcess.step1Desc') },
    { num: '02', title: t('pages.indiaTourism.evisaProcess.step2'), desc: t('pages.indiaTourism.evisaProcess.step2Desc') },
    { num: '03', title: t('pages.indiaTourism.evisaProcess.step3'), desc: t('pages.indiaTourism.evisaProcess.step3Desc') },
    { num: '04', title: t('pages.indiaTourism.evisaProcess.step4'), desc: t('pages.indiaTourism.evisaProcess.step4Desc') },
  ];

  const SEASONS = [
    { season: t('pages.indiaTourism.bestTime.peakRange'),   label: t('pages.indiaTourism.bestTime.peakSeason'), color: 'border-green-500',  badge: 'bg-green-100 text-green-700',   desc: t('pages.indiaTourism.bestTime.peakDesc') },
    { season: t('pages.indiaTourism.bestTime.summerRange'), label: t('pages.indiaTourism.bestTime.summer'),     color: 'border-orange-400', badge: 'bg-orange-100 text-orange-700', desc: t('pages.indiaTourism.bestTime.summerDesc') },
    { season: t('pages.indiaTourism.bestTime.monsoonRange'),label: t('pages.indiaTourism.bestTime.monsoon'),    color: 'border-blue-500',   badge: 'bg-blue-100 text-blue-700',     desc: t('pages.indiaTourism.bestTime.monsoonDesc') },
  ];

  const STATS = [
    { value: '28+',   label: t('pages.indiaTourism.stats.states') },
    { value: '40',    label: t('pages.indiaTourism.stats.heritage') },
    { value: '193+',  label: t('pages.indiaTourism.stats.nationalities') },
    { value: '0.5B+', label: t('pages.indiaTourism.stats.visitors') },
  ];

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
            {t('pages.indiaTourism.hero.badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            {t('pages.indiaTourism.hero.heading1')}<br />
            <span className="text-orange-400">{t('pages.indiaTourism.hero.heading2')}</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('pages.indiaTourism.hero.subheading')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-xl hover:shadow-orange-500/40 hover:scale-105"
            >
              {t('pages.indiaTourism.hero.cta')} <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#destinations"
              className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all"
            >
              {t('pages.indiaTourism.hero.explore')}
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
          {STATS.map(s => (
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
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-2">{t('pages.indiaTourism.destinations.sectionLabel')}</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">{t('pages.indiaTourism.destinations.title')}</h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">{t('pages.indiaTourism.destinations.subtitle')}</p>
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
              <p className="font-semibold text-lg">{t('pages.indiaTourism.whyIndia.quote')}</p>
            </div>
          </div>
          <div>
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-3">{t('pages.indiaTourism.whyIndia.sectionLabel')}</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {t('pages.indiaTourism.whyIndia.title')}
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
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-2">{t('pages.indiaTourism.photoMosaic.sectionLabel')}</p>
            <h2 className="text-4xl font-extrabold text-gray-900">{t('pages.indiaTourism.photoMosaic.title')}</h2>
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
            <p className="text-blue-300 font-semibold uppercase tracking-widest text-sm mb-2">{t('pages.indiaTourism.evisaProcess.sectionLabel')}</p>
            <h2 className="text-4xl md:text-5xl font-extrabold">{t('pages.indiaTourism.evisaProcess.title')}</h2>
            <p className="mt-4 text-blue-200 text-lg max-w-2xl mx-auto">
              {t('pages.indiaTourism.evisaProcess.subtitle')}
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
              {t('pages.indiaTourism.evisaProcess.cta')} <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-blue-300 text-sm">
              {t('pages.indiaTourism.evisaProcess.disclaimer')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Best time to visit ── */}
      <section className="py-20 bg-amber-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-2">{t('pages.indiaTourism.bestTime.sectionLabel')}</p>
            <h2 className="text-4xl font-extrabold text-gray-900">{t('pages.indiaTourism.bestTime.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEASONS.map(s => (
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
            <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-2">{t('pages.indiaTourism.faq.sectionLabel')}</p>
            <h2 className="text-4xl font-extrabold text-gray-900">{t('pages.indiaTourism.faq.title')}</h2>
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
            {t('pages.indiaTourism.finalCta.heading1')}<br />
            {t('pages.indiaTourism.finalCta.heading2')}
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            {t('pages.indiaTourism.finalCta.subtitle')}
          </p>
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full text-xl transition-all shadow-2xl hover:scale-105"
          >
            {t('pages.indiaTourism.finalCta.cta')} <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

    </div>
  );
}
