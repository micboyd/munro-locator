export class CompletedMunro {
    munroId: string;
    dateCompleted?: Date;
    notes?: string;
    rating?: number;
    summitImage?: string;

    constructor(init?: Partial<CompletedMunro>) {
        Object.assign(this, init);
    }
}
