// File Management System for storing and analyzing uploaded files

export interface StoredFile {
  id: string;
  name: string;
  type: 'image' | 'text' | 'pdf' | 'video' | 'audio' | 'other';
  size: number;
  uploadedAt: string;
  profileId: string;
  content?: string; // For text files
  preview?: string; // For images
  mimeType: string;
  tags?: string[];
}

export interface FileAnalytics {
  totalFiles: number;
  totalSize: number;
  byType: Record<string, number>;
  recentFiles: StoredFile[];
  usedForAI: number;
  usedForScheduling: number;
}

export class FileManagementService {
  private static readonly STORAGE_KEY = 'nomo_uploaded_files';
  private static readonly MAX_STORAGE = 500 * 1024 * 1024; // 500MB

  static async storeFile(file: File, profileId: string, tags?: string[]): Promise<StoredFile> {
    const content = await this.readFileContent(file);
    const preview = await this.generatePreview(file);

    const storedFile: StoredFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: this.getFileType(file.type),
      size: file.size,
      uploadedAt: new Date().toISOString(),
      profileId,
      content: typeof content === 'string' ? content : undefined,
      preview,
      mimeType: file.type,
      tags: tags || []
    };

    this.saveToStorage(storedFile);
    return storedFile;
  }

  static getProfileFiles(profileId: string): StoredFile[] {
    const files = this.getAllFiles();
    return files.filter(f => f.profileId === profileId);
  }

  static getAllFiles(): StoredFile[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('خطأ في قراءة الملفات المحفوظة:', err);
      return [];
    }
  }

  static getFileAnalytics(profileId: string): FileAnalytics {
    const files = this.getProfileFiles(profileId);
    const byType: Record<string, number> = {};

    files.forEach(file => {
      byType[file.type] = (byType[file.type] || 0) + 1;
    });

    return {
      totalFiles: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      byType,
      recentFiles: files.sort((a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      ).slice(0, 5),
      usedForAI: files.filter(f => f.tags?.includes('ai-training')).length,
      usedForScheduling: files.filter(f => f.tags?.includes('scheduled')).length
    };
  }

  static deleteFile(fileId: string): void {
    const files = this.getAllFiles();
    const filtered = files.filter(f => f.id !== fileId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  static updateFileTags(fileId: string, tags: string[]): void {
    const files = this.getAllFiles();
    const file = files.find(f => f.id === fileId);
    if (file) {
      file.tags = tags;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
    }
  }

  static async exportFiles(profileId: string): Promise<Blob> {
    const files = this.getProfileFiles(profileId);
    const exportData = {
      exportedAt: new Date().toISOString(),
      profileId,
      fileCount: files.length,
      files: files.map(f => ({
        ...f,
        content: undefined // Don't export large content
      }))
    };

    return new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  }

  private static async readFileContent(file: File): Promise<string | null> {
    const type = file.type;

    if (type.startsWith('text/') || type === 'application/json') {
      return await file.text();
    }

    if (type === 'application/pdf') {
      return `[PDF File: ${file.name}]`;
    }

    return null;
  }

  private static async generatePreview(file: File): Promise<string | undefined> {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }
    return undefined;
  }

  private static getFileType(mimeType: string): StoredFile['type'] {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'other';
  }

  private static saveToStorage(file: StoredFile): void {
    const files = this.getAllFiles();
    files.push(file);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
  }

  static linkFileToAI(fileId: string, profileId: string): void {
    this.updateFileTags(fileId, ['ai-training']);

    // Log AI training event
    const aiTrainingKey = `nomo_ai_training_${profileId}`;
    const training = JSON.parse(localStorage.getItem(aiTrainingKey) || '[]');
    training.push({
      fileId,
      linkedAt: new Date().toISOString(),
      type: 'file-upload'
    });
    localStorage.setItem(aiTrainingKey, JSON.stringify(training));
  }

  static linkFileToSchedule(fileId: string, scheduleDate: string): void {
    this.updateFileTags(fileId, ['scheduled']);

    // Link to schedule
    const scheduledFilesKey = `nomo_scheduled_files_${scheduleDate}`;
    const scheduled = JSON.parse(localStorage.getItem(scheduledFilesKey) || '[]');
    scheduled.push(fileId);
    localStorage.setItem(scheduledFilesKey, JSON.stringify(scheduled));
  }
}
