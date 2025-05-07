import { TestBed } from '@angular/core/testing';

import { LocalStorageCacheServiceService } from './local-storage-cache-service.service';

describe('LocalStorageCacheServiceService', () => {
  let service: LocalStorageCacheServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageCacheServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
