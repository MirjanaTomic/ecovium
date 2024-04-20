import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class ApiMockService {
  requestChunkSize = 8;
  minValidElements = 10;
  constructor(private httpClient: HttpClient) {}
  requestChunk$(
    params: RequestParams
  ): Observable<(FinalElement | RequestNeededElement)[]> {
    return this.httpClient
      .get('assets/list.json')
      .pipe(
        map((list) =>
          (<RequestListResponse>list).elements.slice(
            params.from,
            params.from + params.count
          )
        )
      );
  }

  requestDetail$(index: number): Observable<DetailElement | null> {
    return this.httpClient.get('assets/list-detail.json').pipe(
      map((list) => {
        const foundDetail = (list as Array<DetailElement>).find(
          (entry: DetailElement) => entry.index == index
        );
        return foundDetail as DetailElement | null;
      })
    );
  }
}

export interface RequestParams {
  from: number;
  count: number;
}

export interface RequestListResponse {
  elements: Array<FinalElement | RequestNeededElement>;
}

export interface FinalElement {
  index: number;
  value?: string;
}

export interface RequestNeededElement {
  index: number;
  requestUrl: string;
  afterRequestValue?: string;
}

export interface Address {
  street: string;
  zip: string;
}

export interface Project {
  name: string;
  status: string;
}

export interface DetailElement {
  index: number;
  name: string;
  age: number;
  city: string;
  occupation: string;
  address: Address;
  projects: Project[];
}
