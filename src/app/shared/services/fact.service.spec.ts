import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FactService } from './fact.service';
import { Fact } from '../fact.interface';
import { config } from '../config';

describe('FactService', () => {
    let service: FactService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [FactService]
        });
        service = TestBed.inject(FactService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch one fact', () => {
        const dummyFact: Fact = { data: ['Fact 1'] };

        service.getOneFact().subscribe(fact => {
            expect(fact).toEqual(dummyFact);
        });

        const req = httpMock.expectOne(config.factApiUrl);
        expect(req.request.method).toBe('GET');
        req.flush(dummyFact);
    });
});
