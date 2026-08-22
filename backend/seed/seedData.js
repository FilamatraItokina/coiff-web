require('dotenv').config();
const db = require('../config/db');
const Barber = require('../models/barber.model');
const Service = require('../models/service.model');

const barbersData = [
  {
    name: 'Alexandre Martin',
    email: 'alexandre.martin@barbershop.fr',
    photoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    bio: "Maître barbier passionné avec 12 ans d'expérience dans les coupes traditionnelles et le rasage au coupe-chou.",
    specialties: ['Coupe classique', 'Rasage traditionnel', 'Taille de barbe'],
    workingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '09:00', end: '17:00' },
      sunday: null,
    },
  },
  {
    name: 'Thomas Dubois',
    email: 'thomas.dubois@barbershop.fr',
    photoUrl: 'https://images.unsplash.com/photo-1517832606589-7629c3397143?auto=format&fit=crop&w=800&q=80',
    bio: 'Spécialiste des dégradés modernes, skin fades et motifs artistiques.',
    specialties: ['Dégradé américain', 'Hair design', 'Coloration'],
    workingHours: {
      monday: null,
      tuesday: { start: '10:00', end: '19:00' },
      wednesday: { start: '10:00', end: '19:00' },
      thursday: { start: '10:00', end: '19:00' },
      friday: { start: '10:00', end: '19:00' },
      saturday: { start: '09:00', end: '18:00' },
      sunday: null,
    },
  },
  {
    name: 'Karim Benali',
    email: 'karim.benali@barbershop.fr',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Expert des soins de la barbe, textures frisées et crépues, rituels bien-être.',
    specialties: ['Taille de barbe sculptée', 'Soin vapeur & serviette chaude', 'Coupe texturée'],
    workingHours: {
      monday: null,
      tuesday: null,
      wednesday: { start: '14:00', end: '19:00' },
      thursday: { start: '14:00', end: '19:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '09:00', end: '18:00' },
      sunday: null,
    },
  },
  {
    name: 'Lucas Morel',
    email: 'lucas.morel@barbershop.fr',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Jeune barbier dynamique, adepte des tendances urbaines et des colorations stylées.',
    specialties: ['Dégradé à blanc', 'Décoloration / Patine', 'Coupe aux ciseaux'],
    workingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: null,
      wednesday: null,
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '20:00' },
      saturday: { start: '09:00', end: '19:00' },
      sunday: { start: '10:00', end: '16:00' },
    },
  },
];

const servicesData = [
  {
    name: 'Coupe Homme Classique',
    description: 'Shampoing, coupe aux ciseaux et tondeuse, coiffage et conseils personnalisés.',
    durationMinutes: 30,
    price: 25.0,
  },
  {
    name: 'Dégradé Américain (Skin Fade)',
    description: 'Dégradé à blanc ultra précis avec finitions rasoir et coiffage structuré.',
    durationMinutes: 45,
    price: 30.0,
  },
  {
    name: 'Taille & Entretien de Barbe',
    description: 'Taille sculptée, traçage des contours au rasoir, huile nourrissante et serviette chaude.',
    durationMinutes: 30,
    price: 20.0,
  },
  {
    name: 'Formule Complète : Coupe & Barbe',
    description: 'La totale : coupe complète, rituel barbe complet à la serviette chaude et coiffage.',
    durationMinutes: 60,
    price: 45.0,
  },
  {
    name: "Rasage Traditionnel à l'Ancienne",
    description: 'Rasage au coupe-chou avec mousse chaude, blaireau, double serviette et baume apaisant.',
    durationMinutes: 45,
    price: 35.0,
  },
  {
    name: 'Coloration / Décoloration & Patine',
    description: 'Blond polaire, patine grise ou couverture des cheveux blancs avec soin protecteur.',
    durationMinutes: 75,
    price: 55.0,
  },
  {
    name: 'Soin Visage & Masque Purifiant',
    description: 'Nettoyage en profondeur avec vapeur, gommage, masque au charbon et hydratation.',
    durationMinutes: 30,
    price: 25.0,
  },
];

function seedDatabase() {
  console.log('🌱 Démarrage du seed de la base de données...');

  try {
    db.prepare('DELETE FROM barbers').run();
    db.prepare('DELETE FROM services').run();
    console.log('✨ Tables barbers et services vidées avec succès.');

    const createdBarbers = [];
    for (const barber of barbersData) {
      const created = Barber.create(barber);
      createdBarbers.push(created);
    }
    console.log(`✂️ ${createdBarbers.length} barbiers insérés.`);

    const createdServices = [];
    for (const service of servicesData) {
      const created = Service.create(service);
      createdServices.push(created);
    }
    console.log(`💈 ${createdServices.length} services insérés.`);

    console.log('\n📊 Résumé du Seed :');
    console.log(`- Barbiers créés : ${createdBarbers.length}`);
    console.log(`- Services créés : ${createdServices.length}`);
    console.log('✅ Base de données initialisée avec succès !');

    return { barbers: createdBarbers, services: createdServices };
  } catch (error) {
    console.error('❌ Erreur lors du seed de la base de données :', error);
    throw error;
  }
}

if (require.main === module) {
  try {
    seedDatabase();
    db.close();
    process.exit(0);
  } catch (error) {
    db.close();
    process.exit(1);
  }
}

module.exports = { seedDatabase, barbersData, servicesData };
