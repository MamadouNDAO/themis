import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataActuComponent } from './data-actu.component';

describe('DataActuComponent', () => {
  let component: DataActuComponent;
  let fixture: ComponentFixture<DataActuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataActuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataActuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
