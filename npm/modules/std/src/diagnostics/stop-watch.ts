export class StopWatchSpan {
    #spanName: string;
    #percentage: string | undefined;
    #duration: number;
    #startTime: Date;
    #endTime: Date;
    #index: number;

    constructor(spanName: string, startTime: Date, endTime: Date, index: number) {
        this.#spanName = spanName;
        this.#index = index;
        this.#startTime = startTime;
        this.#endTime = endTime;
        this.#duration = endTime.getTime() - startTime.getTime();
    }

    get startTime(): Date {
        return this.#startTime;
    }

    get endTime(): Date {
        return this.#endTime;
    }

    get spanName(): string {
        return this.#spanName;
    }

    get duration(): number {
        return this.#duration;
    }

    get percentage(): string | undefined {
        return this.#percentage;
    }

    calculatePercentage(totalDuration: number): string {
        this.#percentage = (this.#duration * 100 / totalDuration).toFixed(2);
        return this.#percentage;
    }
}

export function utcNow() {
    const now = new Date();
    const utc = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds(),
    );

    return utc;
}

export class StopWatch {
    public static NoTaskMessage = 'No task info kept';

    #id: string;
    #runningSpanName: string | null = null;
    #startedAt?: Date;
    #totalDuration = 0;
    #tasks: Array<StopWatchSpan>;

    constructor(id = '') {
        this.#id = id;
        this.#tasks = [];
    }

    get id(): string {
        return this.#id;
    }

    get length(): number {
        return this.#tasks.length;
    }

    get isRunning(): boolean {
        return this.#runningSpanName !== null;
    }

    get runningSpanName(): string | null {
        return this.#runningSpanName;
    }

    get totalDuration(): number {
        return this.#totalDuration;
    }

    start(spanName = ''): void {
        if (this.isRunning) {
            throw new Error(
                `StopWatch '${this.#id}' is running task ${this.#runningSpanName}. Call stop() before starting a new task`,
            );
        }
        this.#runningSpanName = spanName;
        this.#startedAt = utcNow();
    }

    stop(): void {
        if (!this.isRunning || this.#runningSpanName === null) {
            throw new Error(
                `StopWatch '${this.#id}' is not running. Call start() before stop().s`,
            );
        }

        const endTime = utcNow();
        const task = new StopWatchSpan(
            this.#runningSpanName,
            this.#startedAt!,
            endTime,
            this.#tasks.length,
        );
        this.#totalDuration += task.duration;
        this.#tasks.push(task);
        this.#runningSpanName = null;
    }

    at(index: number): StopWatchSpan | undefined {
        return this.#tasks[index];
    }

    findTask(spanName: string): StopWatchSpan | undefined {
        const task = this.#tasks.find((task) => task.spanName === spanName);
        task?.calculatePercentage(this.#totalDuration);
        return task;
    }

    toString(): string {
        let str = '';
        for (let i = 0; i < this.#tasks.length; i++) {
            const task = this.#tasks[i];
            str += `${task.spanName} ${task.percentage}% ${task.duration}ms\n`;
        }
        return str;
    }
}
