import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyItemEditComponent } from './my-item-edit.component';

describe('MyItemEditComponent', () => {
  let component: MyItemEditComponent;
  let fixture: ComponentFixture<MyItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyItemEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
