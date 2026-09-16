import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApartment } from './create-apartment';

describe('CreateApartment', () => {
  let component: CreateApartment;
  let fixture: ComponentFixture<CreateApartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApartment],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateApartment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
