import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserControllerService} from '../../api/services/user-controller.service';
import {FileControllerService} from '../../api/services/file-controller.service';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {UserChangeRequest} from '../../api/models/user-change-request';
import {UserDto} from '../../api/models/user-dto';
import {finalize} from 'rxjs/operators';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-account-general',
  templateUrl: './account-general.component.html',
  styleUrls: ['./account-general.component.scss']
})
export class AccountGeneralComponent implements OnInit, OnDestroy {

  userEditFormSubmitting = false;

  userEditForm: FormGroup;

  userEditFormSubscription: Subscription;

  avatarFormSubmitting = false;

  avatarChangeForm: FormGroup;

  avatarFormSubscription: Subscription;

  allowedExtensions: string[] = ['jpg', 'png', 'gif'];

  pictureBase64: Blob;

  currentAvatarUrl: string;

  // TODO make this dynamic
  loggedUser: UserDto = {
    addresses: [],
    avatarUUID: 'avatar',
    bankAccounts: [],
    description: 'desc',
    email: 'email@email.com',
    firstName: 'firstname',
    id: 1,
    lastName: 'lastname'
  };

  constructor(
    public userService: UserService,
    public fileControllerService: FileControllerService,
    public userControllerService: UserControllerService) {
  }

  ngOnDestroy(): void {

    if (this.userEditFormSubscription) {
      this.userEditFormSubscription.unsubscribe();
    }

    if (this.avatarFormSubscription) {
      this.avatarFormSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {

    this.initUserAvatarChangeForm();
    this.initUserEditForm();

    this.currentAvatarUrl = this.userService.getLooedPersonAvatarUrl();
  }

  private initUserEditForm(): void {

    this.userEditForm = new FormGroup({
      id: new FormControl({value: this.loggedUser.id, disabled: true}),
      email: new FormControl({value: this.loggedUser.email, disabled: true}),
      firstName: new FormControl(this.loggedUser.firstName, [Validators.required]),
      lastName: new FormControl(this.loggedUser.lastName, [Validators.required]),
      description: new FormControl(this.loggedUser.description)
    });

    this.userEditForm.valueChanges.subscribe(() => {
      console.log(this.userEditForm);
    });
  }

  private initUserAvatarChangeForm(): void {
    this.avatarChangeForm = new FormGroup({
      avatar: new FormControl(null, [Validators.required]),
    });

    this.avatarChangeForm.valueChanges.subscribe(() => {
      console.log(this.avatarChangeForm);
    });
  }

  // TODO implement user edit
  onUserEditSubmit(): void {

    this.userEditFormSubmitting = true;

    const userChangeRequest: UserChangeRequest = {
      firstName: this.userEditForm.get('firstName').value,
      lastName: this.userEditForm.get('lastName').value,
      description: this.userEditForm.get('description').value,
    };

    const params = {
      id: 1,
      body: userChangeRequest
    };

    this.userEditFormSubscription = this.userControllerService.patch$Response(params)
      .pipe(finalize(() => this.userEditFormSubmitting = false))
      .subscribe((response: StrictHttpResponse<string>) => {
        console.log(response);
      });
  }

  // TODO implement user avatar upgrade
  onAvatarChangeSubmit(): void {

    this.avatarFormSubmitting = true;
    console.log(this.pictureBase64);

    this.userService.updateUserAvatar(this.pictureBase64)
      .pipe(finalize(() => this.avatarFormSubmitting = false))
      .subscribe(() => {
          console.log('success');
        },
        () => {
          console.error('error');
        });
  }

  validateAvatar(event: any): void {
    this.avatarChangeForm.get('avatar').setErrors(null);
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (file.size > 2000000) {
          this.avatarChangeForm.get('avatar').setErrors({badSize: true});
        } else {

          const fileExt = file.name.split('.').pop();
          if (this.allowedExtensions.indexOf(fileExt) === -1) {
            this.avatarChangeForm.get('avatar').setErrors({badExtension: true});
          }
          this.pictureBase64 = this.convertBase64ToBlob(reader.result as string);
        }
      };
    }
  }

  // TODO move to special service
  /**
   * Convert BASE64 to BLOB
   * @param base64Image Pass Base64 image data to convert into the BLOB
   */
  private convertBase64ToBlob(base64Image: string): Blob {
    // Split into two parts
    const parts = base64Image.split(';base64,');

    // Hold the content type
    const imageType = parts[0].split(':')[1];

    // Decode Base64 string
    const decodedData = window.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    console.log(imageType);

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }
}
