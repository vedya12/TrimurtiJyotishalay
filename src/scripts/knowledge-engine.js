/**
 * KnowledgeEngine - Trimurti Jyotishalay
 * Core Engine for Guruji's Knowledge Base & Modular Search Provider Interface.
 */

export class KnowledgeEngine {
  constructor(dataUrl = 'public/data/knowledge.json') {
    this.dataUrl = dataUrl;
    this.knowledgeData = [];
    this.savedIds = this.getSavedQuestionIds();
  }

  /**
   * Initialize and load data from knowledge.json
   */
  async init() {
    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to load knowledge base: ${response.statusText}`);
      }
      this.knowledgeData = await response.json();
      return this.knowledgeData;
    } catch (error) {
      console.error('KnowledgeEngine Error:', error);
      this.knowledgeData = [];
      return [];
    }
  }

  /**
   * Search Interface (Modular Architecture)
   * Designed so that keyword search can be replaced seamlessly with AI Semantic API in future.
   */
  async search(query, category = 'all') {
    const cleanQuery = query.toLowerCase().trim();

    // 1. Filter by category if specified
    let dataset = this.knowledgeData;
    if (category && category !== 'all') {
      dataset = dataset.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (!cleanQuery) {
      return dataset;
    }

    // 2. Keyword/Fuzzy search algorithm
    return dataset.filter(item => {
      const matchQuestion = item.question.toLowerCase().includes(cleanQuery);
      const matchQuestionMr = item.question_mr ? item.question_mr.toLowerCase().includes(cleanQuery) : false;
      const matchAnswer = item.answer.toLowerCase().includes(cleanQuery);
      const matchCategory = item.category.toLowerCase().includes(cleanQuery);
      const matchTags = item.tags ? item.tags.some(tag => tag.toLowerCase().includes(cleanQuery)) : false;

      return matchQuestion || matchQuestionMr || matchAnswer || matchCategory || matchTags;
    });
  }

  /**
   * Auto-suggestions for Search Input
   */
  getSuggestions(query, limit = 5) {
    if (!query || query.trim().length < 2) return [];
    const clean = query.toLowerCase().trim();

    return this.knowledgeData
      .filter(item => item.question.toLowerCase().includes(clean) || (item.question_mr && item.question_mr.includes(clean)))
      .slice(0, limit);
  }

  /**
   * Retrieve single question by ID or Slug
   */
  getQuestionById(id) {
    return this.knowledgeData.find(item => item.id === id || item.slug === id) || null;
  }

  /**
   * Get Popular Questions
   */
  getPopularQuestions(limit = 6) {
    return [...this.knowledgeData]
      .filter(item => item.is_popular)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  /**
   * Get Recently Added Questions
   */
  getRecentQuestions(limit = 6) {
    return [...this.knowledgeData]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }

  /**
   * Get Saved Questions for logged in user (LocalStorage)
   */
  getSavedQuestionIds() {
    try {
      const saved = localStorage.getItem('tj_saved_questions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  toggleSaveQuestion(id) {
    let saved = this.getSavedQuestionIds();
    if (saved.includes(id)) {
      saved = saved.filter(item => item !== id);
    } else {
      saved.push(id);
    }
    this.savedIds = saved;
    localStorage.setItem('tj_saved_questions', JSON.stringify(saved));
    return this.isSaved(id);
  }

  isSaved(id) {
    return this.savedIds.includes(id);
  }

  getSavedQuestions() {
    return this.knowledgeData.filter(item => this.savedIds.includes(item.id));
  }

  /**
   * Record Helpfulness Vote
   */
  voteHelpful(id, type = 'yes') {
    const question = this.getQuestionById(id);
    if (!question) return null;

    if (type === 'yes') {
      question.helpful_yes += 1;
    } else {
      question.helpful_no += 1;
    }
    return { yes: question.helpful_yes, no: question.helpful_no };
  }

  /**
   * Increment View Count
   */
  incrementView(id) {
    const question = this.getQuestionById(id);
    if (question) {
      question.views += 1;
    }
  }

  /**
   * Admin Method: Add or Update Question
   */
  saveQuestionAdmin(questionData) {
    if (questionData.id) {
      // Update
      const index = this.knowledgeData.findIndex(q => q.id === questionData.id);
      if (index !== -1) {
        this.knowledgeData[index] = { ...this.knowledgeData[index], ...questionData, updated_at: new Date().toISOString().split('T')[0] };
      }
    } else {
      // Insert new
      const newQuestion = {
        id: `kb-${Date.now()}`,
        slug: questionData.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        ...questionData,
        views: 0,
        helpful_yes: 0,
        helpful_no: 0,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
        is_popular: false,
        related_ids: []
      };
      this.knowledgeData.unshift(newQuestion);
    }
    return true;
  }
}