import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inquiries } from './inquiries';

describe('Inquiries', () => {
  let component: Inquiries;
  let fixture: ComponentFixture<Inquiries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inquiries],
    }).compileComponents();

    fixture = TestBed.createComponent(Inquiries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
