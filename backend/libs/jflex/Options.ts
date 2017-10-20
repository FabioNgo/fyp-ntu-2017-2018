import {Skeleton} from './Skeleton';

export class Options {
  public static readonly DEBUG = false;
  public static readonly PACK = 0;
  public static readonly TABLE = 1;
  public static readonly SWITCH = 2;
  public static jlex: boolean;
  public static no_minimize: boolean;
  public static no_backup: boolean;
  public static gen_method: number;
  public static verbose: boolean;
  public static progress: boolean;
  public static time: boolean;
  public static dot: boolean;
  public static dump: boolean;
  private static directory: string;
  
  public constructor () {
  }
  
  public static getDir () {
    return this.directory;
  }
  
  public static setDir (dirName: string) {
    this.directory = dirName;
  }
  
  public static setDefaults () {
    this.directory = null;
    this.jlex = false;
    this.no_minimize = false;
    this.no_backup = false;
    this.gen_method = 0;
    this.verbose = true;
    this.progress = true;
    this.time = false;
    this.dot = false;
    this.dump = false;
  }
  
  public static setSkeleton (skel: File) {
    Skeleton.readSkel();
  }
}
