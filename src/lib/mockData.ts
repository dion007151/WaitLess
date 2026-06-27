// Mock data layer for WaitLess demo mode
// Replace with real Supabase queries when credentials are available

import { addMinutes, subMinutes, format, subDays } from 'date-fns';

export type QueueStatus = 'waiting' | 'called' | 'served' | 'no_show';

export interface Business {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  owner_id: string;
  subscription_plan: 'free' | 'pro';
  settings: {
    prefix: string;
    welcome_message: string;
    operating_hours: string;
    max_capacity: number;
    sms_enabled: boolean;
    auto_reset: boolean;
    custom_message: string;
  };
}

export interface QueueEntry {
  id: string;
  queue_id: string;
  number: number;
  display_number: string;
  phone: string | null;
  status: QueueStatus;
  joined_at: Date;
  called_at: Date | null;
  served_at: Date | null;
  counter_number: number | null;
  wait_minutes: number;
}

export interface Staff {
  id: string;
  business_id: string;
  name: string;
  email: string;
  counter_number: number;
  role: 'staff' | 'admin';
  is_active: boolean;
}

export interface DailyStats {
  date: string;
  served: number;
  noshow: number;
  avg_wait: number;
  peak_hour: string;
}

// ──────────────────────────────────────────────────────────
// DEMO BUSINESS
// ──────────────────────────────────────────────────────────
export const DEMO_BUSINESS: Business = {
  id: 'biz-reyes-dental-001',
  name: 'Reyes Dental Clinic',
  slug: 'reyes-dental',
  logo_url: null,
  owner_id: 'owner-001',
  subscription_plan: 'pro',
  settings: {
    prefix: 'A',
    welcome_message: 'Welcome to Reyes Dental Clinic! Please get your queue number and wait to be called.',
    operating_hours: 'Monday – Saturday, 8:00 AM – 6:00 PM',
    max_capacity: 60,
    sms_enabled: true,
    auto_reset: true,
    custom_message: `Magandang araw! We'll call your number when it's your turn. Salamat sa inyong pasensya! 🦷`,
  },
};

// ──────────────────────────────────────────────────────────
// STAFF
// ──────────────────────────────────────────────────────────
export const DEMO_STAFF: Staff[] = [
  {
    id: 'staff-001',
    business_id: 'biz-reyes-dental-001',
    name: 'Ate Maria Santos',
    email: 'maria@reyesdental.com',
    counter_number: 1,
    role: 'staff',
    is_active: true,
  },
  {
    id: 'staff-002',
    business_id: 'biz-reyes-dental-001',
    name: 'Kuya Jun Reyes',
    email: 'jun@reyesdental.com',
    counter_number: 2,
    role: 'admin',
    is_active: true,
  },
  {
    id: 'staff-003',
    business_id: 'biz-reyes-dental-001',
    name: 'Dr. Ana Reyes',
    email: 'dr.ana@reyesdental.com',
    counter_number: 1,
    role: 'admin',
    is_active: false,
  },
];

// ──────────────────────────────────────────────────────────
// TODAY'S QUEUE ENTRIES
// ──────────────────────────────────────────────────────────
const now = new Date();

function makeEntry(
  num: number,
  status: QueueStatus,
  minutesAgo: number,
  calledMinutesAgo?: number,
  servedMinutesAgo?: number,
  counter?: number,
): QueueEntry {
  const joined = subMinutes(now, minutesAgo);
  const called = calledMinutesAgo != null ? subMinutes(now, calledMinutesAgo) : null;
  const served = servedMinutesAgo != null ? subMinutes(now, servedMinutesAgo) : null;
  const waitMins = calledMinutesAgo != null ? minutesAgo - calledMinutesAgo : minutesAgo;
  return {
    id: `entry-${num}`,
    queue_id: 'queue-today-001',
    number: num,
    display_number: `A-0${String(num).padStart(2, '0')}`,
    phone: num % 3 === 0 ? '+639171234567' : null,
    status,
    joined_at: joined,
    called_at: called,
    served_at: served,
    counter_number: counter ?? null,
    wait_minutes: waitMins,
  };
}

