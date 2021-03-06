import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FlightsService } from './flights.service';
import { Flight } from './flight.model';
import 'rxjs/Rx';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { StatusService } from './status.service';

@Injectable()
export class DataStorageServiceGet {
    constructor(
        private http: Http,
        private flightsService: FlightsService,
        private statusService: StatusService
        ) {}

    getFlights(tk, uid) {
        this.statusService.spin();
        this.http.get('https://renas-flights.firebaseio.com/flights_' + uid + '.json?auth=' + tk)
        .map(
            (response: Response) => {
                this.statusService.stopSpin();
                const flights: Flight[] = response.json();
                if (flights) {
                    for (let flight of flights) {
                        if (!flight['date']) {
                            flight['date'] = undefined;
                        } else {
                            flight['date'] = moment(flight['date']);
                        }
                        if (!flight['ff']) {
                            flight['ff'] = undefined;
                        } else {
                            flight['ff'] = moment(flight['ff']);
                        }
                        if (!flight['age']) {
                            flight['age'] = undefined;
                        } else {
                            flight['age'] = moment.duration(flight['age']);
                        }
                    }
                }
                return flights;
            }
        )
        .catch((error: any) => {
            this.statusService.stopSpin();
            console.log('this is error');
            console.log(error);
            this.statusService.setErrorMessage('Can not download database, please check internet connection and refresh the app');
            return Observable.throw(error);
        })
        .subscribe(
            (flights: Flight[]) => {
                if (flights) {
                    this.flightsService.setFlights(flights);
                    console.log(this.flightsService.getFlights());
                }
            }
        );
    }

}
