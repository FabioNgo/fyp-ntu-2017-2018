export class Timer {
  private startTime;
  private stopTime;
  private running;
  
  public constructor () {
    this.startTime = Date.now();
    this.running = true;
  }
  
  public start () {
    this.startTime = Date.now();
    this.running = true;
  }
  
  public stop () {
    this.stopTime = Date.now();
    this.running = false;
  }
  
  public diff () {
    return this.running ? Date.now() - this.startTime : this.stopTime - this.startTime;
  }
  
  public toString () {
    const diff = this.diff();
    const millis = Math.floor(diff % 1000);
    const secs = Math.floor(diff / 1000 % 60);
    const mins = Math.floor(diff / 60000 % 60);
    const hs = Math.floor(diff / 3600000 % 24);
    const days = Math.floor(diff / 86400000);
    if (days > 0) {
      return days + 'd ' + hs + 'h ' + mins + 'm ' + secs + 's ' + millis + 'ms';
    } else if (hs > 0) {
      return hs + 'h ' + mins + 'm ' + secs + 's ' + millis + 'ms';
    } else if (mins > 0) {
      return mins + 'm ' + secs + 's ' + millis + 'ms';
    } else {
      return secs > 0 ? secs + 's ' + millis + 'ms' : millis + 'ms';
    }
  }
}
