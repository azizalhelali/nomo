// AI Agent Training System

export interface TrainingData {
  id: string;
  profileId: string;
  type: 'file-upload' | 'approval' | 'edit' | 'rejection' | 'style-guide';
  source: string; // file name, post ID, etc
  content?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  weight: number; // 1-5, importance of this training data
}

export interface AIAgentProfile {
  id: string;
  profileId: string;
  enabled: boolean;
  apiKey: string;
  trainingData: TrainingData[];
  stats: {
    totalTrainings: number;
    fileUploads: number;
    approvalsUsed: number;
    editsUsed: number;
    writingStyle: string[]; // detected writing patterns
    preferredTopics: string[];
    averageAccuracy: number; // 0-100
  };
  createdAt: string;
  updatedAt: string;
}

export class AIAgentTrainingService {
  private static readonly STORAGE_KEY = 'nomo_ai_agent_training';

  // ========== طريقة 1: تدريب من رفع الملفات ==========
  static addFileUploadTraining(
    profileId: string,
    fileName: string,
    content: string,
    weight: number = 3
  ): TrainingData {
    const training: TrainingData = {
      id: `train_file_${Date.now()}`,
      profileId,
      type: 'file-upload',
      source: fileName,
      content,
      weight,
      timestamp: new Date().toISOString(),
    };

    this.saveTrainingData(training);
    return training;
  }

  // ========== طريقة 2: تدريب من الموافقات ==========
  static addApprovalTraining(
    profileId: string,
    postId: string,
    content: string,
    weight: number = 2
  ): TrainingData {
    const training: TrainingData = {
      id: `train_approval_${Date.now()}`,
      profileId,
      type: 'approval',
      source: `post_${postId}`,
      content,
      weight, // موافقة = تدريب ضعيف
      timestamp: new Date().toISOString(),
    };

    this.saveTrainingData(training);
    return training;
  }

  // ========== طريقة 3: تدريب من التعديلات ==========
  static addEditTraining(
    profileId: string,
    postId: string,
    originalContent: string,
    editedContent: string,
    weight: number = 5
  ): TrainingData {
    const training: TrainingData = {
      id: `train_edit_${Date.now()}`,
      profileId,
      type: 'edit',
      source: `post_${postId}`,
      content: `[ORIGINAL]: ${originalContent}\n[EDITED]: ${editedContent}`,
      metadata: {
        original: originalContent,
        edited: editedContent,
        changeType: this.analyzeChange(originalContent, editedContent),
      },
      weight, // تعديل = تدريب قوي
      timestamp: new Date().toISOString(),
    };

    this.saveTrainingData(training);
    return training;
  }

  // ========== طريقة 4: تدريب من الرفض ==========
  static addRejectionTraining(
    profileId: string,
    postId: string,
    content: string,
    reason?: string,
    weight: number = 4
  ): TrainingData {
    const training: TrainingData = {
      id: `train_rejection_${Date.now()}`,
      profileId,
      type: 'rejection',
      source: `post_${postId}`,
      content,
      metadata: { reason },
      weight, // رفض = تدريب متوسط-قوي
      timestamp: new Date().toISOString(),
    };

    this.saveTrainingData(training);
    return training;
  }

  // ========== طريقة 5: دليل الأسلوب ==========
  static addStyleGuide(
    profileId: string,
    styleContent: string,
    weight: number = 4
  ): TrainingData {
    const training: TrainingData = {
      id: `train_style_${Date.now()}`,
      profileId,
      type: 'style-guide',
      source: 'style_guide',
      content: styleContent,
      weight,
      timestamp: new Date().toISOString(),
    };

    this.saveTrainingData(training);
    return training;
  }

