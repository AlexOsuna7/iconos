import { TestBed } from '@angular/core/testing';

import { IconoService } from './icono.service';

describe('IconoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IconoService = TestBed.get(IconoService);
    expect(service).toBeTruthy();
  });
});
