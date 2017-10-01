export class StatePairList {
  p: number[];
  q: number[];
  num: number;
  
  public constructor () {
  }
  
  public addPair (i, j) {
    for (let x = 0; x < this.num; ++x) {
      if (this.p[x] === i && this.q[x] === j) {
        return;
      }
    }
    
    this.p[this.num] = i;
    this.q[this.num] = j;
    ++this.num;
  }
  
  public markAll (list: StatePairList[][], equiv: boolean[][]) {
    for (let x = 0; x < this.num; ++x) {
      const i = this.p[x];
      const j = this.q[x];
      if (equiv[i][j]) {
        equiv[i][j] = false;
        if (list[i][j] != null) {
          list[i][j].markAll(list, equiv);
        }
      }
    }
    
  }
}