export const DEMO_ENTRIES: QueueEntry[] = [
  makeEntry(1, 'served',  180, 165, 150, 1),
  makeEntry(2, 'served',  175, 160, 143, 2),
  makeEntry(3, 'served',  165, 148, 132, 1),
  makeEntry(4, 'served',  158, 140, 124, 2),
  makeEntry(5, 'no_show', 150, 132, undefined, 1),
  makeEntry(6, 'served',  145, 128, 112, 2),
  makeEntry(7, 'served',  138, 120, 105, 1),
  makeEntry(8, 'served',  130, 112,  96, 2),
  makeEntry(9, 'no_show', 122, 104, undefined, 1),
  makeEntry(10,'served',  115,  98,  83, 2),
  makeEntry(11,'served',  108,  90,  75, 1),
  makeEntry(12,'called',   60,  10, undefined, 1),
  makeEntry(13,'waiting',  35,  undefined, undefined),
  makeEntry(14,'waiting',  22,  undefined, undefined),
  makeEntry(15,'waiting',   8,  undefined, undefined),
];

// ──────────────────────────────────────────────────────────
// QUEUE STATE (mutable for demo)
// ──────────────────────────────────────────────────────────
let _entries: QueueEntry[] = [...DEMO_ENTRIES];
let _currentNumber = 12; // A-012 is currently being served
let _queuePaused = false;
let _pauseReason = '';
let _nextNumberCounter = 16;

export function getEntries(): QueueEntry[] { return _entries; }
export function getCurrentNumber(): number { return _currentNumber; }
export function getQueuePaused(): boolean { return _queuePaused; }
export function getPauseReason(): string { return _pauseReason; }

export function getWaitingEntries() {
  return _entries.filter(e => e.status === 'waiting');
}

export function getCalledEntry() {
  return _entries.find(e => e.status === 'called') ?? null;
}

export function getEstimatedWait(position: number): number {
  // Avg 8 minutes per person
  return position * 8;
}

export function getPeopleAhead(myNumber: number): number {
  const waiting = _entries.filter(e => e.status === 'waiting' && e.number < myNumber);
  const called = _entries.filter(e => e.status === 'called');
  return waiting.length + called.length;
}

export function callNext(): QueueEntry | null {
  // Mark current called as served
  const curCalled = _entries.find(e => e.status === 'called');
  if (curCalled) {
    curCalled.status = 'served';
    curCalled.served_at = new Date();
  }

  // Find next waiting
  const nextWaiting = _entries
    .filter(e => e.status === 'waiting')
    .sort((a, b) => a.number - b.number)[0];

  if (!nextWaiting) return null;

  nextWaiting.status = 'called';
  nextWaiting.called_at = new Date();
  nextWaiting.counter_number = 1;
  _currentNumber = nextWaiting.number;
  _entries = [..._entries];
  return nextWaiting;
}

export function skipCurrent(): void {
  const curCalled = _entries.find(e => e.status === 'called');
  if (curCalled) {
    curCalled.status = 'no_show';
    _entries = [..._entries];
  }
  callNext();
}

export function markServed(entryId: string): void {
  const entry = _entries.find(e => e.id === entryId);
  if (entry) {
    entry.status = 'served';
    entry.served_at = new Date();
    _entries = [..._entries];
  }
}

export function pauseQueue(reason: string): void {
  _queuePaused = true;
  _pauseReason = reason;
}

export function resumeQueue(): void {
  _queuePaused = false;
  _pauseReason = '';
}

export function joinQueue(phone?: string): QueueEntry {
  const num = _nextNumberCounter++;
  const entry: QueueEntry = {
    id: `entry-${num}`,
    queue_id: 'queue-today-001',
    number: num,
    display_number: `A-0${String(num).padStart(2, '0')}`,
    phone: phone ?? null,
    status: 'waiting',
    joined_at: new Date(),
    called_at: null,
    served_at: null,
    counter_number: null,
    wait_minutes: 0,
  };
  _entries = [..._entries, entry];
  return entry;
}

