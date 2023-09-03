import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  currentFile?: File;
  progress = 0;
  progressBarClass = '';
  feedbackClass = '';
  feedbackColor = '';
  feedbackMessage = '';

  fileName = 'Select File';
  fileInfos?: Observable<any>;

  constructor(private uploadService: UploadService) {}

  hideProgressBar(): void {
    this.progressBarClass = 'progress-bar hide';
  }

  showProgressBar(): void {
    this.progressBarClass = 'progress-bar';
  }

  hideFeedback(): void {
    this.feedbackClass = 'feedback hide';
  }

  showSuccessFeedback(): void {
    this.feedbackMessage = 'File uploaded successfully';
    this.feedbackClass = 'feedback';
    this.feedbackColor = 'green';
  }

  showErrorFeedback(): void {
    this.feedbackClass = 'feedback';
    this.feedbackColor = 'red';
  }

  ngOnInit(): void {
    this.hideProgressBar();
    this.hideFeedback();
  }

  fileSelected(event: any): void {

    if (event?.target?.files[0]) {

      const file: File = event.target.files[0];
      this.currentFile = file;

      let name = this.currentFile.name;

      if (name.length > 30) {
        name = name.substring(0, 27).concat('...');
      }

      this.fileName = name;

    } else {
      this.fileName = 'Select File';
    }

    this.progress = 0;
    this.hideFeedback();
    this.showProgressBar();
  }

  upload(): void {

    this.progress = 0;
    this.feedbackMessage = '';

    if (this.currentFile) {
      this.uploadService.upload(this.currentFile).subscribe({
        next: (event: any) => {

          if (event.type === HttpEventType.UploadProgress) {

            this.progress = Math.round(100 * event.loaded / event.total);

          } else if (event.type === HttpEventType.Response) {

            this.hideProgressBar();
            this.showSuccessFeedback();
          }
        },
        error: (err: any) => {

          this.progress = 0;
          this.showErrorFeedback();

          if (err?.error?.message && (err?.status === 400 || err?.status === 422)) {
            this.feedbackMessage = err.error.message;
          } else {
            this.feedbackMessage = 'Error to upload the file!';
          }

          this.currentFile = undefined;
        }
      })

    }
  }

}
