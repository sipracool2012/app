import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, CheckCircle2, XCircle, AlertCircle, Clock,
  FileText, Shield, Info, ArrowRight, Plane,
  CalendarDays, RotateCcw, Users, ChevronDown, Loader2,
  CreditCard, Globe, Stamp
} from 'lucide-react';
import { FlagIcon } from '../components/ui/FlagIcon';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/* ── Helpers ──────────────────────────────────────────── */
const PURPOSES = [
  { value: 'tourist',           label: 'Tourism' },
  { value: 'business',          label: 'Business' },
  { value: 'medical',           label: 'Medical' },
  { value: 'medical_attendant', label: 'Medical Attendant' },
  { value: 'conference',        label: 'Conference / Seminar' },
  { value: 'transit',           label: 'Transit' },
];

const REQUIRED_DOCS = {
  tourist: [
    { label: 'Valid Passport', info: 'Must be valid for at least 6 months beyond your stay' },
    { label: 'Passport-size Photo', info: 'Recent photo, white background, no glasses' },
    { label: 'Accommodation details', info: 'Name and address of hotel or host' },
    { label: 'Return flight details', info: 'Confirmed onward or return ticket' },
  ],
  business: [
    { label: 'Valid Passport', info: 'Must be valid for at least 6 months beyond your stay' },
    { label: 'Passport-size Photo', info: 'Recent photo, white background, no glasses' },
    { label: 'Business invitation letter', info: 'From an Indian company or organisation' },
    { label: 'Company registration', info: 'Proof of your company or self-employment' },
  ],
  medical: [
    { label: 'Valid Passport', info: 'Must be valid for at least 6 months beyond your stay' },
    { label: 'Passport-size Photo', info: 'Recent photo, white background, no glasses' },
    { label: 'Medical appointment letter', info: 'From the Indian hospital or clinic' },
    { label: 'Hospital documentation', info: 'Doctor referral or diagnostic report' },
  ],
  medical_attendant: [
    { label: 'Valid Passport', info: 'Must be valid for at least 6 months beyond your stay' },
    { label: 'Passport-size Photo', info: 'Recent photo, white background, no glasses' },
    { label: "Patient's medical visa copy", info: "Copy of the patient's Medical eVisa" },
  ],
  conference: [
    { label: 'Valid Passport', info: 'Must be valid for at least 6 months beyond your stay' },
    { label: 'Passport-size Photo', info: 'Recent photo, white background, no glasses' },
    { label: 'Conference invitation letter', info: 'From the organising body in India' },
  ],
  transit: [
    { label: 'Valid Passport', info: 'Must be valid for at least 6 months beyond your stay' },
    { label: 'Onward ticket', info: 'Confirmed booking to next destination' },
    { label: 'Passport-size Photo', info: 'Recent photo, white background, no glasses' },
  ],
};

const ENTRY_REQUIREMENTS = [
  { icon: Shield,       label: 'Passport validity', value: 'Minimum 6 months beyond your travel dates' },
  { icon: FileText,     label: 'Blank pages',        value: 'At least 2 blank pages required' },
  { icon: Stamp,        label: 'Entry type',         value: 'Via designated eVisa airports & seaports only' },
  { icon: Users,        label: 'Minors',             value: 'Every traveller including children needs their own visa' },
];

const VISA_TYPE_LABEL = {
  tourist:           'Tourist',
  business:          'Business',
  medical:           'Medical',
  medical_attendant: 'Medical Attendant',
  conference:        'Conference',
  transit:           'Transit',
};

/* ── Tooltip ──────────────────────────────────────────── */
const Tooltip = ({ text }) => (
  <span className="relative group inline-flex ml-1 align-middle">
    <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20
                     w-48 rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg whitespace-normal">
      {text}
    </span>
  </span>
);

