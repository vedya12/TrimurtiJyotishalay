import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const WHATSAPP_NUMBER = '919999999999';

export function generateBookingRef() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TJ-${ymd}-${rand}`;
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTimeDisplay(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

/* ── Auth Helpers ── */

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  return session.user;
}

export async function getUserProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function isAdmin() {
  const profile = await getUserProfile();
  return profile?.role === 'admin';
}

export async function requireAuth(redirectUrl = '/login.html') {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = redirectUrl;
    return null;
  }
  return user;
}

export async function requireAdmin(redirectUrl = '/login.html') {
  const user = await requireAuth(redirectUrl);
  if (!user) return false;
  const admin = await isAdmin();
  if (!admin) {
    window.location.href = '/dashboard.html';
    return false;
  }
  return true;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/';
}
