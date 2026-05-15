export type UserRole = 'participant' | 'organizer' | 'admin';

export type StatusEvent = 'draft' | 'published' | 'paused' | 'canceled' | 'finished';

export type PaymentStatus = 'paid' | 'pending' | 'free';

export const EducationLevelTypes = {
    EnsinoMedio: 1,
    Graduacao: 2,
    PosGraduacao: 3,
    Mestrado: 4,
    Doutorado: 5
}as const;

export type EducationLevel = typeof EducationLevelTypes[keyof typeof EducationLevelTypes];