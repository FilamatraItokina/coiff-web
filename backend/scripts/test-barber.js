const Barber = require('../models/barber.model');

try {
  const barber = Barber.create({
    name: 'Barber Test',
    photoUrl: 'https://example.com/photo.jpg',
    bio: 'Test bio',
    specialties: ['Taille de barbe'],
    workingHours: { monday: { start: '09:00', end: '17:00' } },
  });

  console.log('✅ Barber inserted successfully:', barber);
} catch (err) {
  console.error('❌ Barber insertion failed:', err.message);
  process.exit(1);
}
