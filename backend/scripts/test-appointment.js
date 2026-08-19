const Barber = require('../models/barber.model');
const Service = require('../models/service.model');
const Appointment = require('../models/appointment.model');

try {
  const barber = Barber.create({ name: 'Barber For Appt', specialties: [] });
  const service = Service.create({ name: 'Service For Appt', durationMinutes: 30, price: 20 });

  const appt = Appointment.create({
    barberId: barber.id,
    serviceId: service.id,
    date: '2026-10-10',
    time: '11:00',
    clientName: 'Test Client',
    clientPhone: '0102030405',
  });

  console.log('✅ Appointment inserted successfully:', appt);

  // Test unique constraint
  try {
    Appointment.create({
      barberId: barber.id,
      serviceId: service.id,
      date: '2026-10-10',
      time: '11:00',
      clientName: 'Duplicate Client',
      clientPhone: '0600000000',
    });
    console.error('❌ Failed: Duplicate appointment should have thrown unique constraint error!');
    process.exit(1);
  } catch (constraintErr) {
    console.log('✅ Unique constraint correctly prevented double booking:', constraintErr.message);
  }
} catch (err) {
  console.error('❌ Appointment test failed:', err.message);
  process.exit(1);
}
