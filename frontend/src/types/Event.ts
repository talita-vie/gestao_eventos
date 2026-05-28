import type { Category } from "./Category";
import type { User } from "./User";
import type { Address } from "./Address";
import type { StatusEvent } from "./enums";

export interface Event {
    id: number;
    name: string;
    description: string;
    banner_path: string;
    start_date_time: string;
    end_date_time: string;
    category_id: number;
    registration_deadline: string;
    speaker: string;
    capacity: number;
    hours: number;
    price: string;
    status: StatusEvent;
    published_at: string;
    is_external: boolean;
    references_id: number;
    organizer_id: number;
    address_id: number;
    registration_id: number;
    is_subscribed: boolean;
    available_vacancies: number;
    deleted_at: string;

    category?: Category;
    reference?: Event;
    user?: User;
    address?: Address;
}