const Service = require('../models/service.model');

describe('Service Model', () => {
  test('creates and retrieves a service successfully', () => {
    const serviceData = {
      name: 'Coupe + Barbe',
      description: 'Coupe classique et taille de barbe avec serviette chaude',
      durationMinutes: 45,
      price: 35.0,
    };

    const created = Service.create(serviceData);
    expect(created).not.toBeNull();
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Coupe + Barbe');
    expect(created.durationMinutes).toBe(45);
    expect(created.price).toBe(35.0);

    const found = Service.findById(created.id);
    expect(found).toEqual(created);
  });
});
