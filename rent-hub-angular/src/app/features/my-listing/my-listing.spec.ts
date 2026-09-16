import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListing } from './my-listing';

describe('MyListing', () => {
  let component: MyListing;
  let fixture: ComponentFixture<MyListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyListing],
    }).compileComponents();

    fixture = TestBed.createComponent(MyListing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
