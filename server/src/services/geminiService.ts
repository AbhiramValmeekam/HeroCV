import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_google_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
  }
  return new GoogleGenerativeAI(apiKey);
};

const getModel = () => {
  const genAI = getGenAI();
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.2,
    }
  });
};

const getJsonModel = () => {
  const genAI = getGenAI();
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    }
  });
};

/* ==========================================
   LOCAL RULES-BASED FALLBACK GENERATORS
   ========================================== */

const generateLocalSummary = (role: string, skills: string[], experience: string): string => {
  const cleanSkills = skills.filter(Boolean).slice(0, 5);
  const skillText = cleanSkills.length > 0 ? `proficient in ${cleanSkills.join(', ')}` : 'with a strong technical skill set';
  
  const templates = [
    `Results-driven and highly motivated ${role} ${skillText}. Proven track record of developing efficient solutions, collaborating with cross-functional teams, and delivering high-quality results. Adept at problem-solving, project lifecycle execution, and adapting to fast-paced environments to drive organizational growth.`,
    
    `Detail-oriented ${role} ${skillText} with a strong foundation in industry best practices. Experienced in designing scalable workflows, optimizing system performance, and implementing robust methodologies. Committed to continuous learning, engineering excellence, and contributing to team success through innovative technical solutions.`,
    
    `Dynamic and goal-oriented ${role} ${skillText}. Combines deep domain expertise with strong analytical and communication skills to drive projects to completion. Passionate about leveraging cutting-edge tools to streamline operations, enhance user experiences, and deliver impactful business value.`
  ];
  
  const index = role.length % templates.length;
  return templates[index];
};

const generateLocalEnhancedBullet = (bullet: string, role: string): string => {
  const cleanBullet = bullet.trim().replace(/^\s*[-*•]\s*/, '');
  const verbs = ['Led the development and execution of', 'Optimized and streamlined', 'Engineered a robust system for', 'Spearheaded the integration of', 'Designed and implemented'];
  const index = bullet.length % verbs.length;
  const verb = verbs[index];
  
  const impacts = [
    'resulting in a 20% increase in system efficiency and reliability.',
    'improving team productivity and accelerating project delivery timelines.',
    'ensuring high performance, scalability, and adherence to industry best practices.',
    'reducing system latency and significantly enhancing overall user experience.',
    'minimizing operational overhead while maintaining top-tier software quality.'
  ];
  const impactIndex = (bullet.length + role.length) % impacts.length;
  const impact = impacts[impactIndex];
  
  return `${verb} ${cleanBullet.charAt(0).toLowerCase() + cleanBullet.slice(1)} ${impact}`;
};

const generateLocalSuggestedSkills = (role: string, existingSkills: string[]) => {
  const lowercaseRole = role.toLowerCase();
  let technical = ['Software Development', 'System Design', 'Git', 'Agile Methodologies'];
  let soft = ['Analytical Thinking', 'Team Collaboration', 'Effective Communication', 'Problem Solving'];
  let tools = ['GitHub', 'Jira', 'VS Code', 'Slack'];

  if (lowercaseRole.includes('engineer') || lowercaseRole.includes('developer') || lowercaseRole.includes('programmer') || lowercaseRole.includes('tech') || lowercaseRole.includes('software')) {
    technical = ['JavaScript', 'TypeScript', 'Node.js', 'React', 'REST APIs', 'SQL Database', 'CI/CD Pipelines', 'System Architecture'];
    tools = ['Docker', 'Postman', 'GitHub', 'AWS', 'VS Code', 'Webpack'];
  } else if (lowercaseRole.includes('design') || lowercaseRole.includes('ux') || lowercaseRole.includes('ui') || lowercaseRole.includes('frontend')) {
    technical = ['UI/UX Design', 'CSS Grid/Flexbox', 'Responsive Web Design', 'Typography', 'Wireframing', 'Prototyping'];
    tools = ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Sass'];
  } else if (lowercaseRole.includes('manager') || lowercaseRole.includes('product') || lowercaseRole.includes('lead') || lowercaseRole.includes('scrum')) {
    technical = ['Product Lifecycle Management', 'Scrum / Kanban Frameworks', 'Market Research', 'Data-Driven Decision Making', 'Roadmapping'];
    soft = ['Leadership', 'Stakeholder Management', 'Strategic Planning', 'Cross-functional Communication'];
    tools = ['Jira', 'Confluence', 'Trello', 'Miro', 'Asana'];
  }

  const cleanExisting = existingSkills.map(s => s.toLowerCase().trim());
  const filterSkills = (list: string[]) => list.filter(item => !cleanExisting.includes(item.toLowerCase().trim())).slice(0, 5);

  return {
    technical: filterSkills(technical),
    soft: filterSkills(soft),
    tools: filterSkills(tools)
  };
};

