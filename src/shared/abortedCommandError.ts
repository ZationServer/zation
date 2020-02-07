export class AbortedCommandError extends Error {

    private _silent : boolean;

    constructor(silent : boolean = false) {
        super("Command aborted.");
        this._silent = silent;
    }

    get Silent() {
        return this._silent;
    }
}