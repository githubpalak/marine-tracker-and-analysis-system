import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineTrackerHomeComponent } from './marine-tracker-home.component';

describe('MarineTrackerHomeComponent', () => {
  let component: MarineTrackerHomeComponent;
  let fixture: ComponentFixture<MarineTrackerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarineTrackerHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarineTrackerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