/* ── Country Search Dropdown ──────────────────────────── */
const CountryDropdown = ({ value, onChange, countries }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 80);

  const selected = countries.find(c => c.code === value);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 border rounded-lg bg-white text-left text-sm
                   hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {selected ? (
          <>
            <FlagIcon code={selected.code} width={20} height={15} />
            <span className="flex-1 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="flex-1 text-gray-400">Select passport country…</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-xl">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search country…"
                className="w-full pl-8 pr-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">No results found</li>
            ) : filtered.map(c => (
              <li
                key={c.code}
                onClick={() => { onChange(c.code); setOpen(false); setQuery(''); }}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50
                            ${value === c.code ? 'bg-blue-50 font-medium text-blue-700' : ''}`}
              >
                <FlagIcon code={c.code} width={20} height={15} />
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ── Visa Option Card ─────────────────────────────────── */
const VisaCard = ({ option, onApply }) => (
  <div className="border rounded-xl p-4 hover:border-blue-400 hover:shadow-sm transition bg-white">
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="font-semibold text-gray-900 text-sm">{option.name}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5">
            <RotateCcw className="w-3 h-3" /> {option.entries}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5">
            <Clock className="w-3 h-3" /> Stay: {option.stay_duration}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5">
            <CalendarDays className="w-3 h-3" /> Valid: {option.validity}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 rounded-full px-2.5 py-0.5">
            <Clock className="w-3 h-3" /> Approved by {option.approved_by}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xl font-bold text-gray-900">${option.price}</p>
        <p className="text-xs text-gray-500">per person</p>
      </div>
    </div>
    <Button
      size="sm"
      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white"
      onClick={() => onApply(option)}
    >
      Apply Now <ArrowRight className="ml-2 w-3.5 h-3.5" />
    </Button>
  </div>
);

/* ── Main Page ────────────────────────────────────────── */
export default function Requirements() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allCountries, setAllCountries] = useState([]);
  const [passportCode, setPassportCode] = useState(searchParams.get('from') || '');
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'tourist');
  const [results, setResults] = useState(null);   // null = not searched yet
  const [loading, setLoading] = useState(false);
  const [countryMeta, setCountryMeta] = useState(null);

  /* Load all countries once */
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/countries/all`)
      .then(r => r.json())
      .then(data => {
        // API returns country_code, country_name, flag_emoji
        const list = (data || []).map(c => ({ code: c.country_code, name: c.country_name, flag: c.flag_emoji || '' }));
        list.sort((a, b) => a.name.localeCompare(b.name));
        setAllCountries(list);
      })
      .catch(() => {});
  }, []);

  /* Auto-search if URL params are preset */
  useEffect(() => {
    if (passportCode) handleCheck(passportCode, purpose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCountries]);   // run once countries are loaded

  const handleCheck = async (code = passportCode, purp = purpose) => {
    if (!code) return;
    setLoading(true);
    setResults(null);

    // Update URL
    setSearchParams({ from: code, purpose: purp });

    const countryInfo = allCountries.find(c => c.code === code);
    setCountryMeta(countryInfo);

    try {
      const res = await fetch(`${BACKEND_URL}/api/countries/${code}/visa-options?purpose=${purp}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults({ has_evisa_options: false, options: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (option) => {
    navigate(`/visa/${option.id}?passport=${passportCode}&passportName=${encodeURIComponent(countryMeta?.name || passportCode)}`);
  };

  const docs = REQUIRED_DOCS[purpose] || REQUIRED_DOCS.tourist;
  const purposeLabel = PURPOSES.find(p => p.value === purpose)?.label || 'Tourism';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top bar ── */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <FlagIcon code="IN" width={28} height={21} />
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">India eVisa Requirements</h1>
            <p className="text-xs text-gray-500">Check if you need a visa and what documents are required</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">Official eVisa service for India</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* ── Left sidebar ── */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white border rounded-2xl shadow-sm p-5 lg:sticky lg:top-20">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              Check My Requirements
            </h2>

            {/* Destination – fixed */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Destination</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border rounded-lg bg-gray-50 text-sm">
                <FlagIcon code="IN" width={20} height={15} />
                <span className="text-gray-700">India</span>
                <Badge variant="secondary" className="ml-auto text-[10px] py-0">Fixed</Badge>
              </div>
            </div>

            {/* Passport country */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Passport Country <span className="text-red-500">*</span>
              </label>
              <CountryDropdown
                value={passportCode}
                onChange={setPassportCode}
                countries={allCountries}
              />
            </div>

            {/* Travel purpose */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Travel Purpose</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PURPOSES.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPurpose(p.value)}
                    className={`text-xs px-2 py-2 rounded-lg border text-left transition
                      ${purpose === p.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => handleCheck()}
              disabled={!passportCode || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Check Requirements
            </Button>

            {/* Info note */}
            <p className="mt-3 text-[11px] text-gray-400 text-center leading-snug">
              Results are based on your passport country and travel purpose.
            </p>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Empty state */}
          {!loading && results === null && (
            <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Select your passport country</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Choose your passport country and travel purpose to instantly see your India eVisa requirements and available options.
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Checking requirements…</p>
            </div>
          )}

          {/* Results */}
          {!loading && results && (
            <div className="space-y-4">

              {/* Status banner */}
              {results.has_evisa_options ? (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800">
                      eVisa available for{' '}
                      {countryMeta && <><FlagIcon code={countryMeta.code} width={18} height={13} className="inline mx-1" />{countryMeta.name}</>}
                      {' '}passport holders
                    </p>
                    <p className="text-sm text-green-700 mt-0.5">
                      You can apply online — no embassy visit required. Visa is sent to your email.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
                  <AlertCircle className="w-6 h-6 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-orange-800">
                      eVisa not currently available for {purposeLabel.toLowerCase()} travel
                    </p>
                    <p className="text-sm text-orange-700 mt-0.5">
                      {results.message || 'Please apply through the Indian embassy or consulate in your country.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Visa options */}
              {results.has_evisa_options && results.options?.length > 0 && (
                <Card>
                  <CardContent className="pt-5 pb-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      Available {VISA_TYPE_LABEL[purpose] || 'eVisa'} Options
                    </h3>
                    <div className="space-y-3">
                      {results.options.map(opt => (
                        <VisaCard key={opt.id} option={opt} onApply={handleApply} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Required documents */}
              <Card>
                <CardContent className="pt-5 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Required Documents
                    <span className="ml-1 text-xs font-normal text-gray-400">({purposeLabel})</span>
                  </h3>
                  <ul className="space-y-2">
                    {docs.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">
                          {doc.label}
                          <Tooltip text={doc.info} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Entry requirements */}
              <Card>
                <CardContent className="pt-5 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Entry Requirements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ENTRY_REQUIREMENTS.map(({ icon: Icon, label, value }, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">{label}</p>
                          <p className="text-sm text-gray-800 leading-snug">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Process steps */}
              <Card>
                <CardContent className="pt-5 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-blue-500" />
                    How to Apply
                  </h3>
                  <ol className="relative border-l border-blue-200 ml-2 space-y-5">
                    {[
                      { step: 'Fill in application', desc: 'Enter your personal details and travel information online.' },
                      { step: 'Upload documents',    desc: 'Upload a photo and any required supporting documents.' },
                      { step: 'Pay the visa fee',    desc: 'Secure online payment — all major cards accepted.' },
                      { step: 'Receive your eVisa',  desc: 'Approved eVisa delivered to your email within 2–5 business days.' },
                    ].map(({ step, desc }, i) => (
                      <li key={i} className="ml-4">
                        <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold ring-4 ring-white">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium text-gray-800">{step}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* CTA */}
              {results.has_evisa_options && (
                <div className="bg-blue-600 rounded-2xl p-6 text-center text-white">
                  <h3 className="text-lg font-bold mb-1">Ready to apply?</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Complete your India eVisa application online in minutes.
                  </p>
                  <Button
                    variant="secondary"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
                    onClick={() => navigate(`/?country=${passportCode}`)}
                  >
                    View All Visa Options <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
