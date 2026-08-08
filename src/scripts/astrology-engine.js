/**
 * AstrologyEngine - Trimurti Jyotishalay
 * Core Engine for Kundali SVG Rendering, Multi-Profile Family Portal & Data Provider
 */

export class AstrologyEngine {
  constructor(dataUrl = 'public/data/kundali.json') {
    this.dataUrl = dataUrl;
    this.data = null;
    this.activeProfile = null;
    this.chartLayout = 'north'; // 'north', 'south', 'east'
  }

  async init() {
    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) throw new Error('Failed to load Kundali dataset');
      this.data = await response.json();
      
      const activeId = this.data.active_profile_id;
      this.activeProfile = this.data.family_profiles.find(p => p.profile_id === activeId) || this.data.family_profiles[0];
      return this.data;
    } catch (err) {
      console.error('AstrologyEngine Init Error:', err);
      return null;
    }
  }

  getProfiles() {
    return this.data ? this.data.family_profiles : [];
  }

  setActiveProfile(profileId) {
    const found = this.data.family_profiles.find(p => p.profile_id === profileId);
    if (found) {
      this.activeProfile = found;
      this.data.active_profile_id = profileId;
    }
    return this.activeProfile;
  }

  setChartLayout(layout) {
    if (['north', 'south', 'east'].includes(layout)) {
      this.chartLayout = layout;
    }
    return this.chartLayout;
  }

  /**
   * Generates dynamic SVG for Kundali Charts
   */
  renderKundaliSVG() {
    if (!this.activeProfile) return '';
    if (this.chartLayout === 'south') return this.generateSouthIndianSVG();
    if (this.chartLayout === 'east') return this.generateEastIndianSVG();
    return this.generateNorthIndianSVG();
  }

  generateNorthIndianSVG() {
    const h = this.activeProfile.house_houses_mapping || {};
    
    return `
      <svg viewBox="0 0 400 400" class="kundali-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer Box -->
        <rect x="10" y="10" width="380" height="380" fill="#fffdf9" stroke="#8b1a1a" stroke-width="3"/>
        
        <!-- Diagonals -->
        <line x1="10" y1="10" x2="390" y2="390" stroke="#8b1a1a" stroke-width="1.5"/>
        <line x1="390" y1="10" x2="10" y2="390" stroke="#8b1a1a" stroke-width="1.5"/>
        
        <!-- Inner Diamond -->
        <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#8b1a1a" stroke-width="2"/>
        
        <!-- House Numbers / Labels -->
        <text x="200" y="35" font-size="11" fill="#c8860a" text-anchor="middle" font-weight="bold">1 (Lagna)</text>
        <text x="110" y="100" font-size="11" fill="#c8860a" text-anchor="middle">2</text>
        <text x="60" y="150" font-size="11" fill="#c8860a" text-anchor="middle">3</text>
        <text x="110" y="200" font-size="11" fill="#c8860a" text-anchor="middle">4</text>
        <text x="60" y="260" font-size="11" fill="#c8860a" text-anchor="middle">5</text>
        <text x="110" y="310" font-size="11" fill="#c8860a" text-anchor="middle">6</text>
        <text x="200" y="375" font-size="11" fill="#c8860a" text-anchor="middle">7</text>
        <text x="290" y="310" font-size="11" fill="#c8860a" text-anchor="middle">8</text>
        <text x="340" y="260" font-size="11" fill="#c8860a" text-anchor="middle">9</text>
        <text x="290" y="200" font-size="11" fill="#c8860a" text-anchor="middle">10</text>
        <text x="340" y="150" font-size="11" fill="#c8860a" text-anchor="middle">11</text>
        <text x="290" y="100" font-size="11" fill="#c8860a" text-anchor="middle">12</text>

        <!-- Dynamic Planet Occupancy Text -->
        <text x="200" y="110" font-size="13" font-weight="bold" fill="#8b1a1a" text-anchor="middle">${(h.H1 || []).join(', ')}</text>
        <text x="110" y="60" font-size="12" font-weight="bold" fill="#8b1a1a" text-anchor="middle">${(h.H2 || []).join(', ')}</text>
        <text x="50" y="100" font-size="12" font-weight="bold" fill="#8b1a1a" text-anchor="middle">${(h.H3 || []).join(', ')}</text>
        <text x="110" y="220" font-size="12" font-weight="bold" fill="#8b1a1a" text-anchor="middle">${(h.H4 || []).join(', ')}</text>
        <text x="50" y="300" font-size="12" font-weight="bold" fill="#8b1a1a" text-anchor="middle">${(h.H5 || []).join(', ')}</text>
        <text x="340" y="100" font-size="12" font-weight="bold" fill="#8b1a1a" text-anchor="middle">${(h.H11 || []).join(', ')}</text>
      </svg>
    `;
  }

  generateSouthIndianSVG() {
    return `
      <svg viewBox="0 0 400 400" class="kundali-svg" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="380" height="380" fill="#fffdf9" stroke="#8b1a1a" stroke-width="3"/>
        <!-- 4x4 Grid lines -->
        <line x1="105" y1="10" x2="105" y2="390" stroke="#8b1a1a" stroke-width="1.5"/>
        <line x1="200" y1="10" x2="200" y2="390" stroke="#8b1a1a" stroke-width="1.5"/>
        <line x1="295" y1="10" x2="295" y2="390" stroke="#8b1a1a" stroke-width="1.5"/>
        <line x1="10" y1="105" x2="390" y2="105" stroke="#8b1a1a" stroke-width="1.5"/>
        <line x1="10" y1="200" x2="390" y2="200" stroke="#8b1a1a" stroke-width="1.5"/>
        <line x1="10" y1="295" x2="390" y2="295" stroke="#8b1a1a" stroke-width="1.5"/>
        <!-- Center Box Block -->
        <rect x="105" y="105" width="190" height="190" fill="#faf0e0" stroke="#8b1a1a" stroke-width="1.5"/>
        <text x="200" y="205" font-size="16" font-weight="bold" fill="#8b1a1a" text-anchor="middle">South Indian Layout</text>
      </svg>
    `;
  }

  generateEastIndianSVG() {
    return `
      <svg viewBox="0 0 400 400" class="kundali-svg" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="380" height="380" fill="#fffdf9" stroke="#8b1a1a" stroke-width="3"/>
        <line x1="10" y1="10" x2="390" y2="390" stroke="#8b1a1a" stroke-width="1.5"/>
        <line x1="390" y1="10" x2="10" y2="390" stroke="#8b1a1a" stroke-width="1.5"/>
        <line x1="200" y1="10" x2="200" y2="390" stroke="#8b1a1a" stroke-width="1.5"/>
        <line x1="10" y1="200" x2="390" y2="200" stroke="#8b1a1a" stroke-width="1.5"/>
        <text x="200" y="205" font-size="16" font-weight="bold" fill="#8b1a1a" text-anchor="middle">East Indian Layout</text>
      </svg>
    `;
  }

  addNewProfile(newProf) {
    const profId = `prof-${Date.now()}`;
    const formattedProfile = {
      profile_id: profId,
      relation: newProf.relation || 'Relative',
      birth_details: {
        name: newProf.name,
        father_name: newProf.father_name || '-',
        dob: newProf.dob,
        time: newProf.time,
        place: newProf.place,
        gender: newProf.gender,
        timezone: 'GMT+5:30',
        latitude: '20.00° N',
        longitude: '78.00° E'
      },
      horoscope_summary: {
        rashi: 'Calculating...',
        nakshatra: 'Calculating...',
        lagna: 'Calculating...',
        moon_sign: 'Calculating...',
        sun_sign: 'Calculating...',
        gotra: newProf.gotra || 'N/A'
      },
      planet_positions: [],
      house_houses_mapping: { H1: ['Ascendant'] },
      doshas: [],
      remedies: [],
      dasha_timeline: { current_mahadasha: 'Pending Calculation', upcoming_periods: [] },
      lucky_info: { color: 'Yellow', day: 'Thursday', number: 3, direction: 'East' },
      upcoming_events: [],
      download_reports: []
    };

    this.data.family_profiles.push(formattedProfile);
    this.setActiveProfile(profId);
    return formattedProfile;
  }
}