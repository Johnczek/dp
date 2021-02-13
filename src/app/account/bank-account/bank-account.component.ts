import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BankAccountDto} from '../../api/models/bank-account-dto';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserControllerService} from '../../api/services/user-controller.service';
import {BankAccountCreationRequest} from '../../api/models/bank-account-creation-request';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit, OnDestroy {

  @ViewChild('bankAccountAddFormWrapper')
  bankAccountAddFormWrapper: ElementRef;

  @ViewChild('bankAccountAddFormToggle')
  bankAccountAddFormToggle: ElementRef;

  // TODO dynamically retrieve bank accounts
  bankAccounts: Array<BankAccountDto> = [
    {
      id: 1,
      bankCode: 3030,
      number: 727558021
    },
    {
      id: 2,
      bankCode: 100,
      number: 111333,
      prefix: 100
    },
    {
      id: 3,
      bankCode: 3030,
      number: 10075470
    },
    {
      id: 4,
      bankCode: 3030,
      number: 1000000003,
      prefix: 958
    }
  ];

  bankAccountAddFormSubmitting = false;

  bankAccountAddForm: FormGroup;

  bankAccountAddFormSubscription: Subscription;

  bankAccountDeleteFormSubscription: Subscription;

  constructor(public userControllerService: UserControllerService) {
  }

  ngOnInit(): void {
    this.initBankAccountAddForm();
  }


  ngOnDestroy(): void {

    if (this.bankAccountAddFormSubscription) {
      this.bankAccountAddFormSubscription.unsubscribe();
    }

    if (this.bankAccountDeleteFormSubscription) {
      this.bankAccountDeleteFormSubscription.unsubscribe();
    }
  }

  private initBankAccountAddForm(): void {

    this.bankAccountAddForm = new FormGroup({
      prefix: new FormControl(''),
      number: new FormControl('', [Validators.required]),
      bankCode: new FormControl('', [Validators.required]),
    });

    this.bankAccountAddForm.valueChanges.subscribe(() => {
      console.log(this.bankAccountAddForm);
    });
  }

  // TODO complete delete account
  deleteBankAccount(bankAccountId: number): void {
    console.log(bankAccountId);

    const request = {
      userId: 1,
      bankAccountId
    };

    this.userControllerService.deleteBankAccount$Response(request)
      .subscribe((response: StrictHttpResponse<string>) => {
        console.log(response);
      });

  }

  // TODO complete add account
  onBankAccountAddFormSubmit(): void {

    this.bankAccountAddFormSubmitting = true;

    const request: {
      userId: number;
      body: BankAccountCreationRequest
    } = {
      userId: 1,
      body: {
        bankCode: this.bankAccountAddForm.get('bankCode').value,
        number: this.bankAccountAddForm.get('number').value,
        prefix: this.bankAccountAddForm.get('prefix').value,
      }
    };

    this.bankAccountAddFormSubscription = this.userControllerService.addBankAccount$Response(request)
      .pipe(finalize(() => this.bankAccountAddFormSubmitting = false))
      .subscribe((response: StrictHttpResponse<string>) => {
        console.log(response);
      });
  }

  showAddForm(): void {

    this.bankAccountAddFormToggle?.nativeElement.classList.add('d-none');
    this.bankAccountAddFormWrapper?.nativeElement.classList.remove('d-none');
  }
}
