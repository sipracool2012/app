import React from 'react';

export default function Press() {
  const pressReleases = [
    {
      date: "March 15, 2026",
      title: "Visa Application Platform Reaches 50K+ Processed Applications",
      excerpt: "Major milestone achieved as our platform helps thousands of users successfully navigate visa applications worldwide.",
      link: "#"
    },
    {
      date: "February 28, 2026",
      title: "Announcing Partnership with Leading Immigration Consultancies",
      excerpt: "Strategic partnerships expand our network of expert consultants available on our platform.",
      link: "#"
    },
    {
      date: "February 10, 2026",
      title: "New Feature: AI-Powered Document Verification",
      excerpt: "Introducing intelligent document scanning and verification to streamline the application process.",
      link: "#"
    },
    {
      date: "January 22, 2026",
      title: "Series A Funding: $10M Investment Announced",
      excerpt: "Secured Series A funding to accelerate product development and expand into new markets.",
      link: "#"
    },
    {
      date: "January 5, 2026",
      title: "Expanding Support to 50 New Countries",
      excerpt: "Launched visa application support for 50 additional countries, bringing our total to 150+ destinations.",
      link: "#"
    },
    {
      date: "December 15, 2025",
      title: "Awarded Best SaaS Startup in Immigration Technology",
      excerpt: "Recognized for innovation and customer satisfaction in the immigration tech sector.",
      link: "#"
    }
  ];

  const inTheNews = [
    {
      source: "TechCrunch",
      title: "How One Startup is Simplifying Visa Applications",
      date: "March 10, 2026"
    },
    {
      source: "Forbes",
      title: "The Future of Immigration: Q&A with Our CEO",
      date: "February 20, 2026"
    },
    {
      source: "VentureBeat",
      title: "Immigration Tech Platform Raises $10M Series A",
      date: "January 25, 2026"
    },
    {
      source: "BBC News",
      title: "Making Global Immigration Easier with Technology",
      date: "December 10, 2025"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Press & Media</h1>
          <p className="text-xl text-blue-100">Latest news and updates from our company</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Press Contact */}
        <section className="mb-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Press Contact</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Media Relations:</strong> press@clearevisa.com</p>
            {/*<p><strong>Phone:</strong> +1 (555) 123-4567</p>*/}
            <p><strong>Address:</strong> B1109 - Graffiti Glover Commercial, Pune, MH, 411036, India</p>
            <p className="mt-4">
              For press inquiries, interview requests, or media kits, please contact our press team at the email above.
            </p>
          </div>
        </section>

        {/* Press Releases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, idx) => (
              <article key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-sm text-gray-500 mb-2">{release.date}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{release.title}</h3>
                <p className="text-gray-700 mb-4">{release.excerpt}</p>
                <a href={release.link} className="text-blue-600 hover:text-blue-800 font-semibold">
                  Read Full Release →
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* In The News */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">In The News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inTheNews.map((article, idx) => (
              <article key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-sm text-blue-600 font-semibold mb-2">{article.source}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{article.title}</h3>
                <div className="text-sm text-gray-500">{article.date}</div>
              </article>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Kit</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-6">
              Download our media kit for logos, company photos, founder headshots, and other resources for press coverage.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Download Media Kit (PDF)
            </button>
          </div>
        </section>

        {/* Company Facts */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Company Facts</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <ul className="space-y-3 text-gray-700">
              <li>• <strong>Founded:</strong> 2025</li>
              <li>• <strong>Headquarters:</strong> Pune, Maharashtra, India</li>
              <li>• <strong>Team Size:</strong> 50+ employees globally</li>
              <li>• <strong>Countries Served:</strong> 150+</li>
              <li>• <strong>Applications Processed:</strong> 50,000+</li>
              <li>• <strong>Success Rate:</strong> 98%</li>
              <li>• <strong>Languages Supported:</strong> 25+</li>
             {/* <li>•  <strong>Funding:</strong> Series A: $10M </li> */}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
