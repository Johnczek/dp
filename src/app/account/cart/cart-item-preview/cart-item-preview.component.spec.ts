import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemPreviewComponent } from './cart-item-preview.component';

describe('CartItemPreviewComponent', () => {
  let component: CartItemPreviewComponent;
  let fixture: ComponentFixture<CartItemPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartItemPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
