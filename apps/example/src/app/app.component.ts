import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, map, startWith } from 'rxjs/operators';

interface State {
  loading: boolean;
  imageUrl?: string;
  altText?: string;
  error?: Error | HttpErrorResponse;
}

interface Data {
  img: string;
  alt: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private client: HttpClient) {}

  readonly state$: Observable<State> = this.client
    .get<Data>('https://xkcd.com/123/info.0.json')
    .pipe(
      map((response) => ({
        loading: false,
        imageUrl: response.img,
        altText: response.alt,
      })),
      catchError((error) =>
        of({
          loading: false,
          error,
        })
      ),
      delay(1000),
      startWith({
        loading: true,
      })
    );
}