  // ========== الإحصائيات والتحليل ==========
  static getTrainingStats(profileId: string) {
    const allTrainings = this.getAllTrainingData(profileId);

    const stats = {
      totalTrainings: allTrainings.length,
      fileUploads: allTrainings.filter(t => t.type === 'file-upload').length,
      approvalsUsed: allTrainings.filter(t => t.type === 'approval').length,
      editsUsed: allTrainings.filter(t => t.type === 'edit').length,
      rejectionsUsed: allTrainings.filter(t => t.type === 'rejection').length,
      styleGuidesUsed: allTrainings.filter(t => t.type === 'style-guide').length,
      totalWeight: allTrainings.reduce((sum, t) => sum + t.weight, 0),
      averageAccuracy: this.calculateAccuracy(profileId),
      trainingMethods: this.analyzeTrainingMethods(allTrainings),
      writingPatterns: this.extractWritingPatterns(allTrainings),
    };

    return stats;
  }

  // ========== الحصول على بيانات التدريب ==========
  static getAllTrainingData(profileId: string): TrainingData[] {
    try {
      const data = localStorage.getItem(`${this.STORAGE_KEY}_${profileId}`);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('خطأ في قراءة بيانات التدريب:', err);
      return [];
    }
  }

  static getRecentTraining(profileId: string, limit: number = 10): TrainingData[] {
    const allData = this.getAllTrainingData(profileId);
    return allData
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // ========== حذف بيانات التدريب ==========
  static clearTrainingData(profileId: string): void {
    localStorage.removeItem(`${this.STORAGE_KEY}_${profileId}`);
  }

  static deleteTraining(profileId: string, trainingId: string): void {
    const allData = this.getAllTrainingData(profileId);
    const filtered = allData.filter(t => t.id !== trainingId);
    localStorage.setItem(`${this.STORAGE_KEY}_${profileId}`, JSON.stringify(filtered));
  }

  // ========== التحليل الداخلي ==========
  private static saveTrainingData(training: TrainingData): void {
    const allData = this.getAllTrainingData(training.profileId);
    allData.push(training);
    localStorage.setItem(
      `${this.STORAGE_KEY}_${training.profileId}`,
      JSON.stringify(allData)
    );
  }

  private static analyzeChange(original: string, edited: string): string {
    const originalLength = original.length;
    const editedLength = edited.length;
    const percentChange = Math.abs(editedLength - originalLength) / originalLength * 100;

    if (percentChange > 50) return 'major-rewrite';
    if (percentChange > 20) return 'significant-edit';
    if (percentChange > 5) return 'minor-edit';
    return 'typo-fix';
  }

  private static calculateAccuracy(profileId: string): number {
    const trainings = this.getAllTrainingData(profileId);
    if (trainings.length === 0) return 0;

    const weights = trainings.map(t => t.weight);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const weightedAccuracy = weights.reduce((sum, w) => sum + w, 0) / weights.length;

    return Math.min(100, Math.round(weightedAccuracy * 20));
  }

  private static analyzeTrainingMethods(trainings: TrainingData[]) {
    return {
      mostUsed: trainings.length > 0
        ? this.getMode(trainings.map(t => t.type))
        : null,
      distribution: {
        fileUploads: trainings.filter(t => t.type === 'file-upload').length,
        approvals: trainings.filter(t => t.type === 'approval').length,
        edits: trainings.filter(t => t.type === 'edit').length,
        rejections: trainings.filter(t => t.type === 'rejection').length,
        styleGuides: trainings.filter(t => t.type === 'style-guide').length,
      },
    };
  }

  private static extractWritingPatterns(trainings: TrainingData[]): string[] {
    const patterns: string[] = [];

    // تحليل الطول المفضل
    const avgLength = trainings.reduce((sum, t) => sum + (t.content?.length || 0), 0) / Math.max(trainings.length, 1);
    if (avgLength < 100) patterns.push('إيجاز');
    if (avgLength > 500) patterns.push('تفصيل');

    // تحليل الأسلوب
    const contentJoined = trainings.map(t => t.content || '').join(' ');
    if (contentJoined.includes('😊') || contentJoined.includes('👍')) patterns.push('استخدام emoji');
    if (contentJoined.match(/[!]{2,}/g)) patterns.push('تعبيري');
    if (contentJoined.match(/[؟]{2,}/g)) patterns.push('تفاعلي');

    return patterns;
  }

  private static getMode<T>(arr: T[]): T | null {
    if (arr.length === 0) return null;
    const counts = new Map<T, number>();
    arr.forEach(item => counts.set(item, (counts.get(item) || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }
}