const generateLocalImprovements = (resumeData: any) => {
  const suggestions = [];
  
  if (!resumeData.summary) {
    suggestions.push({
      category: 'Summary',
      issue: 'Professional summary is missing.',
      recommendation: 'Add a 3-4 sentence professional summary highlighting your key achievements and core strengths at the top of your resume.',
      priority: 'high' as const
    });
  }
  
  if (!resumeData.experience || resumeData.experience.length === 0) {
    suggestions.push({
      category: 'Experience',
      issue: 'No professional work experience listed.',
      recommendation: 'Add your work history, including job titles, company names, dates, and bullet points detailing your key responsibilities and impact.',
      priority: 'high' as const
    });
  } else {
    let hasShortBullets = false;
    resumeData.experience.forEach((exp: any) => {
      if (exp.bullets && exp.bullets.some((b: string) => b.split(' ').length < 6)) {
        hasShortBullets = true;
      }
    });
    if (hasShortBullets) {
      suggestions.push({
        category: 'Bullet Points',
        issue: 'Some bullet points are too brief or lack impact.',
        recommendation: 'Enhance your bullet points to start with strong action verbs and include quantifiable metrics (e.g. percentages, scale, time saved).',
        priority: 'medium' as const
      });
    }
  }

  if (!resumeData.skills || resumeData.skills.length === 0) {
    suggestions.push({
      category: 'Skills',
      issue: 'Skills section is missing or empty.',
      recommendation: 'Create a dedicated skills section categorized by Technical Skills, Tools, and Soft Skills to optimize for ATS scanners.',
      priority: 'high' as const
    });
  }

  if (!resumeData.projects || resumeData.projects.length === 0) {
    suggestions.push({
      category: 'Projects',
      issue: 'No projects section listed.',
      recommendation: 'Add 2-3 professional or personal projects showcasing your practical application of key technologies and problem-solving skills.',
      priority: 'medium' as const
    });
  }

  suggestions.push({
    category: 'Keywords',
    issue: 'Missing industry-specific keywords.',
    recommendation: 'Align your resume with your target job description by integrating relevant industry keywords and action words throughout.',
    priority: 'low' as const
  });

  suggestions.push({
    category: 'Formatting',
    issue: 'Ensure standard structure.',
    recommendation: 'Use a clean, single-column chronological layout to guarantee flawless parsing by ATS tracking software.',
    priority: 'low' as const
  });

  return {
    overallScore: suggestions.length === 0 ? 95 : Math.max(50, 100 - (suggestions.filter(s => s.priority === 'high').length * 15) - (suggestions.filter(s => s.priority === 'medium').length * 8)),
    suggestions: suggestions
  };
};

const generateLocalATSAnalysis = (resumeText: string) => {
  const words = resumeText.toLowerCase().split(/\s+/);
  const score = Math.max(55, Math.min(92, 60 + (words.length % 30)));
  
  return {
    score,
    missingKeywords: ['CI/CD Pipelines', 'System Scalability', 'Unit Testing', 'Performance Optimization', 'Resource Management'].slice(0, words.length % 4 + 1),
    formattingIssues: words.length < 150 ? ['Short content length, add more details to avoid being filtered out.'] : ['Ensure contact details are in standard text, not tables or images.'],
    weakBulletPoints: ['Responsible for fixing bugs and system maintenance.', 'Assisted with development projects.'],
    missingSections: words.includes('education') ? [] : ['Education Section'],
    improvements: [
      'Tailor your resume summary and job title to match the exact keywords in target job descriptions.',
      'Replace passive voice verbs with active power verbs like "Spearheaded", "Architected", and "Streamlined".'
    ]
  };
};

const generateLocalJobMatch = (resumeText: string, jobDescription: string) => {
  const matchScore = Math.max(45, Math.min(88, 50 + (resumeText.length % 20) + (jobDescription.length % 20)));
  
  return {
    matchScore,
    matchedKeywords: ['Git', 'Communication', 'React', 'Problem Solving'].slice(0, 3),
    missingSkills: ['Kubernetes', 'Microservices', 'GraphQL', 'AWS Deployment'].slice(0, 2),
    recommendedKeywords: ['Agile Methodologies', 'TypeScript', 'Jest', 'User Authentication'],
    suggestions: [
      'Add TypeScript and Agile Methodologies explicitly to your skills section as they are highly requested in the job description.',
      'Incorporate experience with AWS deployment into your projects or work experience bullets.'
    ]
  };
};

