import { PrismaClient, TestStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.testSessionTest.deleteMany();
  await prisma.testSession.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.module.deleteMany();

  // Create modules with tests
  const modules = [
    {
      name: 'Rechargement',
      order: 1,
      tests: [
        { name: 'Rechargement Orange - Montant standard', status: TestStatus.NOT_TESTED },
        { name: 'Rechargement MTN - Montant standard', status: TestStatus.NOT_TESTED },
        { name: 'Rechargement Moov - Montant standard', status: TestStatus.NOT_TESTED },
        { name: 'Rechargement Wave - Montant standard', status: TestStatus.NOT_TESTED },
        { name: 'Rechargement Orange - Montant minimum', status: TestStatus.NOT_TESTED },
        { name: 'Rechargement MTN - Montant minimum', status: TestStatus.NOT_TESTED },
        { name: 'Rechargement avec solde insuffisant', status: TestStatus.NOT_TESTED },
        { name: 'Vérification du solde après rechargement', status: TestStatus.NOT_TESTED },
      ],
    },
    {
      name: 'Transfert',
      order: 2,
      tests: [
        { name: 'Transfert vers Orange', status: TestStatus.NOT_TESTED },
        { name: 'Transfert vers MTN', status: TestStatus.NOT_TESTED },
        { name: 'Transfert vers Moov', status: TestStatus.NOT_TESTED },
        { name: 'Transfert vers Wave', status: TestStatus.NOT_TESTED },
        { name: 'Transfert avec solde insuffisant', status: TestStatus.NOT_TESTED },
        { name: 'Transfert vers numéro invalide', status: TestStatus.NOT_TESTED },
        { name: 'Historique des transferts', status: TestStatus.NOT_TESTED },
        { name: 'Annulation de transfert', status: TestStatus.NOT_TESTED },
      ],
    },
    {
      name: 'Paiement',
      order: 3,
      tests: [
        { name: 'Paiement entre utilisateurs MADIS', status: TestStatus.NOT_TESTED },
        { name: 'Paiement marchand', status: TestStatus.NOT_TESTED },
        { name: 'Paiement de facture', status: TestStatus.NOT_TESTED },
        { name: 'Paiement avec solde insuffisant', status: TestStatus.NOT_TESTED },
        { name: 'Confirmation de paiement', status: TestStatus.NOT_TESTED },
        { name: 'Historique des paiements', status: TestStatus.NOT_TESTED },
      ],
    },
    {
      name: 'QR Code',
      order: 4,
      tests: [
        { name: 'Génération de QR code', status: TestStatus.NOT_TESTED },
        { name: 'Scan de QR code valide', status: TestStatus.NOT_TESTED },
        { name: 'Scan de QR code invalide', status: TestStatus.NOT_TESTED },
        { name: 'Paiement via QR code', status: TestStatus.NOT_TESTED },
        { name: 'QR code dynamique', status: TestStatus.NOT_TESTED },
        { name: 'QR code expiré', status: TestStatus.NOT_TESTED },
      ],
    },
    {
      name: 'Coffre',
      order: 5,
      tests: [
        { name: 'Création d\'un coffre', status: TestStatus.NOT_TESTED },
        { name: 'Ajout de fonds dans le coffre', status: TestStatus.NOT_TESTED },
        { name: 'Retrait de fonds du coffre', status: TestStatus.NOT_TESTED },
        { name: 'Retrait avec solde coffre insuffisant', status: TestStatus.NOT_TESTED },
        { name: 'Modification du nom du coffre', status: TestStatus.NOT_TESTED },
        { name: 'Suppression du coffre', status: TestStatus.NOT_TESTED },
        { name: 'Historique des opérations coffre', status: TestStatus.NOT_TESTED },
      ],
    },
    {
      name: 'Cagnotte',
      order: 6,
      tests: [
        { name: 'Création d\'une cagnotte', status: TestStatus.NOT_TESTED },
        { name: 'Contribution à une cagnotte', status: TestStatus.NOT_TESTED },
        { name: 'Partage de cagnotte via lien', status: TestStatus.NOT_TESTED },
        { name: 'Modification de la cagnotte', status: TestStatus.NOT_TESTED },
        { name: 'Clôture de cagnotte', status: TestStatus.NOT_TESTED },
        { name: 'Distribution des fonds de cagnotte', status: TestStatus.NOT_TESTED },
        { name: 'Historique des contributions', status: TestStatus.NOT_TESTED },
      ],
    },
  ];

  for (const moduleData of modules) {
    const { tests, ...moduleInfo } = moduleData;
    const module = await prisma.module.create({
      data: {
        ...moduleInfo,
        tests: {
          create: tests,
        },
      },
    });
    console.log(`✅ Created module: ${module.name} with ${tests.length} tests`);
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
