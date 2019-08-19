import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell.component';

fdescribe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('line 7, column 8', () => {
    component.cellNumber = 86;
    expect(component.relativeX).toBe(8);
    expect(component.relativeY).toBe(7);
  });

  it('line 1, column 1', () => {
    component.cellNumber = 1;
    expect(component.relativeX).toBe(1);
    expect(component.relativeY).toBe(1);
  });

  it('line 1, column 13', () => {
    component.cellNumber = 13;
    expect(component.relativeX).toBe(13);
    expect(component.relativeY).toBe(1);
  });

  it('line 14, column 1', () => {
    component.cellNumber = 170;
    expect(component.relativeX).toBe(1);
    expect(component.relativeY).toBe(14);
  });

  it('line 14, column 13', () => {
    component.cellNumber = 182;
    expect(component.relativeX).toBe(13);
    expect(component.relativeY).toBe(14);
  });
});
