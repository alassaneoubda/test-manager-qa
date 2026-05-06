import { Module, TestStatus } from '@/types';

export const initialModules: Module[] = [
  {
    id: '1',
    name: 'Recharge',
    tests: [
      { id: '1-1', name: 'Recharge par carte bancaire', status: TestStatus.NOT_TESTED },
      { id: '1-2', name: 'Recharge par mobile money', status: TestStatus.NOT_TESTED },
      { id: '1-3', name: 'Recharge par virement', status: TestStatus.NOT_TESTED },
      { id: '1-4', name: 'Vérification du solde après recharge', status: TestStatus.NOT_TESTED },
    ],
  },
  {
    id: '2',
    name: 'Transfert',
    tests: [
      { id: '2-1', name: 'Transfert vers un contact', status: TestStatus.NOT_TESTED },
      { id: '2-2', name: 'Transfert vers un numéro externe', status: TestStatus.NOT_TESTED },
      { id: '2-3', name: 'Transfert avec solde insuffisant', status: TestStatus.NOT_TESTED },
      { id: '2-4', name: 'Historique des transferts', status: TestStatus.NOT_TESTED },
    ],
  },
  {
    id: '3',
    name: 'Paiement',
    tests: [
      { id: '3-1', name: 'Paiement marchand', status: TestStatus.NOT_TESTED },
      { id: '3-2', name: 'Paiement de facture', status: TestStatus.NOT_TESTED },
      { id: '3-3', name: 'Paiement récurrent', status: TestStatus.NOT_TESTED },
      { id: '3-4', name: 'Annulation de paiement', status: TestStatus.NOT_TESTED },
    ],
  },
  {
    id: '4',
    name: 'QR Code',
    tests: [
      { id: '4-1', name: 'Génération de QR code', status: TestStatus.NOT_TESTED },
      { id: '4-2', name: 'Scan de QR code', status: TestStatus.NOT_TESTED },
      { id: '4-3', name: 'Paiement via QR code', status: TestStatus.NOT_TESTED },
      { id: '4-4', name: 'QR code dynamique', status: TestStatus.NOT_TESTED },
    ],
  },
  {
    id: '5',
    name: 'Coffre',
    tests: [
      { id: '5-1', name: 'Création d\'un coffre', status: TestStatus.NOT_TESTED },
      { id: '5-2', name: 'Dépôt dans le coffre', status: TestStatus.NOT_TESTED },
      { id: '5-3', name: 'Retrait du coffre', status: TestStatus.NOT_TESTED },
      { id: '5-4', name: 'Suppression du coffre', status: TestStatus.NOT_TESTED },
    ],
  },
  {
    id: '6',
    name: 'Cagnotte',
    tests: [
      { id: '6-1', name: 'Création d\'une cagnotte', status: TestStatus.NOT_TESTED },
      { id: '6-2', name: 'Contribution à une cagnotte', status: TestStatus.NOT_TESTED },
      { id: '6-3', name: 'Partage de cagnotte', status: TestStatus.NOT_TESTED },
      { id: '6-4', name: 'Clôture de cagnotte', status: TestStatus.NOT_TESTED },
    ],
  },
];
