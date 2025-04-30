import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LighthouseListComponent } from './lighthouse-list.component';

describe('LighthouseListComponent', () => {
  let component: LighthouseListComponent;
  let fixture: ComponentFixture<LighthouseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LighthouseListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LighthouseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
