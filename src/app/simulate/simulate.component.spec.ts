import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateComponent } from './simulate.component';

fdescribe('SimulateComponent', () => {
  let component: SimulateComponent;
  let fixture: ComponentFixture<SimulateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is between', () => {
    expect(component.isBetween(5, 4, 9)).toBeTruthy();
  });

  it('is not between', () => {
    expect(component.isBetween(3, 4, 9)).toBeFalsy();
  });

  it('is pushed between', () => {
    expect(component.isBetween(3, 9, 1)).toBeTruthy();
  });

  it('is boundary between 1', () => {
    expect(component.isBetween(9, 9, 1)).toBeTruthy();
  });

  it('is boundary between 2', () => {
    expect(component.isBetween(1, 9, 1)).toBeTruthy();
  });
});
