import {
  CdkScrollable,
  CdkVirtualScrollViewport,
  ScrollDispatcher,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  HostListener,
  inject,
  OnDestroy,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  catchError,
  filter,
  Observable,
  retry,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { config } from '../../shared/config';
import { FactService } from '../../shared/services/fact.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-facts',
  templateUrl: './facts.component.html',
  styleUrls: ['./facts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactsComponent implements OnDestroy {
  private readonly factService = inject(FactService);
  private readonly scrollDispatcher = inject(ScrollDispatcher);
  private readonly authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const height = window.innerHeight;
    const initialFacts = Math.ceil(height / this.itemSize);
    this.initialFacts$.set(initialFacts);
  }

  constructor() {
    this.getScreenSize();
  }

  ngOnDestroy(): void {
    this.authService.logout();
  }

  itemSize = config.itemSize;
  initialFacts$: WritableSignal<number> = signal(0);
  scrolled$: Subject<void> = new Subject<void>();
  facts$: WritableSignal<string[]> = signal([]);
  loading$: WritableSignal<boolean> = signal(false);
  stopFetching$: Subject<void> = new Subject<void>();
  hasEnded$:WritableSignal<boolean> = signal(false);

  fetchInitialFacts$ = effect(
    () => {
      const initialFacts = this.initialFacts$()
      this.factService.getManyFacts(initialFacts).
      pipe(tap(({ data }: { data: string[] }) => this.updateFacts(data))).subscribe()
    }
  )

  scrollDispatcher$: Observable<CdkScrollable | void> = this.scrollDispatcher
    .scrolled()
    .pipe(
      filter(() => {
        return (
          this.virtualScroll.measureScrollOffset('bottom') <
          config.virtualScrollOffset
        );
      }),
      tap(() => this.setLoading(true)),
      takeUntil(this.stopFetching$)
    );

  fetchFact$: Observable<unknown> = this.scrollDispatcher$.pipe(
    tap(() => this.setLoading(true)),
    switchMap(() =>
      this.factService.getOneFact().pipe(
        tap(({ data }: { data: string[] }) => {
          this.checkFactExistence(data[0]);
          this.updateFacts(data);
        }),
        retry(config.fetchFactRetries),
        tap(() => this.setLoading(false)),
        catchError((error: any) => this.handleError(error))
      )
    )
  );

  private setLoading(value: boolean): void {
    this.loading$.set(value);
    this.cdr.detectChanges();
  }

  private checkFactExistence(fact: string): void {
    const exists = this.facts$().includes(fact);
    if (exists) {
      throw new Error('Fact already exists in array');
    }
  }

  private handleError(error: any) {
    this.stopFetching$.next();
    this.hasEnded$.set(true);
    this.setLoading(false);
    return error;
  }

  private updateFacts(value: string[]): void {
    this.facts$.set([...this.facts$(), ...value]);
    this.cdr.detectChanges();
  }
}
