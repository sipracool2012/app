import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Careers() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = React.useState(null);

  const jobs = [
    {
      id: 1,
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "We're looking for an experienced full stack engineer to join our growing team. You'll work with React, Node.js, and cloud technologies."
    },
    {
      id: 2,
      title: "Customer Success Manager",
      department: "Operations",
      location: "Remote",
      type: "Full-time",
      description: "Help our customers succeed by providing exceptional support and guidance throughout their visa application journey."
    },
    {
      id: 3,
      title: "Immigration Consultant",
      department: "Compliance",
      location: "Remote",
      type: "Full-time",
      description: "Join our team of immigration experts to help users navigate complex visa requirements across different countries."
    },
    {
      id: 4,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      description: "Lead the product strategy for our visa application platform and help shape the future of international mobility."
    },
    {
      id: 5,
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create beautiful and intuitive user experiences for millions of visa applicants worldwide."
    },
    {
      id: 6,
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      description: "Turn data into insights that help us improve our platform and better serve our users."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{t('pages.careers.title')}</h1>
          <p className="text-xl text-blue-100">{t('pages.careers.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Why Join Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.careers.whyJoin')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">🚀 Make an Impact</h3>
              <p className="text-gray-700">
                Help millions of people achieve their dreams by simplifying the visa application process.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">💼 Professional Growth</h3>
              <p className="text-gray-700">
                Work with talented professionals and continuous learning opportunities in a fast-growing startup.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">🌍 Global Team</h3>
              <p className="text-gray-700">
                Collaborate with diverse, talented people from around the world in a truly remote-first culture.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">💰 Competitive Benefits</h3>
              <p className="text-gray-700">
                Competitive salaries, equity options, health insurance, and generous time off.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">🎯 Clear Path Forward</h3>
              <p className="text-gray-700">
                Work in a structured environment with clear goals, mentorship, and career advancement opportunities.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">🎨 Flexible Work</h3>
              <p className="text-gray-700">
                Flexible working hours, remote options, and a focus on work-life balance.
              </p>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.careers.openPositions')}</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md">
                <button
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-sm text-gray-600">{job.department}</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{job.location}</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl text-gray-400">
                      {expandedId === job.id ? '−' : '+'}
                    </span>
                  </div>
                </button>
                {expandedId === job.id && (
                  <div className="px-6 pb-4 border-t border-gray-200">
                    <p className="text-gray-700 mb-4">{job.description}</p>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      {t('pages.careers.applyNow')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Culture Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.careers.ourCulture')}</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg text-gray-700 mb-4">
              We believe in creating a workplace where great people can do their best work. Our culture is built on:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>• <strong>Trust & Autonomy:</strong> We trust our team members to make decisions and own their work</li>
              <li>• <strong>Collaboration:</strong> We work together across teams and time zones to achieve common goals</li>
              <li>• <strong>Continuous Learning:</strong> We invest in your development with training, conferences, and mentorship</li>
              <li>• <strong>Diversity & Inclusion:</strong> We celebrate different perspectives and backgrounds</li>
              <li>• <strong>Work-Life Balance:</strong> We believe in sustainable pace and time for personal wellbeing</li>
              <li>• <strong>Transparency:</strong> We communicate openly about company performance, challenges, and opportunities</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
