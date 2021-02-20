import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemDto} from '../../../api/models/item-dto';
import {FileService} from '../../../service/file.service';
import {ItemService} from '../../../service/item.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DeliveryDto} from '../../../api/models/delivery-dto';
import {PaymentDto} from '../../../api/models/payment-dto';
import {StrictHttpResponse} from '../../../api/strict-http-response';
import {ItemEditOptionsResponse} from '../../../api/models/item-edit-options-response';
import {AlertService} from '../../../service/alert.service';
import {ENABLED_IMAGE_FORMATS} from '../../../globals';

@Component({
  selector: 'app-my-item-edit',
  templateUrl: './my-item-edit.component.html',
  styleUrls: ['./my-item-edit.component.scss']
})
export class MyItemEditComponent implements OnInit, OnDestroy {

  itemPictureEditForm: FormGroup;

  itemGeneralEditForm: FormGroup;

  itemDeliveryChangeForm: FormGroup;

  itemPaymentChangeForm: FormGroup;

  itemPictureFormSubmitting = false;

  itemGeneralEditFormSubmitting = false;

  itemDeliveryChangeFormSubmitting = false;

  itemPaymentChangeFormSubmitting = false;

  itemPictureUpdateSubscription: Subscription;

  itemGeneralChangeSubscription: Subscription;

  itemDeliveryChangeSubscription: Subscription;

  itemPaymentChangeSubscription: Subscription;

  item: ItemDto;

  itemId: number;

  deliveries: Array<DeliveryDto>;

  payments: Array<PaymentDto>;

  allowedExtensions = ENABLED_IMAGE_FORMATS;

  constructor(
    public alertService: AlertService,
    public itemService: ItemService,
    public fileService: FileService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
  }

  ngOnInit(): void {
    this.initForms();
  }

  ngOnDestroy(): void {

    this.itemPictureUpdateSubscription?.unsubscribe();

    this.itemGeneralChangeSubscription?.unsubscribe();

    this.itemDeliveryChangeSubscription?.unsubscribe();

    this.itemPaymentChangeSubscription?.unsubscribe();
  }

  private initForms(): void {

    this.activatedRoute.paramMap.subscribe(() => {
      this.itemId = this.activatedRoute.snapshot.params.id;

      this.itemService.getItemByIdForEdit(this.itemId)
        .subscribe((response: StrictHttpResponse<ItemEditOptionsResponse>) => {
        this.item = response.body.item;
        this.deliveries = response.body.deliveries;
        this.payments = response.body.payments;

        this.initPictureChangeForm();
        this.initGeneralEditForm();
        this.initPaymentChangeForm();
        this.initDeliveryChangeForm();
      });
    });
  }

  initPictureChangeForm(): void {
    this.itemPictureEditForm = new FormGroup({
      picture: new FormControl(null, [Validators.required]),
    });
  }

  initGeneralEditForm(): void {
    this.itemGeneralEditForm = new FormGroup({
      id: new FormControl({value: this.item.id, disabled: true}),
      state: new FormControl({value: this.itemService.translateItemState(this.item.state), disabled: true}),
      startingPrice: new FormControl({value: this.item.startingPrice, disabled: true}),
      name: new FormControl(this.item.name, [Validators.required]),
      description: new FormControl(this.item.description),
      validFrom: new FormControl(this.getDateInISOFormat(this.item.validFrom), [Validators.required]),
      validTo: new FormControl(this.getDateInISOFormat(this.item.validTo), [Validators.required]),
    });
  }

  initPaymentChangeForm(): void {
    this.itemPaymentChangeForm = new FormGroup({
      id: new FormControl({value: this.item.payment.id}, [Validators.required]),
    });
  }

  initDeliveryChangeForm(): void {
    this.itemDeliveryChangeForm = new FormGroup({
      id: new FormControl({value: this.item.delivery.id}, [Validators.required]),
    });
  }

  onItemPictureEditSubmit(): void {

  }

  validatePicture($event: Event): void {

  }

  cancelItem(): void {
    if (confirm('Opravdu si přejete zrušit tuto aukci?')) {
      this.itemService.cancelItem(this.item.id).subscribe(() => {
        this.alertService.success('Nabídka byla úspěšně zrušena');
        this.item.state = 'CANCELLED';
        this.itemGeneralEditForm.patchValue({state: this.itemService.translateItemState(this.item.state)});
      });
    }
  }

  onItemGeneralFormSubmit(): void {

  }

  onItemDeliveryChangeFormSubmit(): void {
    this.itemService.changeItemDelivery(this.item.id, this.itemDeliveryChangeForm.get('id').value)
      .subscribe(() => {
        this.alertService.success('Metoda dopravy byla úspěšně změněna');
      });
  }

  onItemPaymentChangeFormSubmit(): void {
    this.itemService.changeItemPayment(this.item.id, this.itemPaymentChangeForm.get('id').value)
      .subscribe(() => {
        this.alertService.success('Metoda platby byla úspěšně změněna');
      });
  }

  getDateInISOFormat(date: any): string {
    return new Date(date).toISOString().substring(0, 16);
  }

  getCurrentDateInISOFormat(): string {
    return this.getDateInISOFormat(Date.now());
  }

}
