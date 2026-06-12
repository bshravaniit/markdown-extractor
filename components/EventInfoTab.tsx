import React from 'react';

const TICKET_TIERS = [
  { tier: 'General', price: '$35', perks: 'Floor/balcony seating', color: 'bg-slate-50 border-slate-200' },
  { tier: 'Preferred', price: '$75', perks: 'Priority seating, main floor', color: 'bg-violet-50 border-violet-200' },
  { tier: 'Patron', price: '$150', perks: 'Reserved front section, program booklet', color: 'bg-amber-50 border-amber-200' },
  { tier: 'Benefactor / VIP', price: '$250', perks: 'VIP seating, meet-and-greet opportunity', color: 'bg-yellow-50 border-yellow-300' },
];

const FAQ = [
  {
    q: 'Who is Gurudev Sri Sri Ravi Shankar?',
    a: 'A globally respected humanitarian and spiritual teacher who has brought yoga, meditation, and Sudarshan Kriya to over 180 countries. He founded the Art of Living Foundation (1981) and the International Association for Human Values. His programs have reached 500+ million people.',
  },
  {
    q: 'What happens during the evening?',
    a: 'The evening includes a guided meditation and breathing session, a talk by Gurudev on inner peace, resilience, and human potential, and a Q&A. The atmosphere is inclusive and non-religious — suitable for people of all backgrounds.',
  },
  {
    q: 'Is this a religious event?',
    a: 'No. While Gurudev is a spiritual teacher, the event is open to people of all faiths and none. It focuses on universal values — stress reduction, inner well-being, and human connection.',
  },
  {
    q: 'Are group discounts available?',
    a: 'Yes — groups of 10+ receive 15% off. Contact us to arrange group ticketing. This is a great opportunity for corporate wellness teams, community organizations, yoga studios, and church groups.',
  },
  {
    q: 'How do I register?',
    a: 'Visit tiny.cc/july9 to register online. For group bookings or questions, reach out to the Art of Living Battle Creek/Kalamazoo chapter.',
  },
  {
    q: 'Is parking available at the venue?',
    a: 'Yes — W.K. Kellogg Auditorium has adjacent parking. Additional street and garage parking is available nearby in downtown Battle Creek.',
  },
];

export default function EventInfoTab() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">

      {/* Hero Card */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 text-white p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">☯</span>
          <div>
            <p className="text-violet-200 text-sm font-medium uppercase tracking-widest">Art of Living Foundation</p>
            <h1 className="text-2xl font-bold leading-tight">The Journey Within</h1>
          </div>
        </div>
        <p className="text-lg text-violet-100 font-medium mb-6">
          An Evening with <span className="text-white font-bold">Gurudev Sri Sri Ravi Shankar</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <i className="ph ph-calendar text-violet-200"></i>
              <span className="text-xs text-violet-200 uppercase tracking-wider font-medium">Date & Time</span>
            </div>
            <p className="font-bold text-white">Wednesday, July 9, 2025</p>
            <p className="text-violet-200 text-sm">7:00 PM – 9:00 PM</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <i className="ph ph-map-pin text-violet-200"></i>
              <span className="text-xs text-violet-200 uppercase tracking-wider font-medium">Venue</span>
            </div>
            <p className="font-bold text-white">W.K. Kellogg Auditorium</p>
            <p className="text-violet-200 text-sm">25 Michigan Ave W, Battle Creek</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <a
            href="https://tiny.cc/july9"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors text-sm shadow"
          >
            <i className="ph ph-ticket"></i>
            Register — tiny.cc/july9
          </a>
          <span className="text-violet-200 text-sm">Goal: <span className="text-white font-bold">2,000 attendees</span></span>
        </div>
      </div>

      {/* QR Code + Link Block */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm">
        <div className="flex-shrink-0 w-24 h-24 bg-gray-900 rounded-xl flex items-center justify-center">
          <div className="grid grid-cols-3 gap-0.5 scale-90">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`w-6 h-6 rounded-sm ${[0,1,3,4,5,7,8].includes(i) ? 'bg-white' : 'bg-gray-900'}`}></div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">tiny.cc/july9</p>
          <p className="text-gray-500 text-sm mt-1">Share this link with prospects via email, text, or social media</p>
          <button
            onClick={() => navigator.clipboard.writeText('tiny.cc/july9')}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium"
          >
            <i className="ph ph-copy"></i> Copy link
          </button>
        </div>
      </div>

      {/* Ticket Tiers */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i className="ph ph-ticket text-violet-600"></i> Ticket Tiers
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {TICKET_TIERS.map(t => (
            <div key={t.tier} className={`border rounded-xl p-4 ${t.color}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-900">{t.tier}</span>
                <span className="text-xl font-black text-violet-700">{t.price}</span>
              </div>
              <p className="text-sm text-gray-600">{t.perks}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center gap-2">
          <i className="ph ph-users text-amber-600 text-base flex-shrink-0"></i>
          <span><strong>Group Discount:</strong> 10+ tickets → 15% off. Great for corporate teams, yoga studios, and community orgs.</span>
        </div>
      </div>

      {/* About Gurudev */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i className="ph ph-star text-violet-600"></i> About Gurudev
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Gurudev Sri Sri Ravi Shankar is a globally revered humanitarian, spiritual teacher, and peace ambassador.
          He has reached over <strong>500 million people</strong> in 180+ countries through the Art of Living Foundation and the
          International Association for Human Values. His work spans stress elimination programs, conflict resolution,
          disaster relief, and prisoner rehabilitation. He is widely recognized by the United Nations and heads of state
          worldwide as a leading voice for human values and inner peace.
        </p>
        <p className="text-gray-600 text-sm mt-3 leading-relaxed">
          His signature Sudarshan Kriya breathing technique — taught in Art of Living courses globally — is backed by
          over 100 independent scientific studies demonstrating benefits for anxiety, depression, PTSD, and overall well-being.
        </p>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i className="ph ph-question text-violet-600"></i> FAQ
        </h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 text-sm flex items-center justify-between list-none">
                {item.q}
                <i className="ph ph-caret-down text-gray-400 group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Outreach Elevator Pitch */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i className="ph ph-megaphone text-violet-600"></i> Volunteer Elevator Pitch
        </h2>
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed italic border-l-4 border-violet-400">
          "We're hosting a very special evening on July 9th at the Kellogg Auditorium in Battle Creek — Gurudev Sri Sri Ravi Shankar,
          a global meditation and wellness teacher who's worked with over 500 million people, is coming to Michigan. It's two hours of
          guided meditation, a talk on inner peace, and Q&A. Tickets start at $35 — and group discounts are available for 10 or more.
          I thought [your org] would really enjoy bringing a group. Can I send you the link?"
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(`We're hosting a very special evening on July 9th at the Kellogg Auditorium in Battle Creek — Gurudev Sri Sri Ravi Shankar, a global meditation and wellness teacher who's worked with over 500 million people, is coming to Michigan. It's two hours of guided meditation, a talk on inner peace, and Q&A. Tickets start at $35 — and group discounts are available for 10 or more. I thought your organization would really enjoy bringing a group. You can register at tiny.cc/july9`)}
          className="mt-3 inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium"
        >
          <i className="ph ph-copy"></i> Copy pitch
        </button>
      </div>

    </div>
  );
}
