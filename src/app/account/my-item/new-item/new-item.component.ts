import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../../service/item.service';
import {DeliveryDto} from '../../../api/models/delivery-dto';
import {PaymentDto} from '../../../api/models/payment-dto';
import {ENABLED_IMAGE_FORMATS} from '../../../globals';
import {FileService} from '../../../service/file.service';
import {StrictHttpResponse} from '../../../api/strict-http-response';
import {ItemCreationOptionsResponse} from '../../../api/models/item-creation-options-response';
import {FileUploadResponse} from '../../../api/models/file-upload-response';
import {ItemCreationRequest} from '../../../api/models/item-creation-request';
import {ItemDto} from '../../../api/models/item-dto';
import {AlertService} from '../../../service/alert.service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit, OnDestroy {

  itemCreateForm: FormGroup;

  itemCreateFormSubmitting = false;

  itemImageUploadSubscription: Subscription;

  itemCreateFormSubscription: Subscription;

  pictureBlob: Blob;

  deliveries: Array<DeliveryDto>;

  payments: Array<PaymentDto>;

  allowedExtensions = ENABLED_IMAGE_FORMATS;

  constructor(
    public router: Router,
    public alertService: AlertService,
    public fileService: FileService,
    public itemService: ItemService) {
  }

  ngOnInit(): void {

    this.itemService.getItemCreationOptions()
      .subscribe((response: StrictHttpResponse<ItemCreationOptionsResponse>) => {

        this.deliveries = response.body.deliveries;
        this.payments = response.body.payments;

        this.itemCreateForm = new FormGroup({
          startingPrice: new FormControl('', [Validators.required, Validators.min(1)]),
          name: new FormControl('', [Validators.required]),
          description: new FormControl(''),
          validFrom: new FormControl(this.getCurrentDateInISOFormat(), [Validators.required]),
          validTo: new FormControl([Validators.required]),
          deliveryId: new FormControl('', [Validators.required]),
          paymentId: new FormControl('', [Validators.required]),
          picture: new FormControl(null, [Validators.required]),
        });
      });
  }

  ngOnDestroy(): void {
    this.itemCreateFormSubscription?.unsubscribe();

    this.itemImageUploadSubscription?.unsubscribe();
  }

  onItemCreateFormSubmit(): void {

    this.itemCreateFormSubmitting = true;

    this.itemImageUploadSubscription = this.fileService.uploadFile('ITEM_PICTURE', this.pictureBlob)
      .pipe(
        finalize(() => this.itemCreateFormSubmitting = false)
      )
      .subscribe((response: StrictHttpResponse<FileUploadResponse>) => {

        console.log('response:');
        console.log(response);

        const data: ItemCreationRequest = {
          deliveryId: this.itemCreateForm.get('deliveryId').value,
          paymentId: this.itemCreateForm.get('paymentId').value,
          name: this.itemCreateForm.get('name').value,
          description: this.itemCreateForm.get('description').value,
          startingPrice: this.itemCreateForm.get('startingPrice').value,
          validFrom: this.itemCreateForm.get('validFrom').value,
          validTo: this.itemCreateForm.get('validTo').value,
          pictureUUID: response.body.fileUUID
        };

        this.itemCreateFormSubscription = this.itemService.createItem(data)
          .subscribe((itemResponse: StrictHttpResponse<ItemDto>) => {
            this.alertService.success('Aukce byla úspěšně založena');
            this.router.navigate(['item', itemResponse.body.id]);
          });
      });
  }


  validatePicture(event: any): void {
    this.itemCreateForm.get('picture').setErrors(null);
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (file.size > 2000000) {
          this.itemCreateForm.get('picture').setErrors({badSize: true});
        } else {

          const fileExt = file.name.split('.').pop();
          if (ENABLED_IMAGE_FORMATS.indexOf(fileExt) === -1) {
            this.itemCreateForm.get('picture').setErrors({badExtension: true});
          }
          this.pictureBlob = this.fileService.convertBase64ToBlob(reader.result as string);
        }
      };
    }
  }

  getDateInISOFormat(date: any): string {
    return new Date(date).toISOString().substring(0, 16);
  }

  getCurrentDateInISOFormat(): string {
    return this.getDateInISOFormat(Date.now());
  }
}
