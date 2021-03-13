import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BankAccountDto} from '../../api/models/bank-account-dto';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserControllerService} from '../../api/services/user-controller.service';
import {BankAccountCreationRequest} from '../../api/models/bank-account-creation-request';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {finalize} from 'rxjs/operators';
import {UserService} from '../../service/user.service';
import {JwtResponse} from '../../api/models/jwt-response';
import {Router} from '@angular/router';
import {UserDto} from '../../api/models/user-dto';
import {AlertService} from '../../service/alert.service';

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

  bankAccounts: Array<BankAccountDto>;

  bankAccountAddFormSubmitting = false;

  bankAccountAddForm: FormGroup;

  bankAccountAddFormSubscription: Subscription;

  bankAccountDeleteFormSubscription: Subscription;

  userRetrievalSubscription: Subscription;

  constructor(
    public alertService: AlertService,
    public router: Router,
    public userService: UserService,
    public userControllerService: UserControllerService) {
  }

  ngOnInit(): void {

    const loggedUser: JwtResponse = this.userService.getLoggedUser();
    if (loggedUser == null) {
      this.router.navigate(['/']);
    }

    this.userRetrievalSubscription = this.userService.getUserById(loggedUser.id)
      .subscribe((response: StrictHttpResponse<UserDto>) => {

        this.bankAccounts = response.body.bankAccounts;

        this.initBankAccountAddForm();
      });
  }


  ngOnDestroy(): void {

    this.bankAccountAddFormSubscription?.unsubscribe();
    this.bankAccountDeleteFormSubscription?.unsubscribe();
    this.userRetrievalSubscription?.unsubscribe();
  }

  private initBankAccountAddForm(): void {

    this.bankAccountAddForm = new FormGroup({
      prefix: new FormControl(''),
      number: new FormControl('', [Validators.required]),
      bankCode: new FormControl('', [Validators.required]),
    });
  }

  deleteBankAccount(bankAccountId: number): void {

    if (confirm('Opravdu si přejete smazat bankovní účet s id ' + bankAccountId + '?')) {
      this.userService.deleteBankAccount(bankAccountId)
        .subscribe(() => {

          this.bankAccounts = this.bankAccounts.filter(bankAccount => bankAccount.id !== bankAccountId);

          this.alertService.success('Bankovní účet s id: ' + bankAccountId + ' byl úspěšně smazán');
        });
    }
  }

  onBankAccountAddFormSubmit(): void {

    this.bankAccountAddFormSubmitting = true;

    const request: BankAccountCreationRequest = {
      bankCode: this.bankAccountAddForm.get('bankCode').value,
      number: this.bankAccountAddForm.get('number').value,
      prefix: this.bankAccountAddForm.get('prefix').value,
    };

    this.bankAccountAddFormSubscription = this.userService.addBankAccount(request)
      .pipe(finalize(() => this.bankAccountAddFormSubmitting = false))
      .subscribe((response: StrictHttpResponse<BankAccountDto>) => {
        this.alertService.success('Nový účet byl úspěšně přidán');
        this.bankAccounts.push(response.body);
        this.bankAccountAddForm.reset();
      });
  }

  showAddForm(): void {

    this.bankAccountAddFormToggle?.nativeElement.classList.add('d-none');
    this.bankAccountAddFormWrapper?.nativeElement.classList.remove('d-none');
  }
}
