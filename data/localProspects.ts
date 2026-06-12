import { Prospect, ProspectCategory } from '../types';

type SeedProspect = Omit<Prospect, 'id' | 'status' | 'outreachDrafts' | 'addedAt' | 'isFromDatabase'>;

const SEED: SeedProspect[] = [
  // ── Wellness / Yoga ──────────────────────────────────────────────────
  { name: 'Kalamazoo Yoga Center', category: 'wellness', address: '3415 W Michigan Ave', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 382-9642', contactPerson: 'Studio Manager' },
  { name: 'Hot Yoga of Kalamazoo', category: 'wellness', address: '5800 Gull Rd', city: 'Kalamazoo', zipCode: '49048', phone: '(269) 553-9165', contactPerson: 'Front Desk' },
  { name: 'Synergy Yoga & Wellness', category: 'wellness', address: '150 E Michigan Ave', city: 'Battle Creek', zipCode: '49017', phone: '(269) 964-7800', contactPerson: 'Owner' },
  { name: 'The Yoga Room Battle Creek', category: 'wellness', address: '10 Capital Ave SW', city: 'Battle Creek', zipCode: '49015', phone: '(269) 441-9030' },
  { name: 'Inner Peace Yoga Studio', category: 'wellness', address: '5015 W Main St', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 373-1200', contactPerson: 'Studio Director' },
  { name: 'Breathe Wellness Center', category: 'wellness', address: '2920 S 9th St', city: 'Kalamazoo', zipCode: '49009', phone: '(269) 344-8080' },
  { name: 'Lotus Wellness & Meditation', category: 'wellness', address: '3450 Greenleaf Blvd', city: 'Kalamazoo', zipCode: '49008', phone: '(269) 388-7500', contactPerson: 'Wellness Coordinator' },
  { name: 'Portage Yoga & Pilates', category: 'wellness', address: '8719 Shaver Rd', city: 'Portage', zipCode: '49024', phone: '(269) 323-5900' },
  { name: 'Zen Space Mindfulness Studio', category: 'wellness', address: '321 Portage St', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 226-8300', contactPerson: 'Studio Owner' },
  { name: 'Healing Arts Center', category: 'wellness', address: '5030 W Dickman Rd', city: 'Battle Creek', zipCode: '49015', phone: '(269) 979-3600' },
  { name: 'Awaken Yoga Kalamazoo', category: 'wellness', address: '1601 S Burdick St', city: 'Kalamazoo', zipCode: '49001', phone: '(269) 492-5550', contactPerson: 'Director' },
  { name: 'Serenity Holistic Center', category: 'wellness', address: '4820 W Main St', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 373-4000' },

  // ── Churches & Spiritual ─────────────────────────────────────────────
  { name: 'First United Methodist — Battle Creek', category: 'church', address: '111 E Michigan Ave', city: 'Battle Creek', zipCode: '49017', phone: '(269) 963-2702', contactPerson: 'Pastor / Admin' },
  { name: 'First United Methodist — Kalamazoo', category: 'church', address: '212 S Park St', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 381-6340', contactPerson: 'Office Manager' },
  { name: 'Radiant Church Kalamazoo', category: 'church', address: '5420 Gull Rd', city: 'Kalamazoo', zipCode: '49048', phone: '(269) 381-3800', contactPerson: 'Community Outreach' },
  { name: 'Third Coast Vineyard Church', category: 'church', address: '4815 W Main St', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 353-5999' },
  { name: 'Kalamazoo Vedanta Society', category: 'church', address: '1040 Oakland Dr', city: 'Kalamazoo', zipCode: '49008', phone: '(269) 345-3812', contactPerson: 'Swami / President', notes: 'Strong alignment — Vedantic community' },
  { name: 'Unity of Kalamazoo', category: 'church', address: '711 W Lovell St', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 345-0550', contactPerson: 'Minister', notes: 'Universal spiritual teachings, great fit' },
  { name: "People's Church Kalamazoo", category: 'church', address: '1700 Division St', city: 'Kalamazoo', zipCode: '49001', phone: '(269) 381-3800', contactPerson: 'Community Pastor' },
  { name: 'Sacred Heart Catholic Church', category: 'church', address: '4513 W Main St', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 375-5760' },
  { name: 'New Life Church Battle Creek', category: 'church', address: '1850 Beckley Rd', city: 'Battle Creek', zipCode: '49015', phone: '(269) 964-0111', contactPerson: 'Community Director' },
  { name: 'First Congregational Church BC', category: 'church', address: '145 W Michigan Ave', city: 'Battle Creek', zipCode: '49017', phone: '(269) 965-5795' },

  // ── Hospitals & Healthcare ───────────────────────────────────────────
  { name: 'Bronson Methodist Hospital — Wellness', category: 'hospital', address: '601 John St', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 341-6000', contactPerson: 'Employee Wellness Coordinator', notes: 'Ask about employee wellness programming' },
  { name: 'Ascension Borgess Hospital (HR)', category: 'hospital', address: '1521 Gull Rd', city: 'Kalamazoo', zipCode: '49048', phone: '(269) 226-7000', contactPerson: 'HR / Wellness Dept' },
  { name: 'Battle Creek VA Medical Center', category: 'hospital', address: '5500 Armstrong Rd', city: 'Battle Creek', zipCode: '49037', phone: '(269) 966-5600', contactPerson: 'Recreation Therapy', notes: 'Veteran mindfulness programs — strong fit' },
  { name: 'Bronson Battle Creek Hospital', category: 'hospital', address: '300 North Ave', city: 'Battle Creek', zipCode: '49017', phone: '(269) 245-8000', contactPerson: 'Community Health Dept' },
  { name: 'Kalamazoo Community Mental Health', category: 'hospital', address: '1200 Academy St', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 373-6000', contactPerson: 'Program Director' },
  { name: 'Mind Body Integrative Health', category: 'hospital', address: '2020 Portage St', city: 'Kalamazoo', zipCode: '49001', phone: '(269) 382-8050' },
  { name: 'Western Michigan Therapy Center', category: 'hospital', address: '3920 Gull Rd', city: 'Kalamazoo', zipCode: '49048', phone: '(269) 553-8400', contactPerson: 'Clinical Director' },
  { name: 'Advanced Therapy & Wellness', category: 'hospital', address: '2500 W Michigan Ave', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 373-9100' },

  // ── Corporate / HR ───────────────────────────────────────────────────
  { name: 'Kellogg Company — HR & Wellness', category: 'corporate', address: 'One Kellogg Square', city: 'Battle Creek', zipCode: '49016', phone: '(269) 961-2000', contactPerson: 'Employee Wellness Manager', notes: 'Flagship company — group tickets pitch' },
  { name: 'Post Consumer Brands HR', category: 'corporate', address: '2 Hanson Pl', city: 'Battle Creek', zipCode: '49014', phone: '(269) 963-9531', contactPerson: 'HR Director' },
  { name: 'Stryker Corporation HR', category: 'corporate', address: '2825 Airview Blvd', city: 'Kalamazoo', zipCode: '49002', phone: '(269) 385-2600', contactPerson: 'Benefits & Wellness Team', notes: 'Large employer, wellness-focused culture' },
  { name: 'W.K. Kellogg Foundation', category: 'corporate', address: 'One Michigan Ave E', city: 'Battle Creek', zipCode: '49017', phone: '(269) 968-1611', contactPerson: 'Community Programs', notes: 'Community investment focus — natural partner' },
  { name: 'Zoetis — Employee Wellness', category: 'corporate', address: '333 Portage St', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 833-3000', contactPerson: 'HR Wellness Coordinator' },
  { name: 'Western Michigan University HR', category: 'corporate', address: '1903 W Michigan Ave', city: 'Kalamazoo', zipCode: '49008', phone: '(269) 387-3620', contactPerson: 'Faculty & Staff Development', notes: 'Ask about staff wellness and student orgs' },
  { name: 'Kalamazoo Valley Community College', category: 'corporate', address: '6767 W O Ave', city: 'Kalamazoo', zipCode: '49003', phone: '(269) 488-4400', contactPerson: 'Student Affairs / HR' },
  { name: 'Parker Hannifin — Kalamazoo', category: 'corporate', address: '5885 Venture Park Dr', city: 'Kalamazoo', zipCode: '49009', phone: '(269) 375-9901', contactPerson: 'HR Manager' },
  { name: 'Fabri-Kal Corporation HR', category: 'corporate', address: '600 Plastics Pl', city: 'Kalamazoo', zipCode: '49001', phone: '(269) 385-5050', contactPerson: 'Employee Relations' },
  { name: 'Battle Creek Community Foundation', category: 'corporate', address: '32 W Michigan Ave', city: 'Battle Creek', zipCode: '49017', phone: '(269) 962-2181', contactPerson: 'Executive Director', notes: 'Community grants focus — co-promotion opportunity' },

  // ── Community Organizations ──────────────────────────────────────────
  { name: 'YMCA of Greater Kalamazoo', category: 'community', address: '1001 W Paterson St', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 345-9622', contactPerson: 'Program Director' },
  { name: 'YMCA of Battle Creek', category: 'community', address: '95 W Michigan Ave', city: 'Battle Creek', zipCode: '49017', phone: '(269) 962-5548', contactPerson: 'Community Programs' },
  { name: 'YWCA Kalamazoo', category: 'community', address: '353 E Michigan Ave', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 345-5595', contactPerson: 'Community Outreach' },
  { name: 'Kalamazoo Regional Chamber', category: 'community', address: '346 W Michigan Ave', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 381-4000', contactPerson: 'Events Coordinator' },
  { name: 'Battle Creek Area Chamber', category: 'community', address: '77 E Michigan Ave', city: 'Battle Creek', zipCode: '49017', phone: '(269) 962-4076', contactPerson: 'Events & Programs Manager' },
  { name: 'Greater Kalamazoo United Way', category: 'community', address: '709 S Westnedge Ave', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 381-3800', contactPerson: 'Community Impact Manager' },
  { name: 'SW Michigan Volunteer Center', category: 'community', address: '191 E Michigan Ave', city: 'Battle Creek', zipCode: '49017', phone: '(269) 441-7387', contactPerson: 'Volunteer Coordinator' },
  { name: 'ArtPlace Kalamazoo', category: 'community', address: '359 S Kalamazoo Mall', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 342-5059', contactPerson: 'Executive Director' },

  // ── Cultural & Ethnic Organizations ──────────────────────────────────
  { name: 'India Association of Kalamazoo', category: 'cultural', address: '2812 Indian Hills Dr', city: 'Kalamazoo', zipCode: '49008', phone: '(269) 345-0001', contactPerson: 'President', notes: 'South Asian community — primary target for high headcount' },
  { name: 'Telugu Cultural Assoc SW Michigan', category: 'cultural', address: '1840 Wesleyan Blvd', city: 'Portage', zipCode: '49002', phone: '(269) 323-0550', contactPerson: 'President', notes: 'Active community group — mass ticket potential' },
  { name: 'Gujarati Samaj of SW Michigan', category: 'cultural', address: '4250 W Main St', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 373-0750', contactPerson: 'Community Chair' },
  { name: 'Pakistani American Alliance Kzoo', category: 'cultural', address: '2120 S Burdick St', city: 'Kalamazoo', zipCode: '49001', phone: '(269) 492-0330', contactPerson: 'Chair' },
  { name: 'Hindu Swayamsevak Sangh Kzoo', category: 'cultural', address: '3420 W Michigan Ave', city: 'Kalamazoo', zipCode: '49008', phone: '(269) 388-0800', contactPerson: 'President', notes: 'Direct Art of Living community connection' },
  { name: 'Kzoo International Community Center', category: 'cultural', address: '309 N Rose St', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 226-0900', contactPerson: 'Program Manager' },
  { name: 'South Asian Cultural Society Michigan', category: 'cultural', address: '5100 Portage Rd', city: 'Portage', zipCode: '49002', phone: '(269) 323-1100', contactPerson: 'Secretary' },

  // ── Fitness Centers ──────────────────────────────────────────────────
  { name: 'Orangetheory Fitness Kalamazoo', category: 'fitness', address: '5180 W Main St', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 978-8000', contactPerson: 'Studio Manager' },
  { name: 'CrossFit Kalamazoo', category: 'fitness', address: '200 E Alcott St', city: 'Kalamazoo', zipCode: '49001', phone: '(269) 492-7800' },
  { name: 'Anytime Fitness Battle Creek', category: 'fitness', address: '5760 Beckley Rd', city: 'Battle Creek', zipCode: '49015', phone: '(269) 979-9000', contactPerson: 'Club Owner' },
  { name: 'Planet Fitness Battle Creek', category: 'fitness', address: '5810 Beckley Rd', city: 'Battle Creek', zipCode: '49015', phone: '(269) 979-7500', contactPerson: 'Club Manager' },
  { name: 'F45 Training Portage', category: 'fitness', address: '8640 Shaver Rd', city: 'Portage', zipCode: '49024', phone: '(269) 323-4500', contactPerson: 'Studio Owner' },

  // ── Restaurants (flyer / social) ─────────────────────────────────────
  { name: 'Saffron Indian Cuisine', category: 'restaurant', address: '4501 W Main St', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 375-1400', contactPerson: 'Owner / Manager', notes: 'Great for flyer display and community word-of-mouth' },
  { name: 'Bombay Masala', category: 'restaurant', address: '2625 S Westnedge Ave', city: 'Kalamazoo', zipCode: '49008', phone: '(269) 488-6600', contactPerson: 'Manager' },
  { name: 'Curry in Hurry', category: 'restaurant', address: '5026 W Michigan Ave', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 373-2200' },
  { name: 'Udupi Café Kalamazoo', category: 'restaurant', address: '1404 E Michigan Ave', city: 'Kalamazoo', zipCode: '49001', phone: '(269) 492-3300', contactPerson: 'Owner', notes: 'Vegetarian South Indian — Art of Living crowd regular' },
  { name: 'Himalayan Cuisine', category: 'restaurant', address: '321 W Michigan Ave', city: 'Kalamazoo', zipCode: '49007', phone: '(269) 226-5500' },
  { name: 'Spice Garden Restaurant', category: 'restaurant', address: '2815 S Westnedge Ave', city: 'Kalamazoo', zipCode: '49008', phone: '(269) 488-7700', contactPerson: 'Owner' },
  { name: 'Dosa Kitchen Kalamazoo', category: 'restaurant', address: '3020 W Main St', city: 'Kalamazoo', zipCode: '49006', phone: '(269) 373-8800' },
  { name: 'Mughal Garden — Battle Creek', category: 'restaurant', address: '5720 Beckley Rd', city: 'Battle Creek', zipCode: '49017', phone: '(269) 979-4400', contactPerson: 'Manager' },
];

let _counter = 1;
function seedId(): string {
  return `seed-${String(_counter++).padStart(3, '0')}`;
}

export function getSeedProspects(): Prospect[] {
  _counter = 1;
  const now = new Date().toISOString();
  return SEED.map(s => ({
    ...s,
    id: seedId(),
    status: 'new' as const,
    outreachDrafts: [],
    addedAt: now,
    isFromDatabase: true,
  }));
}

export const CATEGORY_LABELS: Record<ProspectCategory, string> = {
  wellness: 'Wellness / Yoga',
  church: 'Church / Spiritual',
  hospital: 'Hospital / Healthcare',
  corporate: 'Corporate HR',
  community: 'Community Org',
  education: 'Education',
  cultural: 'Cultural / Ethnic',
  fitness: 'Fitness',
  restaurant: 'Restaurant',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<ProspectCategory, string> = {
  wellness: 'bg-emerald-100 text-emerald-800',
  church: 'bg-violet-100 text-violet-800',
  hospital: 'bg-blue-100 text-blue-800',
  corporate: 'bg-slate-100 text-slate-800',
  community: 'bg-amber-100 text-amber-800',
  education: 'bg-cyan-100 text-cyan-800',
  cultural: 'bg-orange-100 text-orange-800',
  fitness: 'bg-lime-100 text-lime-800',
  restaurant: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-700',
};

export const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  responded: 'Responded',
  committed: 'Committed',
  converted: 'Converted',
};

export const STATUS_COLORS: Record<string, string> = {
  new: 'bg-gray-100 text-gray-600',
  contacted: 'bg-blue-100 text-blue-700',
  responded: 'bg-yellow-100 text-yellow-800',
  committed: 'bg-orange-100 text-orange-800',
  converted: 'bg-green-100 text-green-800',
};

export const ALL_ZIP_CODES = [
  { zip: '', label: 'All Areas' },
  { zip: '49017', label: '49017 — Battle Creek (Central)' },
  { zip: '49015', label: '49015 — Battle Creek (West)' },
  { zip: '49014', label: '49014 — Battle Creek (East)' },
  { zip: '49016', label: '49016 — Battle Creek (Corp)' },
  { zip: '49037', label: '49037 — Battle Creek (North)' },
  { zip: '49007', label: '49007 — Kalamazoo (Central)' },
  { zip: '49006', label: '49006 — Kalamazoo (West)' },
  { zip: '49008', label: '49008 — Kalamazoo (South)' },
  { zip: '49001', label: '49001 — Kalamazoo (East)' },
  { zip: '49009', label: '49009 — Kalamazoo (SW)' },
  { zip: '49048', label: '49048 — Kalamazoo (Gull Rd)' },
  { zip: '49002', label: '49002 — Portage (South)' },
  { zip: '49024', label: '49024 — Portage (West)' },
  { zip: '49003', label: '49003 — Kalamazoo Twp' },
];
