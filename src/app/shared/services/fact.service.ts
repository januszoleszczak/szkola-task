import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { config } from '../config';
import { Fact } from '../fact.interface';

@Injectable({
  providedIn: 'root',
})
export class FactService {
  private readonly http = inject(HttpClient);

  apiUrl: string = config.factApiUrl;

  getManyFacts(size: number): Observable<Fact> {
    return this.http.get<Fact>(`${this.apiUrl}?count=${size}`);
  }

  getOneFact(): Observable<Fact> {
    return this.http.get<Fact>(`${this.apiUrl}`);
  }
}
