import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountGeneralComponent } from './account-general.component';

describe('AccountGeneralComponent', () => {
  let component: AccountGeneralComponent;
  let fixture: ComponentFixture<AccountGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
