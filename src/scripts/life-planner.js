/**
 * Life Event Planner Engine
 * Trimurti Jyotishalay
 */

class LifeEventPlanner {
  constructor() {
    this.eventsData = window.LifeEventsData ? window.LifeEventsData.events : {};
    this.activeEventId = "housewarming"; // Default
    
    this.init();
  }

  init() {
    this.bindHubSelectors();
    this.renderActiveEvent();
    this.initDashboardPreview();
  }

  bindHubSelectors() {
    const selectorContainer = document.getElementById('lepHubSelector');
    if (!selectorContainer) return;

    selectorContainer.innerHTML = Object.keys(this.eventsData).map(key => {
      const evt = this.eventsData[key];
      const isActive = key === this.activeEventId ? 'active' : '';
      return `
        <div class="lep-select-card ${isActive}" data-eventid="${evt.id}">
          <span class="lep-card-icon">${evt.icon}</span>
          <span class="lep-card-label">${evt.titleMr || evt.title}</span>
        </div>
      `;
    }).join('');

    selectorContainer.querySelectorAll('.lep-select-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-eventid');
        this.switchEvent(id);
      });
    });
  }

  switchEvent(eventId) {
    if (!this.eventsData[eventId]) return;
    this.activeEventId = eventId;

    // Update active tab UI
    document.querySelectorAll('.lep-select-card').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-eventid') === eventId);
    });

    this.renderActiveEvent();
  }

  renderActiveEvent() {
    const data = this.eventsData[this.activeEventId];
    if (!data) return;

    // 1. Hero
    document.getElementById('lepHeroContainer').innerHTML = `
      <div class="lep-hero-banner">
        <span class="lep-badge">${data.heroBadge || 'वैदिक जीवन संस्कार'}</span>
        <h1 class="lep-hero-title">${data.icon} ${data.title} (${data.titleMr})</h1>
        <p class="lep-hero-desc">${data.subtitle}</p>
      </div>
    `;

    // 2. Recommended Pujas
    document.getElementById('lepPujasContainer').innerHTML = data.recommendedPujas.map(p => `
      <div class="lep-puja-card ${p.popular ? 'popular' : ''}">
        ${p.popular ? '<span class="lep-popular-tag">Recommended</span>' : ''}
        <div>
          <h3 class="lep-puja-name">${p.name}</h3>
          <div class="lep-puja-name-mr">${p.nameMr}</div>
          <div class="lep-puja-meta">
            <span>⭐ ${p.rating} (${p.reviews} reviews)</span>
            <span>⏱️ ${p.duration}</span>
          </div>
          <p style="font-size: 0.88rem; color: #665243; margin-bottom: 12px;">${p.description}</p>
        </div>
        <div>
          <div class="lep-puja-price">₹${p.price.toLocaleString('en-IN')}</div>
          <a href="#booking" class="btn-lep" style="width: 100%; box-sizing: border-box;">Book Guruji Now</a>
        </div>
      </div>
    `).join('');

    // 3. Checklist & Auto-save
    this.renderChecklist(data);

    // 4. Documents & Samagri
    document.getElementById('lepDocsContainer').innerHTML = data.documents.map(d => `
      <div class="lep-doc-card">
        <strong style="color: #8b1a1a; display: block; margin-bottom: 4px;">📄 ${d.name}</strong>
        <span style="font-size: 0.82rem; color: #665243;">${d.requirement}</span>
      </div>
    `).join('');

    document.getElementById('lepSamagriContainer').innerHTML = data.samagri.map(s => `
      <div class="lep-samagri-card">
        <div class="lep-samagri-icon">${s.icon}</div>
        <div>
          <strong style="font-size: 0.95rem; color: #8b1a1a;">${s.name}</strong>
          <div style="font-size: 0.8rem; font-weight: 700; color: #c8860a;">Need: ${s.qty}</div>
          <span style="font-size: 0.78rem; color: #665243;">${s.purpose}</span>
        </div>
      </div>
    `).join('');

    // 5. Timeline
    document.getElementById('lepTimelineContainer').innerHTML = `
      <div class="lep-timeline-list">
        ${data.timeline.map(t => `
          <div class="lep-timeline-item">
            <span class="lep-tl-phase">${t.phase}</span>
            <div class="lep-tl-title">${t.title}</div>
            <p class="lep-tl-desc">${t.desc}</p>
          </div>
        `).join('')}
      </div>
    `;

    // 6. Editable Budget
    this.renderBudget(data);

    // 7. FAQs
    document.getElementById('lepFaqContainer').innerHTML = data.faqs.map(f => `
      <div class="lep-faq-item">
        <div class="lep-faq-q">❓ ${f.q}</div>
        <div class="lep-faq-a">${f.a}</div>
      </div>
    `).join('');
  }

  /* Checklist Logic with LocalStorage */
  renderChecklist(data) {
    const savedState = JSON.parse(localStorage.getItem(`lep_check_${data.id}`) || '{}');
    
    const container = document.getElementById('lepChecklistContainer');
    container.innerHTML = `
      <div class="lep-checklist-box">
        <div class="lep-progress-wrapper">
          <div class="lep-progress-bar-bg">
            <div class="lep-progress-fill" id="lepProgressFill"></div>
          </div>
          <div class="lep-progress-text">
            <span>Planning Progress</span>
            <span id="lepProgressPercent">0%</span>
          </div>
        </div>

        <div id="lepCheckItemsList">
          ${data.checklist.map(item => {
            const isChecked = savedState[item.id] ? 'checked' : '';
            return `
              <div class="lep-check-item ${isChecked ? 'done' : ''}" id="item_wrapper_${item.id}">
                <input type="checkbox" id="${item.id}" ${isChecked} onchange="window.lepInstance.toggleCheck('${data.id}', '${item.id}')">
                <label for="${item.id}" style="font-size: 0.92rem; cursor: pointer; flex: 1;">
                  <span>${item.task}</span>
                </label>
                <span class="lep-timeframe">${item.timeframe}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.updateChecklistProgress(data);
  }

  toggleCheck(eventId, itemId) {
    const checkbox = document.getElementById(itemId);
    const wrapper = document.getElementById(`item_wrapper_${itemId}`);
    if (checkbox && wrapper) {
      wrapper.classList.toggle('done', checkbox.checked);
    }

    // Save state
    const savedState = JSON.parse(localStorage.getItem(`lep_check_${eventId}`) || '{}');
    savedState[itemId] = checkbox.checked;
    localStorage.setItem(`lep_check_${eventId}`, JSON.stringify(savedState));

    this.updateChecklistProgress(this.eventsData[eventId]);
    this.initDashboardPreview(); // Update dashboard state sync
  }

  updateChecklistProgress(data) {
    const savedState = JSON.parse(localStorage.getItem(`lep_check_${data.id}`) || '{}');
    const total = data.checklist.length;
    let completed = 0;

    data.checklist.forEach(item => {
      if (savedState[item.id]) completed++;
    });

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const fill = document.getElementById('lepProgressFill');
    const text = document.getElementById('lepProgressPercent');

    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}% Completed (${completed}/${total})`;
  }

  /* Budget Logic */
  renderBudget(data) {
    const savedBudget = JSON.parse(localStorage.getItem(`lep_budget_${data.id}`) || '{}');

    const container = document.getElementById('lepBudgetContainer');
    container.innerHTML = `
      <div class="lep-budget-box">
        <table class="lep-budget-table">
          <thead>
            <tr>
              <th>Item / Service</th>
              <th style="text-align: right;">Estimated Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${data.budget.map(b => {
              const val = savedBudget[b.id] !== undefined ? savedBudget[b.id] : b.defaultCost;
              return `
                <tr>
                  <td>${b.item}</td>
                  <td style="text-align: right;">
                    <input type="number" class="lep-budget-input" id="${b.id}" value="${val}" 
                           onchange="window.lepInstance.updateBudget('${data.id}')">
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <div class="lep-budget-total" id="lepBudgetTotal">Total: ₹0</div>
      </div>
    `;

    this.updateBudget(data.id);
  }

  updateBudget(eventId) {
    const data = this.eventsData[eventId];
    if (!data) return;

    let total = 0;
    const savedBudget = {};

    data.budget.forEach(b => {
      const input = document.getElementById(b.id);
      const val = input ? parseInt(input.value, 10) || 0 : b.defaultCost;
      total += val;
      savedBudget[b.id] = val;
    });

    localStorage.setItem(`lep_budget_${eventId}`, JSON.stringify(savedBudget));
    const totalEl = document.getElementById('lepBudgetTotal');
    if (totalEl) totalEl.textContent = `Estimated Total: ₹${total.toLocaleString('en-IN')}`;
  }

  /* Simulated Dashboard Integration */
  initDashboardPreview() {
    const widgetContainer = document.getElementById('lepDashboardWidget');
    if (!widgetContainer) return;

    // Simulate an active booked event (Housewarming)
    const activeData = this.eventsData["housewarming"];
    const savedState = JSON.parse(localStorage.getItem(`lep_check_housewarming`) || '{}');
    const total = activeData.checklist.length;
    let completed = 0;
    activeData.checklist.forEach(i => { if (savedState[i.id]) completed++; });
    const percent = Math.round((completed / total) * 100);

    widgetContainer.innerHTML = `
      <div class="lep-dash-widget">
        <div class="lep-dash-header">
          <div>
            <span style="font-size: 0.8rem; color: #c8860a; font-weight: 700; text-transform: uppercase;">Upcoming Life Event</span>
            <h3 style="margin: 2px 0 0 0; color: #8b1a1a; font-size: 1.3rem;">🏠 Housewarming (गृहप्रवेश)</h3>
          </div>
          <div class="lep-countdown-pill">⏳ 12 Days Left</div>
        </div>

        <div class="lep-progress-wrapper" style="margin-bottom: 12px;">
          <div class="lep-progress-bar-bg">
            <div class="lep-progress-fill" style="width: ${percent}%;"></div>
          </div>
          <div class="lep-progress-text">
            <span>Event Preparation</span>
            <span>${percent}% Done</span>
          </div>
        </div>

        <div style="font-size: 0.88rem; color: #665243; display: flex; justify-content: space-between; align-items: center;">
          <span>Next Task: <strong>Order Puja Samagri & Flowers</strong></span>
          <button class="btn-lep btn-lep-secondary" onclick="window.lepInstance.switchEvent('housewarming')">View Full Planner &rarr;</button>
        </div>
      </div>
    `;
  }
}

// Global Instantiate
document.addEventListener('DOMContentLoaded', () => {
  window.lepInstance = new LifeEventPlanner();
});