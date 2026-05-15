import type { PaymentStatus } from './enums'
import type { User } from './User';
import type { Event } from './Event';

export interface Registration {
    id: number;
    user_id: number;
    event_id: number;
    status_checkin: boolean;
    payment_status: PaymentStatus;

    event?: Event;
    user?: User;
}