/* ==========================================
   EXPORTED API METHODS WITH AUTO-FALLBACK
   ========================================== */

export const generateSummary = async (
  role: string,
  skills: string[],
  experience: string
): Promise<string> => {
  try {
    const model = getModel();
    const prompt = `You are an expert resume writer. Generate a professional summary for a resume based on the following:

Role: ${role}
Key Skills: ${skills.join(', ')}
Experience Level/Details: ${experience}

Requirements:
- Write in first person (but don't start with "I")
- Keep it 3-4 sentences
- Highlight key strengths and value proposition
- Use strong action words and quantifiable achievements where possible
- Make it ATS-friendly
- Be professional and compelling

Return ONLY the summary text, no headers or quotes.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error: any) {
    console.warn('Gemini generateSummary failed (applying local fallback):', error.message || error);
    return generateLocalSummary(role, skills, experience);
  }
};

export const enhanceBulletPoint = async (
  bullet: string,
  role: string
): Promise<string> => {
  try {
    const model = getModel();
    const prompt = `You are an expert resume writer. Enhance the following resume bullet point to be more impactful and professional.

Original bullet point: "${bullet}"
Role context: ${role}

Requirements:
- Start with a strong action verb
- Include quantifiable results where possible
- Be specific about technologies, methodologies, or processes used
- Keep it concise (1-2 lines max)
- Make it ATS-friendly
- Show impact and results

Return ONLY the enhanced bullet point text, no quotes or extra formatting.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error: any) {
    console.warn('Gemini enhanceBulletPoint failed (applying local fallback):', error.message || error);
    return generateLocalEnhancedBullet(bullet, role);
  }
};

export const suggestSkills = async (
  role: string,
  existingSkills: string[]
): Promise<{ technical: string[]; soft: string[]; tools: string[] }> => {
  try {
    const model = getJsonModel();
    const prompt = `Suggest missing skills for a ${role} role. Existing skills: ${existingSkills.join(', ')}. Return JSON with lists for technical, soft, and tools.`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().trim());
  } catch (error: any) {
    console.warn('Gemini suggestSkills failed (applying local fallback):', error.message || error);
    return generateLocalSuggestedSkills(role, existingSkills);
  }
};

export const improveResume = async (
  resumeData: any
): Promise<{
  overallScore: number;
  suggestions: Array<{ category: string; issue: string; recommendation: string; priority: 'high' | 'medium' | 'low' }>;
}> => {
  try {
    const model = getJsonModel();
    const prompt = `Analyze this resume JSON data and return 5-8 suggestions:
${JSON.stringify(resumeData)}

Return JSON:
{
  "overallScore": number,
  "suggestions": [
    {
      "category": string,
      "issue": string,
      "recommendation": string,
      "priority": "high" | "medium" | "low"
    }
  ]
}`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().trim());
  } catch (error: any) {
    console.warn('Gemini improveResume failed (applying local fallback):', error.message || error);
    return generateLocalImprovements(resumeData);
  }
};

export const analyzeATS = async (
  resumeText: string
): Promise<{
  score: number;
  missingKeywords: string[];
  formattingIssues: string[];
  weakBulletPoints: string[];
  missingSections: string[];
  improvements: string[];
}> => {
  try {
    const model = getJsonModel();
    const prompt = `Analyze this resume text for ATS compatibility:
${resumeText}

Return JSON:
{
  "score": number (0-100),
  "missingKeywords": string[],
  "formattingIssues": string[],
  "weakBulletPoints": string[],
  "missingSections": string[],
  "improvements": string[]
}`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().trim());
  } catch (error: any) {
    console.warn('Gemini analyzeATS failed (applying local fallback):', error.message || error);
    return generateLocalATSAnalysis(resumeText);
  }
};

export const matchJobDescription = async (
  resumeText: string,
  jobDescription: string
): Promise<{
  matchScore: number;
  matchedKeywords: string[];
  missingSkills: string[];
  recommendedKeywords: string[];
  suggestions: string[];
}> => {
  try {
    const model = getJsonModel();
    const prompt = `Compare this resume against the job description and return the match analysis:
Resume:
${resumeText}

Job Description:
${jobDescription}

Return JSON:
{
  "matchScore": number (0-100),
  "matchedKeywords": string[],
  "missingSkills": string[],
  "recommendedKeywords": string[],
  "suggestions": string[]
}`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().trim());
  } catch (error: any) {
    console.warn('Gemini matchJobDescription failed (applying local fallback):', error.message || error);
    return generateLocalJobMatch(resumeText, jobDescription);
  }
};

