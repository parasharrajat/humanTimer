import { Subject } from 'rxjs';

export function secsToHumanReadableString(secs: number) {
  const hr = Math.floor(+secs / 3600);
  const min = Math.floor((+secs % 3600) / 60);
  const sec = Math.floor((+secs % 3600) % 60);
  let str = '';
  if (hr > 0) {
    str += `${hr} ${hr > 1 ? 'hrs' : 'hr'}`;
  }
  if (min > 0) {
    str += ` ${min} ${min > 1 ? 'mins' : 'min'}`;
  }
  if (sec > 0) {
    str += ` ${sec} ${sec > 1 ? 'secs' : 'sec'}`;
  }
  return str;
}


export class TimeCalculator {
  private intr: any;
  private _time: number;
  private _result: string;
  private _activeTimers = 0;

  /**
   * Dynamic result observable
   *
   * @memberof TimeCalculator
   */
  result$ = new Subject<string>();

  constructor(time: Date) {
    this._time = time.getTime();
    this._start();
  }

  private _start() {
    this.destroy();
    this.intr = this._timer(1000);
    return this.result$;
  }

  // static result at a moment
  get result() {
    return this._result;
  }

  /**
   * Destroy the the active timer
   *
   * @memberof TimeCalculator
   */
  destroy() {
    if (this.intr && this._activeTimers > 0) {
      try {
        clearInterval(this.intr);

      } catch (e) {
        clearTimeout(this.intr);
      }
      this._activeTimers--;
      this.intr = undefined;
    }
  }
  /**
   * Calculate the realtime humanRadable string for time
   *
   * @param {number} t
   * @memberof TimeCalculator
   */
  private _timeCalculator(t: number) {

    let secs = Math.floor((new Date().getTime() - t) / 1000);
    // console.log(new Date(t).toUTCString());

    // seconds
    if (secs < 60) {
      // console.log(secs + ' sec ago');
      this._result = secs + ' sec ago';
    } else {
      secs /= 60;
      secs = Math.floor(secs);
      //   mins
      if (secs < 60) {
        // console.log(secs + (secs > 1 ? ' mins' : ' min') + ' ago');
        this._result = secs + (secs > 1 ? ' mins' : ' min') + ' ago';
        this.intr = this._resetTimeout(60 * 1000);
      } else {
        secs /= 60;
        secs = Math.floor(secs);
        //   hr
        if (secs < 24) {
          // console.log(secs + (secs > 1 ? ' hrs' : ' hr') + ' ago');
          this._result = secs + (secs > 1 ? ' hrs' : ' hr') + ' ago';
          this.intr = this._resetTimeout(60 * 60 * 1000);

        } else {
          secs /= 24;
          secs = Math.floor(secs);
          //   days
          if (secs < 30) {
            // console.log(secs + (secs > 1 ? ' days' : ' day') + ' ago');
            this._result = secs + (secs > 1 ? ' days' : ' day') + ' ago';

          } else {
            secs /= 30;
            secs = Math.floor(secs);
            // months
            if (secs < 12) {
              // console.log(secs + (secs > 1 ? ' months' : ' month') + ' ago');
              this._result = secs + (secs > 1 ? ' months' : ' month') + ' ago';

            } else {
              secs /= 12;
              secs = Math.floor(secs);
              // years
              if (secs < 5) {
                // console.log(secs + (secs > 1 ? ' years' : ' year') + ' ago');
                this._result = secs + (secs > 1 ? ' years' : ' year') + ' ago';
              } else {
                const dateee = new Date(t).toDateString();
                // console.log('on ' + dateee);
                this._result = 'on ' + dateee;
              }
            }
          }

        }
      }
    }
    this.result$.next(this._result);
  }

  /**
   * Start the infinity Timer
   *
   * @param {*} tt
   * @returns
   * @memberof TimeCalculator
   */
  private _timer(tt) {
    this._activeTimers++;
    return window.setInterval(() => {
      this._timeCalculator(this._time);
    }, tt);
  }

  /**
   * Reset the timer to run at a specific time.
   *
   * @param {*} timeToOut
   * @returns
   * @memberof TimeCalculator
   */
  private _resetTimeout(timeToOut) {
    this.destroy();
    this._activeTimers++;
    return window.setTimeout(() => {
      this._timeCalculator(this._time);

    }, timeToOut);
  }
}
