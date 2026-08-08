/**
 * Digital Sankalp Generator Logic
 * Trimurti Jyotishalay
 */

class SankalpGenerator {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {};

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateStepUI();
  }

  bindEvents() {
    const btnNext = document.getElementById('skBtnNext');
    const btnPrev = document.getElementById('skBtnPrev');

    if (btnNext) btnNext.addEventListener('click', () => this.nextStep());
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevStep());

    // Export Action Handlers
    const btnPdf = document.getElementById('skBtnDownloadPdf');
    const btnPrint = document.getElementById('skBtnPrint');
    const btnShare = document.getElementById('skBtnShare');

    if (btnPdf) btnPdf.addEventListener('click', () => this.downloadPDF());
    if (btnPrint) btnPrint.addEventListener('click', () => window.print());
    if (btnShare) btnShare.addEventListener('click', () => this.shareDocument());
  }

  collectFormData() {
    this.formData = {
      name: document.getElementById('skName')?.value.trim() || 'वेदांत अभयराव वेळूकार',
      fatherName: document.getElementById('skFatherName')?.value.trim() || 'अभयराव वेळूकार',
      gotra: document.getElementById('skGotra')?.value || 'कश्यप',
      nakshatra: document.getElementById('skNakshatra')?.value || 'रोहिणी',
      dob: document.getElementById('skDob')?.value || '',
      puja: document.getElementById('skPuja')?.value || 'Satyanarayan',
      pujaCustom: document.getElementById('skPujaOption')?.selectedOptions[0]?.text || 'श्री सत्यनारायण पूजा',
      purpose: document.getElementById('skPurpose')?.value || 'कौटुंबिक सुख व समृद्धी',
      venue: document.getElementById('skVenue')?.value.trim() || 'पुणे, महाराष्ट्र',
      date: document.getElementById('skDate')?.value || new Date().toISOString().split('T')[0],
      time: document.getElementById('skTime')?.value || 'सकाळी ०९:०० वा.',
      sankalpDateSanskrit: this.getFormattedSanskritDate(document.getElementById('skDate')?.value)
    };
  }

  getFormattedSanskritDate(dateStr) {
    const d = dateStr ? new Date(dateStr) : new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('mr-IN', options) + ' शुभ्राम्बे';
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      if (this.validateStep(this.currentStep)) {
        this.currentStep++;
        this.updateStepUI();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepUI();
    }
  }

  validateStep(step) {
    if (step === 1) {
      const name = document.getElementById('skName')?.value.trim();
      if (!name) {
        alert('कृपया तुमचे पूर्ण नाव प्रविष्ट करा.');
        return false;
      }
    }
    return true;
  }

  updateStepUI() {
    // Hide/Show Panels
    for (let i = 1; i <= this.totalSteps; i++) {
      const panel = document.getElementById(`skStepPanel${i}`);
      const tab = document.getElementById(`skTabStep${i}`);
      if (panel) panel.classList.toggle('active', i === this.currentStep);
      if (tab) {
        tab.classList.toggle('active', i === this.currentStep);
        tab.classList.toggle('completed', i < this.currentStep);
      }
    }

    const btnPrev = document.getElementById('skBtnPrev');
    const btnNext = document.getElementById('skBtnNext');

    if (btnPrev) btnPrev.disabled = (this.currentStep === 1);

    if (this.currentStep === this.totalSteps) {
      if (btnNext) btnNext.style.display = 'none';
      this.generateSankalpPreview();
    } else {
      if (btnNext) {
        btnNext.style.display = 'inline-block';
        btnNext.textContent = 'पुढे →';
      }
    }
  }

  generateSankalpPreview() {
    this.collectFormData();

    // Select Template
    let rawTemplate = window.SankalpTemplates.satyanarayan;
    const pujaType = this.formData.puja;

    if (pujaType === 'Vastu') rawTemplate = window.SankalpTemplates.vastu;
    else if (pujaType === 'Rudrabhishek') rawTemplate = window.SankalpTemplates.rudrabhishek;
    else if (window.SankalpTemplates[pujaType.toLowerCase()]) rawTemplate = window.SankalpTemplates[pujaType.toLowerCase()];
    else rawTemplate = window.SankalpTemplates.general;

    // Substitute Placeholders
    let compiledHTML = rawTemplate;
    Object.keys(this.formData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      compiledHTML = compiledHTML.replace(regex, this.formData[key]);
    });

    // Render Preview Box
    const previewContainer = document.getElementById('sankalpDocBody');
    if (previewContainer) previewContainer.innerHTML = compiledHTML;

    // Update Doc Metadata Grid
    document.getElementById('docMetaName').textContent = this.formData.name;
    document.getElementById('docMetaGotra').textContent = this.formData.gotra;
    document.getElementById('docMetaPuja').textContent = this.formData.pujaCustom;
    document.getElementById('docMetaDate').textContent = `${this.formData.date} (${this.formData.time})`;
    document.getElementById('docMetaVenue').textContent = this.formData.venue;
  }

  downloadPDF() {
    const element = document.getElementById('sankalpPrintArea');
    if (!element) return;

    // Utilize html2pdf.js if loaded
    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin:       0.3,
        filename:     `Sankalp_${this.formData.name.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    } else {
      // Fallback to window.print if CDN is unreachable
      window.print();
    }
  }

  shareDocument() {
    if (navigator.share) {
      navigator.share({
        title: 'माझा डिजिटल संकल्प - त्रिमूर्ती ज्योतिषालय',
        text: `${this.formData.name} यांचा ${this.formData.pujaCustom} संकल्प.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert('तुमच्या ब्राऊझरमध्ये थेट शेअरिंग वैशिष्ट्य उपलब्ध नाही. लिंक कॉपी केली आहे!');
    }
  }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  window.sankalpGen = new SankalpGenerator();
});