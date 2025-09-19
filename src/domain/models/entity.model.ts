import { Timestamp } from '@angular/fire/firestore';

export interface Entity<T = string> {

	id?: T,
	createdat?: Timestamp,
	updatedat?: Timestamp

}