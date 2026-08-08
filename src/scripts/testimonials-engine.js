/**
 * TestimonialEngine - Trimurti Jyotishalay
 * Handles reviews data fetching, carousel pagination, swipe gestures, filtering, and modal review submission.
 */

export class TestimonialEngine {
  constructor(dataUrl = 'public/data/reviews.json') {
    this.dataUrl = dataUrl;
    this.data = null;
    this.filteredReviews = [];
    this.currentIndex = 0;
    this.autoPlayTimer = null;
    this.isPaused = false;
    this.activeCategory = 'all';
    this.searchQuery = '';

    // Touch gesture tracking
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  async init() {
    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) throw new Error('Failed to fetch reviews dataset');
      this.data = await response.json();
      this.filteredReviews = [...this.data.reviews];

      this.renderTrustStats();
      this.renderSummary();
      this.renderFeaturedStory();
      this.renderCarouselCards();
      this.setupEventListeners();
      this.startAutoPlay();
    } catch (error) {
      console.error('TestimonialEngine Init Error:', error);
    }
  }

  renderTrustStats() {
    const s = this.data.stats;
    const el = document.getElementById('trustStatsContainer');
    if (!el) return;

    el.innerHTML = `
      <div class="stat-item"><div class="stat-value">${s.pujas_completed}</div><div class="stat-label">Pujas Completed</div></div>
      <div class="stat-item"><div class="stat-value">${s.years_experience}</div><div class="stat-label">Years Experience</div></div>
      <div class="stat-item"><div class="stat-value">${s.happy_families}</div><div class="stat-label">Satisfied Families</div></div>
      <div class="stat-item"><div class="stat-value">${s.services_offered}</div><div class="stat-label">Types of Services</div></div>
    `;
  }

  renderSummary() {
    const sum = this.data.summary;
    const el = document.getElementById('ratingSummaryContainer');
    if (!el) return;

    el.innerHTML = `
      <div class="rating-badge-summary">
        <span class="rating-stars">★★★★★</span>
        <span>${sum.average_rating} / 5.0 Rating</span>
        <span style="color:var(--rev-text-muted);">(${sum.total_reviews}+ Devotee Reviews)</span>
      </div>
    `;
  }

  renderFeaturedStory() {
    const f = this.data.featured_story;
    const el = document.getElementById('featuredStoryContainer');
    if (!el || !f) return;

    const avatarHtml = f.photo 
      ? `<img src="${f.photo}" class="featured-avatar" alt="${f.client_name}"/>`
      : `<div class="featured-avatar" style="background:var(--rev-maroon); color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:700;">${f.client_name.charAt(0)}</div>`;

    el.innerHTML = `
      <div class="featured-story-card">
        ${avatarHtml}
        <div class="featured-content">
          <span class="featured-badge">🌟 Featured Devotee Story</span>
          <h3 class="featured-title">${f.title}</h3>
          <p class="featured-text">"${f.story_text}"</p>
          <div class="featured-author">
            — ${f.client_name} <span style="font-weight:400; color:var(--rev-text-muted);">(${f.city} • ${f.service})</span>
          </div>
        </div>
      </div>
    `;
  }

  renderCarouselCards() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('carouselDots');
    if (!track) return;

    if (this.filteredReviews.length === 0) {
      track.innerHTML = `
        <div style="padding: 20px; color: var(--rev-text-muted);">
          No reviews matched your search criteria.
        </div>
      `;
      if (dotsContainer) dotsContainer.innerHTML = '';
      return;
    }

    track.innerHTML = this.filteredReviews.map(r => `
      <div class="testimonial-card">
        <div>
          <div class="card-top">
            <span class="rating-stars">${'★'.repeat(r.rating)}</span>
            ${r.verified_booking ? `<span class="verified-badge">✓ Verified Devotee</span>` : ''}
          </div>
          <p class="card-review-text">"${r.review}"</p>
        </div>
        <div class="card-footer">
          <div>
            <div class="user-name">${r.name}</div>
            <div class="user-meta">${r.city} • ${r.service}</div>
          </div>
          <div style="font-size:0.75rem; color:#aaa;">${r.date}</div>
        </div>
      </div>
    `).join('');

    this.renderDots();
    this.updateCarouselPosition();
  }

  renderDots() {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer) return;

    const visibleCount = Math.max(1, this.filteredReviews.length);
    dotsContainer.innerHTML = Array.from({ length: visibleCount }).map((_, idx) => `
      <span class="dot ${idx === this.currentIndex ? 'active' : ''}" data-index="${idx}"></span>
    `).join('');

    dotsContainer.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        this.currentIndex = parseInt(e.target.dataset.index, 10);
        this.updateCarouselPosition();
      });
    });
  }

  updateCarouselPosition() {
    const track = document.getElementById('testimonialTrack');
    if (!track || this.filteredReviews.length === 0) return;

    // Reset index bounds
    if (this.currentIndex >= this.filteredReviews.length) this.currentIndex = 0;
    if (this.currentIndex < 0) this.currentIndex = this.filteredReviews.length - 1;

    const cardWidth = 340; // Approx width + gap
    track.style.transform = `translateX(-${this.currentIndex * cardWidth}px)`;

    // Update active dot
    document.querySelectorAll('.carousel-dots .dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });
  }

  nextSlide() {
    if (this.filteredReviews.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.filteredReviews.length;
    this.updateCarouselPosition();
  }

  prevSlide() {
    if (this.filteredReviews.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.filteredReviews.length) % this.filteredReviews.length;
    this.updateCarouselPosition();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      if (!this.isPaused) this.nextSlide();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
  }

  applyFilters() {
    this.filteredReviews = this.data.reviews.filter(r => {
      const matchesCategory = this.activeCategory === 'all' || r.category === this.activeCategory;
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q || 
        r.name.toLowerCase().includes(q) || 
        r.city.toLowerCase().includes(q) || 
        r.service.toLowerCase().includes(q) || 
        r.review.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    this.currentIndex = 0;
    this.renderCarouselCards();
  }

  setupEventListeners() {
    // Prev / Next Buttons
    const prevBtn = document.getElementById('prevReviewBtn');
    const nextBtn = document.getElementById('nextReviewBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Pause on Hover
    const wrapper = document.getElementById('carouselWrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => this.isPaused = true);
      wrapper.addEventListener('mouseleave', () => this.isPaused = false);

      // Touch Swipe Support
      wrapper.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      wrapper.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    // Filter Chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        this.activeCategory = e.target.dataset.category;
        this.applyFilters();
      });
    });

    // Search Input
    const searchInput = document.getElementById('reviewSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.applyFilters();
      });
    }

    // Modal Events
    const openModalBtn = document.getElementById('openReviewModalBtn');
    const closeModalBtn = document.getElementById('closeReviewModalBtn');
    const modal = document.getElementById('reviewModalOverlay');
    const form = document.getElementById('addReviewForm');

    if (openModalBtn && modal) openModalBtn.addEventListener('click', () => modal.style.display = 'flex');
    if (closeModalBtn && modal) closeModalBtn.addEventListener('click', () => modal.style.display = 'none');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewReviewSubmit();
      });
    }
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 40) { // Swipe threshold
      if (diff > 0) this.nextSlide();
      else this.prevSlide();
    }
  }

  handleNewReviewSubmit() {
    const name = document.getElementById('revInputName').value;
    const city = document.getElementById('revInputCity').value;
    const service = document.getElementById('revInputService').value;
    const rating = parseInt(document.getElementById('revInputRating').value, 10);
    const reviewText = document.getElementById('revInputText').value;

    const newReview = {
      id: `rev-${Date.now()}`,
      name,
      city,
      service,
      category: 'general',
      rating,
      review: reviewText,
      date: 'Just now',
      featured: false,
      photo: null,
      verified_booking: true
    };

    // Prepend to current dataset
    this.data.reviews.unshift(newReview);
    this.applyFilters();

    // Close modal & reset form
    document.getElementById('reviewModalOverlay').style.display = 'none';
    document.getElementById('addReviewForm').reset();
    alert('🙏 Thank you! Your review has been submitted for verification.');
  }
}