// Agent Custom Instructions & Skills System

export interface AgentInstruction {
  id: string;
  profileId: string;
  title: string; // مثال: "إنستقرام - سلايدات"
  platform?: string; // instagram, twitter, newsletter, etc
  description: string; // وصف التعليمة
  instruction: string; // التعليمة الفعلية
  priority: number; // 1-10 (أهمية التعليمة)
  enabled: boolean;
  examples?: string[]; // أمثلة على التطبيق
  createdAt: string;
  updatedAt: string;
}

export interface AgentSkill {
  id: string;
  profileId: string;
  skillName: string; // مثال: "كتابة HTML للنشرة البريدية"
  platform: string; // المنصة المستهدفة
  techDetails: string; // التفاصيل التقنية
  instructions: AgentInstruction[];
  masterExamples: string[]; // أمثلة عملية
  isActive: boolean;
  createdAt: string;
}

export class AgentInstructionsService {
  private static readonly STORAGE_KEY = 'nomo_agent_instructions';
  private static readonly SKILLS_KEY = 'nomo_agent_skills';

  // ========== إضافة تعليمة جديدة ==========
  static addInstruction(
    profileId: string,
    title: string,
    instruction: string,
    platform?: string,
    priority: number = 5,
    examples?: string[]
  ): AgentInstruction {
    const agentInstruction: AgentInstruction = {
      id: `instr_${Date.now()}`,
      profileId,
      title,
      platform,
      description: `تعليمة مخصصة: ${title}`,
      instruction,
      priority,
      enabled: true,
      examples,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveInstruction(agentInstruction);
    return agentInstruction;
  }

  // ========== الحصول على جميع التعليمات ==========
  static getProfileInstructions(profileId: string): AgentInstruction[] {
    try {
      const data = localStorage.getItem(`${this.STORAGE_KEY}_${profileId}`);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('خطأ في قراءة التعليمات:', err);
      return [];
    }
  }

  static getPlatformInstructions(profileId: string, platform: string): AgentInstruction[] {
    const all = this.getProfileInstructions(profileId);
    return all.filter(i => i.platform === platform && i.enabled);
  }

  // ========== التحديث والحذف ==========
  static updateInstruction(
    profileId: string,
    instructionId: string,
    updates: Partial<AgentInstruction>
  ): void {
    const instructions = this.getProfileInstructions(profileId);
    const index = instructions.findIndex(i => i.id === instructionId);

    if (index !== -1) {
      instructions[index] = {
        ...instructions[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        `${this.STORAGE_KEY}_${profileId}`,
        JSON.stringify(instructions)
      );
    }
  }

  static deleteInstruction(profileId: string, instructionId: string): void {
    const instructions = this.getProfileInstructions(profileId);
    const filtered = instructions.filter(i => i.id !== instructionId);
    localStorage.setItem(
      `${this.STORAGE_KEY}_${profileId}`,
      JSON.stringify(filtered)
    );
  }

  // ========== نظام المهارات المتقدمة ==========
  static createSkill(
    profileId: string,
    skillName: string,
    platform: string,
    techDetails: string,
    masterExamples: string[] = []
  ): AgentSkill {
    const skill: AgentSkill = {
      id: `skill_${Date.now()}`,
      profileId,
      skillName,
      platform,
      techDetails,
      instructions: [],
      masterExamples,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.saveSkill(skill);
    return skill;
  }

  static getProfileSkills(profileId: string): AgentSkill[] {
    try {
      const data = localStorage.getItem(`${this.SKILLS_KEY}_${profileId}`);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('خطأ في قراءة المهارات:', err);
      return [];
    }
  }

  static addInstructionToSkill(
    profileId: string,
    skillId: string,
    instruction: AgentInstruction
  ): void {
    const skills = this.getProfileSkills(profileId);
    const skill = skills.find(s => s.id === skillId);

    if (skill) {
      skill.instructions.push(instruction);
      this.saveSkill(skill);
    }
  }

  // ========== تحليل التعليمات ==========
  static getInstructionsSummary(profileId: string) {
    const instructions = this.getProfileInstructions(profileId);
    const skills = this.getProfileSkills(profileId);

    const byPlatform: Record<string, number> = {};
    instructions.forEach(i => {
      if (i.platform) {
        byPlatform[i.platform] = (byPlatform[i.platform] || 0) + 1;
      }
    });

    return {
      totalInstructions: instructions.length,
      totalSkills: skills.length,
      enabledInstructions: instructions.filter(i => i.enabled).length,
      instructionsByPlatform: byPlatform,
      highPriorityInstructions: instructions.filter(i => i.priority >= 7),
      skills,
    };
  }

  // ========== بناء Prompt للوكيل ==========
  static buildAgentPrompt(profileId: string, platform?: string): string {
    const instructions = platform
      ? this.getPlatformInstructions(profileId, platform)
      : this.getProfileInstructions(profileId).filter(i => i.enabled);

    if (instructions.length === 0) {
      return '';
    }

    let prompt = '### تعليمات مخصصة للوكيل:\n\n';

    instructions.sort((a, b) => b.priority - a.priority);

    instructions.forEach((instr, idx) => {
      prompt += `**${idx + 1}. ${instr.title}** (الأولوية: ${instr.priority}/10)\n`;
      prompt += `${instr.instruction}\n\n`;

      if (instr.examples && instr.examples.length > 0) {
        prompt += `مثال:\n${instr.examples[0]}\n\n`;
      }
    });

    return prompt;
  }

  // ========== القوالب المسبقة ==========
  static getTemplates(): Record<string, AgentInstruction> {
    return {
      newsletter_html: {
        id: 'template_newsletter',
        profileId: '',
        title: 'النشرة البريدية - صيغة HTML',
        platform: 'newsletter',
        description: 'تنسيق HTML احترافي للنشرة البريدية باللغة العربية',
        instruction: `اكتب النشرة البريدية بصيغة HTML كاملة مع:
- تنسيق احترافي ومرتب
- دعم كامل للغة العربية (RTL)
- ألوان متناسقة
- عناوين واضحة
- صور مضمنة (base64 أو URLs)
- فوتر بتفاصيل التواصل
- رابط إلغاء الاشتراك

استخدم CSS مضمن (inline styles) للتوافق الأفضل مع عملاء البريد.`,
        priority: 9,
        enabled: true,
        examples: [
          `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Arial', sans-serif; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    h1 { color: #2c3e50; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>النشرة البريدية</h1>
    <p>محتوى النشرة هنا...</p>
  </div>
</body>
</html>`
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      instagram_slides: {
        id: 'template_instagram',
        profileId: '',
        title: 'إنستقرام - سلايدات بخط ثمانية',
        platform: 'instagram',
        description: 'توليد سلايدات احترافية بخط ثمانية للإنستقرام',
        instruction: `عند إنشاء محتوى إنستقرام:
- استخدم الخط الثمانية (Diwani, Simplified Arabic, أو fonts العربية الأنيقة)
- تصميم سلايدات احترافية (16:9 أو 1:1)
- ألوان جريئة وجذابة
- نص مركز ومقروء من البعيد
- زخارف إسلامية عند الحاجة
- شعار العلامة التجارية في الزاوية
- كل سلايد تركيز على فكرة واحدة

الحد الأقصى: 5 سلايدات بمتوسط 2-3 أسطر نص لكل سلايد.`,
        priority: 8,
        enabled: true,
        examples: [
          'سلايد 1: عنوان رئيسي باللون الذهبي على خلفية تدرج أزرق بخط ثمانية كبير'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      twitter_threading: {
        id: 'template_twitter',
        profileId: '',
        title: 'تويتر - نمط التسلسل',
        platform: 'twitter',
        description: 'نمط كتابة متسلسل قوي على تويتر',
        instruction: `لكل تسلسل (thread) على تويتر:
- ابدأ بتغريدة مثيرة تجذب الانتباه (hook)
- استخدم الأرقام والنقاط (1/X, 2/X, إلخ)
- كل تغريدة 280 حرف أو أقل
- استخدم emoji بذكاء للفصل بين الأفكار
- اختم بدعوة للتفاعل (CTA)
- تجنب الإفراط في الهاشتاجات`,
        priority: 6,
        enabled: true,
        examples: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  // ========== Private Methods ==========
  private static saveInstruction(instruction: AgentInstruction): void {
    const instructions = this.getProfileInstructions(instruction.profileId);
    instructions.push(instruction);
    localStorage.setItem(
      `${this.STORAGE_KEY}_${instruction.profileId}`,
      JSON.stringify(instructions)
    );
  }

  private static saveSkill(skill: AgentSkill): void {
    const skills = this.getProfileSkills(skill.profileId);
    const index = skills.findIndex(s => s.id === skill.id);

    if (index !== -1) {
      skills[index] = skill;
    } else {
      skills.push(skill);
    }

    localStorage.setItem(
      `${this.SKILLS_KEY}_${skill.profileId}`,
      JSON.stringify(skills)
    );
  }
}