// ──────────────────────────────────────────────────────────
// STATS
// ──────────────────────────────────────────────────────────
export function getTodayStats() {
  const served = _entries.filter(e => e.status === 'served');
  const noshow = _entries.filter(e => e.status === 'no_show');
  const waiting = _entries.filter(e => e.status === 'waiting' || e.status === 'called');

  const avgWait = served.length > 0
    ? Math.round(served.reduce((acc, e) => {
        if (e.called_at && e.joined_at) {
          return acc + (e.called_at.getTime() - e.joined_at.getTime()) / 60000;
        }
        return acc + 12;
      }, 0) / served.length)
    : 0;

  const longestWait = Math.max(...served.map(e => e.wait_minutes || 0), 0);
  const noshowRate = _entries.length > 0
    ? Math.round((noshow.length / _entries.length) * 100)
    : 0;

  return {
    totalServed: served.length,
    avgWaitTime: avgWait,
    currentQueueLength: waiting.length,
    longestWait,
    noshowRate,
    noShowCount: noshow.length,
    peakHour: '10:00 AM – 11:00 AM',
  };
}

// ──────────────────────────────────────────────────────────
// 7-DAY HISTORY (realistic Filipino business patterns)
// ──────────────────────────────────────────────────────────
export function getWeeklyHistory(): DailyStats[] {
  const days = [
    { served: 42, noshow: 4, avg_wait: 14, peak_hour: '10am' },
    { served: 38, noshow: 6, avg_wait: 16, peak_hour: '10am' },
    { served: 51, noshow: 3, avg_wait: 11, peak_hour: '9am'  },
    { served: 46, noshow: 5, avg_wait: 13, peak_hour: '10am' },
    { served: 35, noshow: 8, avg_wait: 18, peak_hour: '2pm'  },
    { served: 58, noshow: 2, avg_wait: 10, peak_hour: '9am'  },
    { served: 15, noshow: 1, avg_wait: 12, peak_hour: '10am' }, // today (partial)
  ];

  return days.map((d, i) => ({
    date: format(subDays(now, 6 - i), 'EEE, MMM d'),
    served: d.served,
    noshow: d.noshow,
    avg_wait: d.avg_wait,
    peak_hour: d.peak_hour,
  }));
}

// Hourly breakdown for heatmap (0–17 = 8am to midnight)
export function getHourlyPattern() {
  return [
    { hour: '8am',  mon: 5,  tue: 4,  wed: 6,  thu: 5,  fri: 3,  sat: 8  },
    { hour: '9am',  mon: 12, tue: 10, wed: 14, thu: 11, fri: 9,  sat: 16 },
    { hour: '10am', mon: 15, tue: 14, wed: 16, thu: 15, fri: 12, sat: 18 },
    { hour: '11am', mon: 13, tue: 12, wed: 14, thu: 12, fri: 11, sat: 15 },
    { hour: '12pm', mon: 4,  tue: 3,  wed: 5,  thu: 4,  fri: 3,  sat: 6  },
    { hour: '1pm',  mon: 6,  tue: 5,  wed: 7,  thu: 6,  fri: 5,  sat: 8  },
    { hour: '2pm',  mon: 11, tue: 10, wed: 12, thu: 11, fri: 14, sat: 10 },
    { hour: '3pm',  mon: 14, tue: 13, wed: 15, thu: 13, fri: 16, sat: 9  },
    { hour: '4pm',  mon: 10, tue: 9,  wed: 11, thu: 10, fri: 12, sat: 5  },
    { hour: '5pm',  mon: 6,  tue: 5,  wed: 7,  thu: 6,  fri: 8,  sat: 3  },
  ];
}

export function getBillingHistory() {
  return [
    { date: 'June 1, 2026',    amount: '₱599', plan: 'Pro Monthly', status: 'paid' },
    { date: 'May 1, 2026',     amount: '₱599', plan: 'Pro Monthly', status: 'paid' },
    { date: 'April 1, 2026',   amount: '₱599', plan: 'Pro Monthly', status: 'paid' },
    { date: 'March 1, 2026',   amount: '₱599', plan: 'Pro Monthly', status: 'paid' },
  ];
}

export function getRecentActivity() {
  const entries = [..._entries].reverse().slice(0, 8);
  return entries.map(e => ({
    id: e.id,
    text: e.status === 'served'
      ? `${e.display_number} was served`
      : e.status === 'called'
      ? `${e.display_number} was called`
      : e.status === 'no_show'
      ? `${e.display_number} marked as no-show`
      : `${e.display_number} joined the queue`,
    time: format(e.joined_at, 'h:mm a'),
    color: e.status === 'served'
      ? 'var(--status-waiting)'
      : e.status === 'called'
      ? 'var(--status-called)'
      : e.status === 'no_show'
      ? 'var(--status-noshow)'
      : 'var(--teal-primary)',
  }));
}
