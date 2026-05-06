import jsPDF from 'jspdf';
import { Module, TestStats } from '@/types';
import { TestStatus } from '@prisma/client';

export const generatePDF = (modules: Module[], stats: TestStats) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;
  const lineHeight = 7;
  const margin = 20;

  // Fonction pour ajouter une nouvelle page si nécessaire
  const checkPageBreak = (requiredSpace: number = 10) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // En-tête
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Rapport de Tests Fonctionnels', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Généré le ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;

  // Résumé global
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 30, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Résumé Global', margin + 5, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.setTextColor(34, 197, 94); // Vert
  doc.text(`✓ Tests réussis: ${stats.success}`, margin + 5, yPosition);
  
  yPosition += 6;
  doc.setTextColor(239, 68, 68); // Rouge
  doc.text(`✗ Tests échoués: ${stats.failure}`, margin + 5, yPosition);
  
  yPosition += 6;
  doc.setTextColor(156, 163, 175); // Gris
  doc.text(`○ Tests non testés: ${stats.notTested}`, margin + 5, yPosition);
  
  yPosition += 6;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: ${stats.total} tests`, margin + 5, yPosition);
  
  yPosition += 15;

  // Détail par module
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Détail des Tests par Module', margin, yPosition);
  yPosition += 10;

  modules.forEach((module, moduleIndex) => {
    checkPageBreak(20);

    // Titre du module
    doc.setFillColor(59, 130, 246); // Bleu
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${moduleIndex + 1}. ${module.name}`, margin + 3, yPosition);
    doc.setTextColor(0, 0, 0);
    
    yPosition += 10;

    // Tests du module
    module.tests.forEach((test, testIndex) => {
      checkPageBreak(15);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Statut avec couleur
      let statusText = '';
      let statusColor: [number, number, number] = [0, 0, 0];
      
      switch (test.status) {
        case TestStatus.SUCCESS:
          statusText = '✓ SUCCÈS';
          statusColor = [34, 197, 94];
          break;
        case TestStatus.FAILURE:
          statusText = '✗ ÉCHEC';
          statusColor = [239, 68, 68];
          break;
        case TestStatus.NOT_TESTED:
          statusText = '○ NON TESTÉ';
          statusColor = [156, 163, 175];
          break;
      }

      doc.setTextColor(...statusColor);
      doc.setFont('helvetica', 'bold');
      doc.text(statusText, margin + 5, yPosition);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(`${testIndex + 1}. ${test.name}`, margin + 35, yPosition);
      
      yPosition += lineHeight;

      // Remarque (si présente)
      if (test.remark) {
        checkPageBreak(10);
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70);
        doc.setFont('helvetica', 'italic');
        
        const remarkLines = doc.splitTextToSize(
          `💬 Remarque: ${test.remark}`,
          pageWidth - 2 * margin - 15
        );
        
        remarkLines.forEach((line: string) => {
          doc.text(line, margin + 15, yPosition);
          yPosition += 5;
        });
        
        yPosition += 2;
      }

      // Description de l'erreur si échec
      if (test.status === TestStatus.FAILURE && test.issueDescription) {
        checkPageBreak(15);
        doc.setFontSize(9);
        doc.setTextColor(200, 50, 50);
        doc.setFont('helvetica', 'bold');
        doc.text('⚠️ PROBLÈME:', margin + 15, yPosition);
        yPosition += 5;
        
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'italic');
        
        const descLines = doc.splitTextToSize(
          test.issueDescription,
          pageWidth - 2 * margin - 15
        );
        
        descLines.forEach((line: string) => {
          doc.text(line, margin + 15, yPosition);
          yPosition += 5;
        });
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        yPosition += 3;
      }
    });

    yPosition += 5;
  });

  // Pied de page sur toutes les pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Télécharger le PDF
  const fileName = `rapport-tests-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
