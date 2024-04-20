import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, importProvidersFrom, OnInit, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Observable, filter, map, of } from 'rxjs';
import 'zone.js';
import { ApiMockService } from './api-mock.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, CommonModule, FormsModule, ReactiveFormsModule],
  template: `
   <div>
      <h1>Implementation of Block Requests Method</h1>
      <h2>Objective</h2>
      <p>
         It is required to implement the <b>request$</b> method so that it returns a <b>minimum of {{apiMockService.minValidElements}} valid elements</b>. To achieve this result, we have the requestChunk$ method.
      </p>
      <p>
        Once this is done, we want to <b>select one of the valid elements</b> and fetch the details of it, and then display it in a form.
      </p>
      <h3>requestChunk$</h3>
      <ul>
        <li><b>Parameters</b>: It will be passed the <b>from</b> parameter to indicate from which index it should search</li>
        <li><b>Pagination Limit</b>: It can only bring a maximum of {{apiMockService.requestChunkSize}} elements per request</li>
        <li><b>Validity of elements</b>: Invalid elements should be discarded. The returned elements can have 2 forms:</li>
          <ul>
          <li><b>Valid</b>: If the <b>value</b> property is equal to 'valid'.</li>
          <li><b>Invalid</b>: If the <b>value</b> property is equal to null.</li>
        </ul>
      </ul>
     
      <h2>Specific Requirements</h2>
      <ul>
        <li>The order of the elements must be maintained</li>
        <li>Requests should continue to be made until at least {{apiMockService.minValidElements}} valid elements are obtained</li>
        <li>Once selected we have to do another request to fetch the detail by valid index</li>
        <li>Display the date using reactive forms, using form controls, form groups and form array to do so.</li>
      </ul>   
      <h2>Bonus points</h2>   
      <ul>
        <li>Implement recursiveness with RxJs</li>
        <li>Usage of any store lib (can be installed any prefered)</li>
    </ul>
    </div>
    <h2>Final Result</h2>

    <div  (click)="fetchItem(item.index)" *ngFor="let item of result$ | async; let i = index">[{{0 + 1}}] {{item | json}}</div>
    <div *ngIf="itemDetails" [formGroup]="chunk">
    <input  formControlName="name"/>
    <div formGroupName="address">
    <input formControlName="street" />
    </div>
    <div formArrayName="projects"></div>
   
    </div>

  `,
})
export class App implements OnInit {
  result$?: Observable<any>;
  itemDetails: any;
  chunk!: FormGroup;

  apiMockService = inject(ApiMockService);
  fb = inject(FormBuilder);

  ngOnInit() {
    this.result$ = this.request$();

    this.chunk = new FormGroup({
      name: new FormControl(''),
      address: new FormGroup({
        street: new FormControl(''),
      }),
      projects: new FormArray([]),
    });
  }

  request$() {
    return this.requestChunk$(0).pipe(
      map((resArr) => {
        return resArr.filter((item: any) => item.value === 'valid');
      })
    );
  }

  fetchItem(index: number) {
    console.log(index, 'ind');
    this.apiMockService.requestDetail$(index).subscribe((data) => {
      console.log(data);
      this.itemDetails = data;
      this.chunk.patchValue(this.itemDetails);
    });
  }

  private requestChunk$(pageIndex: number) {
    return this.apiMockService.requestChunk$({
      from: pageIndex * this.apiMockService.requestChunkSize,
      count: this.apiMockService.requestChunkSize,
    });
  }
}

bootstrapApplication(App, {
  providers: [ApiMockService, importProvidersFrom(HttpClientModule)],
});
