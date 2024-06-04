import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartographieComponent } from './cartographie.component';

describe('CartographieComponent', () => {
  let component: CartographieComponent;
  let fixture: ComponentFixture<CartographieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartographieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartographieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
