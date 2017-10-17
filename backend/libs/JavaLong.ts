// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export class JavaLong {
  // public static ONE = new JavaLong(1);
  private static readonly TWO_PWR_16_DBL_ = 1 << 16;
  private static readonly TWO_PWR_32_DBL_ = JavaLong.TWO_PWR_16_DBL_ * JavaLong.TWO_PWR_16_DBL_;
  private static readonly TWO_PWR_64_DBL_ = JavaLong.TWO_PWR_32_DBL_ * JavaLong.TWO_PWR_32_DBL_;
  private static readonly TWO_PWR_63_DBL_ = JavaLong.TWO_PWR_64_DBL_ / 2;
  // public static ZERO = new JavaLong(0);
  private low: number;
  private high: number;
  private value: number;
  
  public constructor (high: number, low: number) {
    this.setHigh(high);
    this.setLow(low);
    this.value = this.toNumber();
  }
  
  public static getZero (): JavaLong {
    return new JavaLong(0, 0);
  }
  
  public static getOne (): JavaLong {
    return new JavaLong(0, 1);
  }
  
  public static fromNumber (value: number) {
    
    return new JavaLong(
      (value / JavaLong.TWO_PWR_32_DBL_) | 0,
      (value % JavaLong.TWO_PWR_32_DBL_) | 0);
    
  }
  
  public static fromBits (highBits: number, lowBits: number) {
    
    return new JavaLong(highBits, lowBits);
    
  }
  
  public static bitAnd (a: JavaLong, b: JavaLong): JavaLong {
    return JavaLong.fromBits(
      a.high & b.high, a.low & b.low);
  }
  
  public static bitOr (a: JavaLong, b: JavaLong): JavaLong {
    return JavaLong.fromBits(
      a.high | b.high, a.low | b.low);
  }
  
  public shiftLeft (numBits: number): JavaLong {
    numBits &= 63;
    
    if (numBits === 0) {
      return this;
    } else {
      const low = this.low;
      if (numBits < 32) {
        const high = this.high;
        return JavaLong.fromBits(
          (high << numBits) | (low >>> (32 - numBits)), low << numBits);
      } else {
        return JavaLong.fromBits(low << (numBits - 32), 0);
      }
    }
  }
  
  /**
   
   * Returns this Long with bits shifted to the right by the given amount.
   
   * The new leading bits match the current sign bit.
   
   * @param {number} numBits The number of bits by which to shift.
   
   * @return {!goog.math.Long} This shifted to the right by the given amount.
   
   */
  public shiftRight (numBits: number): JavaLong {
    numBits &= 63;
    
    if (numBits === 0) {
      return this;
    } else {
      const high = this.high;
      if (numBits < 32) {
        const low = this.low;
        return JavaLong.fromBits(
          high >> numBits, (low >>> numBits) | (high << (32 - numBits)));
        
      } else {
        return JavaLong.fromBits(
          high >= 0 ? 0 : -1, high >> (numBits - 32));
      }
      
    }
    
  }
  
  public toNumber (): number {
    return this.high * JavaLong.TWO_PWR_32_DBL_
      + this.getLowBitsUnsigned();
  }
  
  public setLow (input: number) {
    this.low = input | 0;
    // this.low = Math.floor(input) % (2 ** 32);
  }
  
  public setHigh (input: number) {
    this.high = input | 0;
    // this.high = Math.floor(input) % (2 ** 32);
  }
  
  public bitNot (): JavaLong {
    return JavaLong.fromBits(~this.high, ~this.low);
  }
  
  public getLow () {
    return this.low;
  }
  
  public getHigh () {
    return this.high;
  }
  
  toString () {
    return this.value;
  }
  
  private getLowBitsUnsigned () {
    return (this.low >= 0) ? this.low :
      JavaLong.TWO_PWR_32_DBL_ + this.low;
  }
}
