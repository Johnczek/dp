import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {Observable} from 'rxjs';
import {StrictHttpResponse} from '../api/strict-http-response';
import {FileControllerService} from '../api/services/file-controller.service';
import {FileUploadResponse} from '../api/models/file-upload-response';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    public fileControllerService: FileControllerService
  ) { }

  getFileUrlByUUID(uuid: string): string {
    return environment.API_IMAGE_URL + uuid;
  }

  getAvatarByUUIDOrDefault(uuid: string): string {
    if (uuid == null) {
      return 'https://dummyimage.com/200x200/19a846/fff&text=A';
    }

    return this.getFileUrlByUUID(uuid);
  }

  uploadFile(fileType: 'USER_AVATAR' | 'UNKNOWN' | 'DELIVERY_LOGO' | 'PAYMENT_LOGO' | 'ITEM_PICTURE', file: Blob): Observable<StrictHttpResponse<FileUploadResponse>> {
    return this.fileControllerService.uploadFile$Response({
      fileType,
      body: {
        file,
      },
    });
  }

  /**
   * Convert BASE64 to BLOB
   *
   * @param base64Data Pass Base64 image data to convert into the BLOB
   * @return Blob from given base64 data
   */
  convertBase64ToBlob(base64Data: string): Blob {
    // Split into two parts
    const parts = base64Data.split(';base64,');

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

    // Return BLOB image after conversion
    return new Blob([uInt8Array], {type: imageType});
  }
}
