/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

export class AbortedCommandError extends Error {

    private readonly _silent : boolean;

    constructor(silent : boolean = false) {
        super("Command aborted.");
        this._silent = silent;
    }

    get Silent() {
        return this._silent;
    }
}