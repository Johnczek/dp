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
import {FileService} from '../../service/file.service';
import {JwtResponse} from '../../api/models/jwt-response';
import {ENABLED_IMAGE_FORMATS} from '../../globals';

@Component({
  selector: 'app-account-general',
  templateUrl: './account-general.component.html',
  styleUrls: ['./account-general.component.scss']
})
export class AccountGeneralComponent implements OnInit, OnDestroy {

  userEditFormSubmitting = false;

  pictureBase64: Blob;

  currentAvatarUrl: string;

  avatarFormSubmitting = false;

  userEditForm: FormGroup;

  avatarChangeForm: FormGroup;

  userEditFormSubscription: Subscription;

  userChangeSubscription: Subscription;

  avatarFormSubscription: Subscription;

  user: UserDto;

  allowedExtensions = ENABLED_IMAGE_FORMATS;

  constructor(
    public fileService: FileService,
    public userService: UserService,
    public fileControllerService: FileControllerService,
    public userControllerService: UserControllerService) {
  }

  ngOnDestroy(): void {

    this.userEditFormSubscription?.unsubscribe();
    this.avatarFormSubscription?.unsubscribe();
    this.userChangeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.initForms();
  }

  detectChanges(): void {
    this.userChangeSubscription = this.userService.userChangeSubject
      .subscribe((data: JwtResponse) => {
        if (data != null) {
          this.user.id = data.id;
          this.user.email = data.email;
          this.user.avatarUUID = data.avatarUUID;
          this.user.firstName = data.firstName;
          this.user.lastName = data.lastName;

          this.getCurrentAvatar();
        }
      });
  }

  private getCurrentAvatar(): void {
    this.currentAvatarUrl = this.fileService.getAvatarByUUIDOrDefault(this.user.avatarUUID);
  }

  private initForms(): void {

    const loggedUser: JwtResponse = this.userService.getLoggedUser();
    if (loggedUser == null) {
      throw new Error('Nemáte právo zobrazit editační stránku uživatele');
    }

    this.userService.getUserById(loggedUser.id).subscribe((response: StrictHttpResponse<UserDto>) => {
      // TODO handle not found

      this.user = response.body;

      this.getCurrentAvatar();

      this.avatarChangeForm = new FormGroup({
        avatar: new FormControl(null, [Validators.required]),
      });

      this.userEditForm = new FormGroup({
        id: new FormControl({value: this.user.id, disabled: true}),
        email: new FormControl({value: this.user.email, disabled: true}),
        firstName: new FormControl(this.user.firstName, [Validators.required]),
        lastName: new FormControl(this.user.lastName, [Validators.required]),
        description: new FormControl(this.user.description)
      });
    });
  }

  // TODO implement user edit
  onUserEditSubmit(): void {

    const loggedUser: JwtResponse = this.userService.getLoggedUser();
    if (loggedUser == null) {
      throw new Error('Nemáte právo editovat uživatele');
    }

    this.userEditFormSubmitting = true;

    const userChangeRequest: UserChangeRequest = {
      firstName: this.userEditForm.get('firstName').value,
      lastName: this.userEditForm.get('lastName').value,
      description: this.userEditForm.get('description').value,
    };

    const params = {
      id: loggedUser.id,
      body: userChangeRequest
    };

    this.userEditFormSubscription = this.userService.editUser(params)
      .pipe(finalize(() => this.userEditFormSubmitting = false))
      .subscribe((response: StrictHttpResponse<string>) => {

        // TODO handle not found

        this.userService.refreshLoggedUserData();
      });
  }

  // TODO implement user avatar upgrade
  onAvatarChangeSubmit(): void {

    this.avatarFormSubmitting = true;

    this.userService.updateUserAvatar(this.pictureBase64)
      .pipe(finalize(() => {
          this.avatarFormSubmitting = false;
        }
      ))
      .subscribe((response) => {

          // TODO handle error

          this.currentAvatarUrl = this.fileService.getFileUrlByUUID(response);
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
          if (ENABLED_IMAGE_FORMATS.indexOf(fileExt) === -1) {
            this.avatarChangeForm.get('avatar').setErrors({badExtension: true});
          }
          this.pictureBase64 = this.fileService.convertBase64ToBlob(reader.result as string);
        }
      };
    }
  }
}
