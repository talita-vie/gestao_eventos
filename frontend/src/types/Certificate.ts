import type { Registration } from "./Registration";

export interface Certificate {
    id: number;
    registration_id: number;
    validation_code: string;
    event_title_snapshot: string;
    event_start_date_snapshot: string;
    event_end_date_snapshot: string;
    event_hours_snapshot: string;
    participant_name_snapshot: string;
    issue_date: string;

    registration?: Registration;
}