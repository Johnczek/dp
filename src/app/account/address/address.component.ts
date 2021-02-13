import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserControllerService} from '../../api/services/user-controller.service';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {AddressDto} from '../../api/models/address-dto';
import {finalize} from 'rxjs/operators';
import {AddressCreationRequest} from '../../api/models/address-creation-request';

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

  // TODO dynamically retrieve addresses
  addresses: Array<AddressDto> = [
    {
      id: 1,
      city: 'Ždánice',
      street: 'Zámecká',
      streetNumber: '875',
      zipCode: '69632',
    },
    {
      id: 2,
      city: 'Ždánice',
      street: 'Městečko',
      streetNumber: '1',
      zipCode: '98237',
    },
    {
      id: 1,
      city: 'Nemotice',
      streetNumber: '82',
      zipCode: '12354',
    },
  ];

  addressAddFormSubmitting = false;

  addressAddForm: FormGroup;

  addressAddFormSubscription: Subscription;

  addressDeleteFormSubscription: Subscription;

  constructor(public userControllerService: UserControllerService) {
  }

  ngOnInit(): void {
    this.initAddressAddForm();
  }


  ngOnDestroy(): void {

    if (this.addressAddFormSubscription) {
      this.addressAddFormSubscription.unsubscribe();
    }

    if (this.addressDeleteFormSubscription) {
      this.addressDeleteFormSubscription.unsubscribe();
    }
  }

  private initAddressAddForm(): void {

    this.addressAddForm = new FormGroup({
      city: new FormControl('', [Validators.required]),
      street: new FormControl(''),
      streetNumber: new FormControl(''),
      zipCode: new FormControl(''),
    });

    this.addressAddForm.valueChanges.subscribe(() => {
      console.log(this.addressAddForm);
    });
  }

  // TODO complete delete address
  deleteAddress(addressId: number): void {
    console.log(addressId);

    const request = {
      userId: 1,
      addressId
    };

    this.userControllerService.deleteAddress$Response(request)
      .subscribe((response: StrictHttpResponse<string>) => {
        console.log(response);
      });

  }

  // TODO complete add address
  onAddressAddSubmit(): void {

    this.addressAddFormSubmitting = true;

    const request: {
      userId: number;
      body: AddressCreationRequest
    } = {
      userId: 1,
      body: {
        city: this.addressAddForm.get('city').value,
        street: this.addressAddForm.get('street').value,
        streetNumber: this.addressAddForm.get('streetNumber').value,
        zipCode: this.addressAddForm.get('zipCode').value
      }
    };

    this.addressAddFormSubscription = this.userControllerService.addAddress$Response(request)
      .pipe(finalize(() => this.addressAddFormSubmitting = false))
      .subscribe((response: StrictHttpResponse<string>) => {
        console.log(response);
      });
  }

  showAddForm(): void {
    this.addressAddFormToggle?.nativeElement.classList.add('d-none');
    this.addressAddFormWrapper?.nativeElement.classList.remove('d-none');
  }
}