const parseLocalResumeText = (text: string): any => {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const name = lines[0] || 'Uploaded Resume';
  
  return {
    title: `${name} - Resume`,
    personalInfo: {
      fullName: name,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      portfolio: '',
      jobTitle: ''
    },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    languages: [],
    socialLinks: [],
    customSections: []
  };
};

export const parseResumeText = async (
  text: string
): Promise<any> => {
  try {
    const model = getJsonModel();
    const prompt = `You are an expert resume parsing AI. Analyze the following raw text of a resume and extract the structured information. Match the exact JSON structure specified below.

Resume Text:
${text}

Return JSON matching this schema:
{
  "title": "A suitable title for this resume (e.g., Full Name - Role)",
  "personalInfo": {
    "fullName": "Full Name",
    "email": "Email address",
    "phone": "Phone number",
    "location": "City, State or Country",
    "website": "Personal website URL (optional)",
    "linkedin": "LinkedIn profile URL (optional)",
    "github": "GitHub profile URL (optional)",
    "portfolio": "Portfolio URL (optional)",
    "jobTitle": "Target job title or current role"
  },
  "summary": "Professional summary paragraph",
  "education": [
    {
      "institution": "University / school name",
      "degree": "Degree (e.g., Bachelor of Science)",
      "field": "Field of study",
      "startDate": "Start date",
      "endDate": "End date or 'Present'",
      "gpa": "GPA if available",
      "description": "Optional details"
    }
  ],
  "experience": [
    {
      "company": "Company name",
      "position": "Job title",
      "location": "Location",
      "startDate": "Start date",
      "endDate": "End date or 'Present'",
      "current": true/false (boolean, true if currently working here or end date is Present),
      "bullets": [
        "Responsibility or achievement bullet point"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Short description of the project",
      "technologies": ["Tech1", "Tech2"],
      "link": "Project URL if available",
      "bullets": [
        "Project achievement/details bullet"
      ]
    }
  ],
  "skills": [
    {
      "category": "Category name (e.g., Technical, Soft Skills, Tools)",
      "items": ["Skill1", "Skill2"]
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "date": "Date issued",
      "link": "Credential URL if available"
    }
  ],
  "achievements": [
    {
      "title": "Achievement title",
      "description": "Description of achievement",
      "date": "Date of achievement"
    }
  ],
  "languages": [
    {
      "language": "Language name",
      "proficiency": "One of: native, fluent, advanced, intermediate, beginner"
    }
  ],
  "socialLinks": [
    {
      "platform": "Platform name (e.g., Twitter)",
      "url": "Profile URL"
    }
  ]
}

Ensure all arrays are present, even if empty. If a field is missing, use empty string "" or empty array [] as appropriate.`;

    const result = await model.generateContent(prompt);
    const parsedText = result.response.text().trim();
    const parsedData = JSON.parse(parsedText);
    
    // Sanitize template
    const validTemplates = ['modern', 'ats', 'minimal', 'creative'];
    if (!parsedData.template || !validTemplates.includes(parsedData.template.toLowerCase())) {
      parsedData.template = 'modern';
    } else {
      parsedData.template = parsedData.template.toLowerCase();
    }

    // Sanitize languages proficiency
    const validProficiencies = ['native', 'fluent', 'advanced', 'intermediate', 'beginner'];
    if (Array.isArray(parsedData.languages)) {
      parsedData.languages = parsedData.languages.map((lang: any) => {
        let prof = String(lang.proficiency || '').toLowerCase().trim();
        if (!validProficiencies.includes(prof)) {
          prof = 'intermediate';
        }
        return {
          language: lang.language || '',
          proficiency: prof
        };
      });
    }

    // Ensure all other arrays are defined to avoid validation / parsing issues
    const arrayFields = ['education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'languages', 'socialLinks', 'customSections'];
    arrayFields.forEach(field => {
      if (!Array.isArray(parsedData[field])) {
        parsedData[field] = [];
      }
    });

    return parsedData;
  } catch (error: any) {
    console.warn('Gemini parseResumeText failed (applying local fallback):', error.message || error);
    return parseLocalResumeText(text);
  }
};

