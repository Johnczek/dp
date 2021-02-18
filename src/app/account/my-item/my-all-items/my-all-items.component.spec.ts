import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAllItemsComponent } from './my-all-items.component';

describe('MyAllItemsComponent', () => {
  let component: MyAllItemsComponent;
  let fixture: ComponentFixture<MyAllItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAllItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAllItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
