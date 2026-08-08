/**
 * Smart Puja Recommendation Wizard Engine
 * Trimurti Jyotishalay
 */

class PujaWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.dataRules = null;
    this.userAnswers = {
      category: null,
      dynamicAnswers: {}
    };
    
    this.init();
  }

  async init() {
    await this.loadRules();
    this.injectLauncherButton();
  }

  async loadRules() {
    try {
      // Load rules from local JSON file
      const response = await fetch('./src/scripts/wizard-rules.json');
      this.dataRules = await response.json();
    } catch (err) {
      console.error("Failed to load wizard rules JSON. Using fallback rules.", err);
      this.dataRules = this.getFallbackRules();
    }
  }

  injectLauncherButton() {
    // If a mount container exists on index.html, inject the launcher CTA
    const mount = document.getElementById('wizard-launcher-mount');
    if (mount) {
      mount.innerHTML = `
        <div class="wizard-cta-banner" style="background:#fdf5e6; border:2px dashed #c8860a; padding:20px; border-radius:12px; text-align:center; margin: 20px 0;">
          <h3 style="color:#8b1a1a; margin:0 0 8px 0;">🙏 कोणती पूजा करावी हे कळत नाही का?</h3>
          <p style="margin:0 0 14px 0; color:#5c4033;">तुमच्या जीवन परिस्थितीनुसार सर्वात योग्य पूजा शोधा.</p>
          <button id="btnOpenWizard" class="btn-primary" style="padding:10px 24px; font-weight:600; cursor:pointer;">योग्य पूजा निवडा (Wizard) →</button>
        </div>
      `;
      document.getElementById('btnOpenWizard').addEventListener('click', () => this.open());
    }
  }

  open() {
    this.currentStep = 1;
    this.userAnswers = { category: null, dynamicAnswers: {} };
    this.renderModal();
  }

  close() {
    const modal = document.getElementById('pujaWizardModal');
    if (modal) modal.remove();
  }

  renderModal() {
    // Remove existing if any
    this.close();

    const overlay = document.createElement('div');
    overlay.className = 'wizard-modal-overlay';
    overlay.id = 'pujaWizardModal';
    
    overlay.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-header">
          <div class="wizard-title-row">
            <h3 class="wizard-title">🕉️ पूजा मार्गदर्शक (Puja Advisor)</h3>
            <button class="wizard-close-btn" id="btnCloseWizard">&times;</button>
          </div>
          <div class="wizard-progress-bar-bg">
            <div class="wizard-progress-fill" id="wizardProgress"></div>
          </div>
          <div class="wizard-step-label" id="wizardStepLabel">Step 1 of 3</div>
        </div>

        <div class="wizard-body" id="wizardBody">
          <!-- Dynamic Content Rendered Here -->
        </div>

        <div class="wizard-footer">
          <button class="btn-wizard-nav" id="btnWizardPrev" disabled>← मागे</button>
          <button class="btn-wizard-nav primary" id="btnWizardNext" disabled>पुढे →</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event Listeners
    document.getElementById('btnCloseWizard').addEventListener('click', () => this.close());
    document.getElementById('btnWizardPrev').addEventListener('click', () => this.prevStep());
    document.getElementById('btnWizardNext').addEventListener('click', () => this.nextStep());

    this.renderCurrentStep();
  }

  updateProgress() {
    const fill = document.getElementById('wizardProgress');
    const label = document.getElementById('wizardStepLabel');
    const pct = (this.currentStep / this.totalSteps) * 100;
    
    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
  }

  renderCurrentStep() {
    this.updateProgress();
    const body = document.getElementById('wizardBody');
    const btnNext = document.getElementById('btnWizardNext');
    const btnPrev = document.getElementById('btnWizardPrev');

    btnPrev.disabled = (this.currentStep === 1);

    if (this.currentStep === 1) {
      this.renderStep1(body, btnNext);
    } else if (this.currentStep === 2) {
      this.renderStep2(body, btnNext);
    } else if (this.currentStep === 3) {
      this.renderStep3(body, btnNext);
    }
  }

  // Step 1: Category Selection
  renderStep1(body, btnNext) {
    btnNext.textContent = "पुढे →";
    btnNext.disabled = !this.userAnswers.category;

    let html = `
      <h4 class="wizard-step-title">🙏 आज तुम्हाला कशासाठी मार्गदर्शन हवे आहे?</h4>
      <div class="options-grid">
    `;

    this.dataRules.categories.forEach(cat => {
      const isSelected = this.userAnswers.category === cat.id ? 'selected' : '';
      html += `
        <div class="option-card ${isSelected}" data-id="${cat.id}">
          <span class="option-icon">${cat.icon}</span>
          <span class="option-label">${cat.label}</span>
        </div>
      `;
    });

    html += `</div>`;
    body.innerHTML = html;

    // Attach click events
    body.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', (e) => {
        body.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.userAnswers.category = card.dataset.id;
        btnNext.disabled = false;
      });
    });
  }

  // Step 2: Dynamic Questions
  renderStep2(body, btnNext) {
    btnNext.textContent = "शिफारस पहा (Show Results) →";
    
    const catId = this.userAnswers.category;
    const questions = this.dataRules.questions[catId] || [];

    if (questions.length === 0) {
      // If no dynamic questions defined, jump directly to recommendations
      this.currentStep = 3;
      this.renderCurrentStep();
      return;
    }

    let html = `<h4 class="wizard-step-title">काही अधिक माहिती द्या:</h4>`;

    questions.forEach((q, idx) => {
      const selectedVal = this.userAnswers.dynamicAnswers[q.id];
      html += `
        <div style="margin-bottom: 20px;">
          <p style="font-weight:600; margin:0 0 10px 0;">${idx + 1}. ${q.question}</p>
          <div class="options-grid">
      `;

      q.options.forEach(opt => {
        const isSel = selectedVal === opt ? 'selected' : '';
        html += `
          <div class="option-card dynamic-opt ${isSel}" data-qid="${q.id}" data-val="${opt}">
            <span class="option-label">${opt}</span>
          </div>
        `;
      });

      html += `</div></div>`;
    });

    body.innerHTML = html;

    // Check validation
    const checkValidation = () => {
      const answeredCount = Object.keys(this.userAnswers.dynamicAnswers).length;
      btnNext.disabled = answeredCount < questions.length;
    };
    checkValidation();

    body.querySelectorAll('.dynamic-opt').forEach(card => {
      card.addEventListener('click', () => {
        const qid = card.dataset.qid;
        const val = card.dataset.val;

        // Deselect siblings
        card.parentElement.querySelectorAll('.dynamic-opt').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        this.userAnswers.dynamicAnswers[qid] = val;
        checkValidation();
      });
    });
  }

  // Step 3: Rule-based Recommendation Results
  renderStep3(body, btnNext) {
    btnNext.textContent = "पूर्ण झाले (Done)";
    btnNext.disabled = false;

    const catId = this.userAnswers.category;
    const recommendations = this.dataRules.rules[catId] || this.dataRules.rules.DEFAULT;

    let html = `
      <h4 class="wizard-step-title">✨ तुमच्यासाठी शिफारस केलेल्या सर्वोत्तम पूजा:</h4>
      <div class="recommendations-list">
    `;

    recommendations.forEach(rec => {
      html += `
        <div class="rec-card">
          <div class="rec-header">
            <h5 class="rec-name">${rec.name}</h5>
            <span class="rec-badge">${rec.match}% Match • ${rec.badge}</span>
          </div>
          <p style="margin:4px 0 8px 0; font-size:0.9rem; color:#4a3b32;">${rec.description}</p>

          <div class="rec-why">
            <strong>💡 ही शिफारस का?</strong>
            <ul>
              ${rec.why.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>

          <div class="rec-meta">
            <span>⏱️ कालावधी: <strong>${rec.duration}</strong></span>
            <span>💰 अंदाजे दक्षिणा: <strong>${rec.dakshina}</strong></span>
          </div>

          <div class="rec-actions">
            <button class="btn-book-now" onclick="window.location.href='booking.html'">ही पूजा बुक करा</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    body.innerHTML = html;
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.renderCurrentStep();
    } else {
      this.close();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderCurrentStep();
    }
  }

  getFallbackRules() {
    return {
      categories: [{ id: "General", label: "सामान्य पूजा", icon: "🕉️" }],
      questions: {},
      rules: { DEFAULT: [{ name: "सत्यनारायण पूजा", match: 90, badge: "Recommended", description: "सामान्य समृद्धी विधी", duration: "६० मि", dakshina: "₹१,१००", why: ["सर्वसामान्य कल्याणासाठी"] }] }
    };
  }
}

// Initialize Wizard globally on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.pujaWizard = new PujaWizard();
});