const Service = require('../models/service.model');

try {
  const service = Service.create({
    name: 'Service Test',
    description: 'Description test',
    durationMinutes: 30,
    price: 25.0,
  });

  console.log('✅ Service inserted successfully:', service);
} catch (err) {
  console.error('❌ Service insertion failed:', err.message);
  process.exit(1);
}
