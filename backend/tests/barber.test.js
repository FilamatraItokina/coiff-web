const Barber = require('../models/barber.model');

describe('Barber Model', () => {
  test('creates and retrieves a barber successfully', () => {
    const barberData = {
      name: 'Jean Barbier',
      email: 'jean.barbier@example.com',
      photoUrl: 'https://example.com/jean.jpg',
      bio: 'Spécialiste dégradé et taille de barbe',
      specialties: ['Dégradé', 'Taille de barbe'],
      workingHours: {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
      },
    };

    const created = Barber.create(barberData);
    expect(created).not.toBeNull();
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Jean Barbier');
    expect(created.specialties).toEqual(['Dégradé', 'Taille de barbe']);
    expect(created.workingHours.monday).toEqual({ start: '09:00', end: '18:00' });

    const found = Barber.findById(created.id);
    expect(found).toEqual(created);
  });
});
