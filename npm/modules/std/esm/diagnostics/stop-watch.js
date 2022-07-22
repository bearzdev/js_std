var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _StopWatchSpan_spanName, _StopWatchSpan_percentage, _StopWatchSpan_duration, _StopWatchSpan_startTime, _StopWatchSpan_endTime, _StopWatchSpan_index, _StopWatch_id, _StopWatch_runningSpanName, _StopWatch_startedAt, _StopWatch_totalDuration, _StopWatch_tasks;
export class StopWatchSpan {
    constructor(spanName, startTime, endTime, index) {
        _StopWatchSpan_spanName.set(this, void 0);
        _StopWatchSpan_percentage.set(this, void 0);
        _StopWatchSpan_duration.set(this, void 0);
        _StopWatchSpan_startTime.set(this, void 0);
        _StopWatchSpan_endTime.set(this, void 0);
        _StopWatchSpan_index.set(this, void 0);
        __classPrivateFieldSet(this, _StopWatchSpan_spanName, spanName, "f");
        __classPrivateFieldSet(this, _StopWatchSpan_index, index, "f");
        __classPrivateFieldSet(this, _StopWatchSpan_startTime, startTime, "f");
        __classPrivateFieldSet(this, _StopWatchSpan_endTime, endTime, "f");
        __classPrivateFieldSet(this, _StopWatchSpan_duration, endTime.getTime() - startTime.getTime(), "f");
    }
    get startTime() {
        return __classPrivateFieldGet(this, _StopWatchSpan_startTime, "f");
    }
    get endTime() {
        return __classPrivateFieldGet(this, _StopWatchSpan_endTime, "f");
    }
    get spanName() {
        return __classPrivateFieldGet(this, _StopWatchSpan_spanName, "f");
    }
    get duration() {
        return __classPrivateFieldGet(this, _StopWatchSpan_duration, "f");
    }
    get percentage() {
        return __classPrivateFieldGet(this, _StopWatchSpan_percentage, "f");
    }
    calculatePercentage(totalDuration) {
        __classPrivateFieldSet(this, _StopWatchSpan_percentage, (__classPrivateFieldGet(this, _StopWatchSpan_duration, "f") * 100 / totalDuration).toFixed(2), "f");
        return __classPrivateFieldGet(this, _StopWatchSpan_percentage, "f");
    }
}
_StopWatchSpan_spanName = new WeakMap(), _StopWatchSpan_percentage = new WeakMap(), _StopWatchSpan_duration = new WeakMap(), _StopWatchSpan_startTime = new WeakMap(), _StopWatchSpan_endTime = new WeakMap(), _StopWatchSpan_index = new WeakMap();
export function utcNow() {
    const now = new Date();
    const utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    return utc;
}
export class StopWatch {
    constructor(id = '') {
        _StopWatch_id.set(this, void 0);
        _StopWatch_runningSpanName.set(this, null);
        _StopWatch_startedAt.set(this, void 0);
        _StopWatch_totalDuration.set(this, 0);
        _StopWatch_tasks.set(this, void 0);
        __classPrivateFieldSet(this, _StopWatch_id, id, "f");
        __classPrivateFieldSet(this, _StopWatch_tasks, [], "f");
    }
    get id() {
        return __classPrivateFieldGet(this, _StopWatch_id, "f");
    }
    get length() {
        return __classPrivateFieldGet(this, _StopWatch_tasks, "f").length;
    }
    get isRunning() {
        return __classPrivateFieldGet(this, _StopWatch_runningSpanName, "f") !== null;
    }
    get runningSpanName() {
        return __classPrivateFieldGet(this, _StopWatch_runningSpanName, "f");
    }
    get totalDuration() {
        return __classPrivateFieldGet(this, _StopWatch_totalDuration, "f");
    }
    start(spanName = '') {
        if (this.isRunning) {
            throw new Error(`StopWatch '${__classPrivateFieldGet(this, _StopWatch_id, "f")}' is running task ${__classPrivateFieldGet(this, _StopWatch_runningSpanName, "f")}. Call stop() before starting a new task`);
        }
        __classPrivateFieldSet(this, _StopWatch_runningSpanName, spanName, "f");
        __classPrivateFieldSet(this, _StopWatch_startedAt, utcNow(), "f");
    }
    stop() {
        if (!this.isRunning || __classPrivateFieldGet(this, _StopWatch_runningSpanName, "f") === null) {
            throw new Error(`StopWatch '${__classPrivateFieldGet(this, _StopWatch_id, "f")}' is not running. Call start() before stop().s`);
        }
        const endTime = utcNow();
        const task = new StopWatchSpan(__classPrivateFieldGet(this, _StopWatch_runningSpanName, "f"), __classPrivateFieldGet(this, _StopWatch_startedAt, "f"), endTime, __classPrivateFieldGet(this, _StopWatch_tasks, "f").length);
        __classPrivateFieldSet(this, _StopWatch_totalDuration, __classPrivateFieldGet(this, _StopWatch_totalDuration, "f") + task.duration, "f");
        __classPrivateFieldGet(this, _StopWatch_tasks, "f").push(task);
        __classPrivateFieldSet(this, _StopWatch_runningSpanName, null, "f");
    }
    at(index) {
        return __classPrivateFieldGet(this, _StopWatch_tasks, "f")[index];
    }
    findTask(spanName) {
        const task = __classPrivateFieldGet(this, _StopWatch_tasks, "f").find((task) => task.spanName === spanName);
        task?.calculatePercentage(__classPrivateFieldGet(this, _StopWatch_totalDuration, "f"));
        return task;
    }
    toString() {
        let str = '';
        for (let i = 0; i < __classPrivateFieldGet(this, _StopWatch_tasks, "f").length; i++) {
            const task = __classPrivateFieldGet(this, _StopWatch_tasks, "f")[i];
            str += `${task.spanName} ${task.percentage}% ${task.duration}ms\n`;
        }
        return str;
    }
}
_StopWatch_id = new WeakMap(), _StopWatch_runningSpanName = new WeakMap(), _StopWatch_startedAt = new WeakMap(), _StopWatch_totalDuration = new WeakMap(), _StopWatch_tasks = new WeakMap();
Object.defineProperty(StopWatch, "NoTaskMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'No task info kept'
});
//# sourceMappingURL=stop-watch.js.map