const Barber = require('../models/barber.model');
const Service = require('../models/service.model');
const Appointment = require('../models/appointment.model');

describe('Appointment Model', () => {
  let barber;
  let service;

  beforeAll(() => {
    barber = Barber.create({
      name: 'Marc',
      specialties: ['Coupe'],
    });

    service = Service.create({
      name: 'Coupe simple',
      durationMinutes: 30,
      price: 20.0,
    });
  });

  test('creates an appointment successfully', () => {
    const apptData = {
      barberId: barber.id,
      serviceId: service.id,
      date: '2026-09-01',
      time: '10:00',
      clientName: 'Alice Dupont',
      clientPhone: '0612345678',
      status: 'confirmed',
    };

    const created = Appointment.create(apptData);
    expect(created).not.toBeNull();
    expect(created.id).toBeDefined();
    expect(created.barberId).toBe(barber.id);
    expect(created.date).toBe('2026-09-01');
    expect(created.time).toBe('10:00');
  });

  test('prevents double booking on (barberId, date, time)', () => {
    const apptData = {
      barberId: barber.id,
      serviceId: service.id,
      date: '2026-09-01',
      time: '14:00',
      clientName: 'Bob',
      clientPhone: '0699887766',
    };

    Appointment.create(apptData);

    // Attempting to create duplicate appointment for same barber, date, and time
    expect(() => {
      Appointment.create({
        ...apptData,
        clientName: 'Charlie',
      });
    }).toThrow();
  });
});
