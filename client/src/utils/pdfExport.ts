import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (
  elementId: string,
  filename: string = 'resume.pdf'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;

  let heightLeft = imgHeight * ratio;
  let position = 0;

  pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight * ratio;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pdfHeight;
  }

  pdf.save(filename);
};

export const resumeToPlainText = (resume: any): string => {
  const lines: string[] = [];

  if (resume.personalInfo?.fullName) {
    lines.push(resume.personalInfo.fullName);
    const contact = [
      resume.personalInfo.email,
      resume.personalInfo.phone,
      resume.personalInfo.location,
    ].filter(Boolean).join(' | ');
    if (contact) lines.push(contact);
    lines.push('');
  }

  if (resume.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push(resume.summary);
    lines.push('');
  }

  if (resume.experience?.length) {
    lines.push('EXPERIENCE');
    resume.experience.forEach((exp: any) => {
      lines.push(`${exp.position} at ${exp.company}`);
      lines.push(`${exp.location} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      exp.bullets?.forEach((b: string) => lines.push(`• ${b}`));
      lines.push('');
    });
  }

  if (resume.education?.length) {
    lines.push('EDUCATION');
    resume.education.forEach((edu: any) => {
      lines.push(`${edu.degree} in ${edu.field}`);
      lines.push(`${edu.institution} | ${edu.startDate} - ${edu.endDate}`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      lines.push('');
    });
  }

  if (resume.projects?.length) {
    lines.push('PROJECTS');
    resume.projects.forEach((proj: any) => {
      lines.push(proj.name);
      lines.push(proj.description);
      if (proj.technologies?.length) lines.push(`Technologies: ${proj.technologies.join(', ')}`);
      proj.bullets?.forEach((b: string) => lines.push(`• ${b}`));
      lines.push('');
    });
  }

  if (resume.skills?.length) {
    lines.push('SKILLS');
    resume.skills.forEach((cat: any) => {
      lines.push(`${cat.category}: ${cat.items.join(', ')}`);
    });
    lines.push('');
  }

  if (resume.certifications?.length) {
    lines.push('CERTIFICATIONS');
    resume.certifications.forEach((cert: any) => {
      lines.push(`${cert.name} - ${cert.issuer} (${cert.date})`);
    });
    lines.push('');
  }

  if (resume.achievements?.length) {
    lines.push('ACHIEVEMENTS');
    resume.achievements.forEach((ach: any) => {
      lines.push(`${ach.title}: ${ach.description}`);
    });
    lines.push('');
  }

  if (resume.languages?.length) {
    lines.push('LANGUAGES');
    resume.languages.forEach((lang: any) => {
      lines.push(`${lang.language} - ${lang.proficiency}`);
    });
    lines.push('');
  }

  return lines.join('\n');
};
