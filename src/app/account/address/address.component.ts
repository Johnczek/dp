import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserControllerService} from '../../api/services/user-controller.service';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {AddressDto} from '../../api/models/address-dto';
import {finalize} from 'rxjs/operators';
import {AddressCreationRequest} from '../../api/models/address-creation-request';
import {JwtResponse} from '../../api/models/jwt-response';
import {UserDto} from '../../api/models/user-dto';
import {UserService} from '../../service/user.service';
import {AlertService} from '../../service/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {

  @ViewChild('addressAddFormWrapper')
  addressAddFormWrapper: ElementRef;

  @ViewChild('addressAddFormToggle')
  addressAddFormToggle: ElementRef;

  addresses: Array<AddressDto>;

  addressAddFormSubmitting = false;

  addressAddForm: FormGroup;

  userRetrievalSubscription: Subscription;

  addressAddFormSubscription: Subscription;

  addressDeleteFormSubscription: Subscription;

  constructor(
    public router: Router,
    public alertService: AlertService,
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

        this.addresses = response.body.addresses;

        this.initAddressAddForm();
      });
  }


  ngOnDestroy(): void {

    this.addressAddFormSubscription?.unsubscribe();
    this.addressDeleteFormSubscription?.unsubscribe();
    this.userRetrievalSubscription?.unsubscribe();
  }

  private initAddressAddForm(): void {

    this.addressAddForm = new FormGroup({
      city: new FormControl('', [Validators.required]),
      street: new FormControl(''),
      streetNumber: new FormControl(''),
      zipcode: new FormControl('', [Validators.required]),
    });
  }

  deleteAddress(addressId: number): void {

    if (confirm('Opravdu si přejete smazat adresu s id ' + addressId + '?')) {
      this.userService.deleteAddress(addressId)
        .subscribe(() => {

          this.addresses = this.addresses.filter(address => address.id !== addressId);

          this.alertService.success('Adresa s id: ' + addressId + ' byla úspěšně smazána');
        });
    }
  }

  onAddressAddSubmit(): void {

    this.addressAddFormSubmitting = true;

    const request: AddressCreationRequest = {
      city: this.addressAddForm.get('city').value,
      street: this.addressAddForm.get('street').value,
      streetNumber: this.addressAddForm.get('streetNumber').value,
      zipcode : this.addressAddForm.get('zipcode').value
    };

    this.addressAddFormSubscription = this.userService.addAddress(request)
      .pipe(finalize(() => this.addressAddFormSubmitting = false))
      .subscribe((response: StrictHttpResponse<AddressDto>) => {
        this.alertService.success('Nová adresa byla úspěšně přidána');
        this.addresses.push(response.body);
        this.addressAddForm.reset();
      });
  }

  showAddForm(): void {
    this.addressAddFormToggle?.nativeElement.classList.add('d-none');
    this.addressAddFormWrapper?.nativeElement.classList.remove('d-none');
  }
}
