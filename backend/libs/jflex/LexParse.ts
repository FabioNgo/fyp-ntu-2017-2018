import {ErrorMessages} from './ErrorMessages';
import {Symbol} from '../java_cup.runtime/Symbol';
import {LRParser} from '../java_cup.runtime/LRParser';
import {LexParseActions} from './LexParseActions';
import {LexScan} from './LexScan';
import {EOFActions} from './EOFActions';

export class LexParse extends LRParser {
  protected static readonly _production_table = LRParser.unpackFromStrings('\u0000H\u0000\u0002\u0002\u0004\u0000\u0002\u0006\u0006\u0000\u0002\u0006\u0002\u0000\u0002\u0003\u0002\u0000\u0002\u0003\u0004\u0000\u0002\u0003\u0003\u0000\u0002\u0004\u0003\u0000\u0002\u0004\u0003\u0000\u0002\u0004\u0006\u0000\u0002\u0004\u0004\u0000\u0002\u0012\u0004\u0000\u0002\u0012\t\u0000\u0002\u0012\b\u0000\u0002\u0012\u0003\u0000\u0002\u0005\u0007\u0000\u0002\u0005\u0005\u0000\u0002\u0005\u0003\u0000\u0002\f\u0003\u0000\u0002\f\u0004\u0000\u0002\f\u0002\u0000\u0002\f\u0005\u0000\u0002\u0014\u0004\u0000\u0002\u0014\u0003\u0000\u0002\u000f\u0005\u0000\u0002\u000f\u0002\u0000\u0002\u000e\u0005\u0000\u0002\u000e\u0003\u0000\u0002\u000e\u0004\u0000\u0002\u0013\u0003\u0000\u0002\u0013\u0002\u0000\u0002\u0007\u0005\u0000\u0002\u0007\u0003\u0000\u0002\u0007\u0003\u0000\u0002\b\u0004\u0000\u0002\b\u0003\u0000\u0002\t\u0003\u0000\u0002\t\u0004\u0000\u0002\t\u0004\u0000\u0002\n\u0004\u0000\u0002\n\u0004\u0000\u0002\n\u0004\u0000\u0002\n\u0005\u0000\u0002\n\u0006\u0000\u0002\n\u0005\u0000\u0002\n\u0003\u0000\u0002\n\u0003\u0000\u0002\n\u0003\u0000\u0002\n\u0003\u0000\u0002\n\u0003\u0000\u0002\n\u0003\u0000\u0002\u000b\u0004\u0000\u0002\u000b\u0005\u0000\u0002\u000b\u0005\u0000\u0002\u000b\u0006\u0000\u0002\u000b\u0006\u0000\u0002\u000b\u0007\u0000\u0002\u0010\u0004\u0000\u0002\u0010\u0003\u0000\u0002\u0010\u0004\u0000\u0002\u0010\u0003\u0000\u0002\u0010\u0004\u0000\u0002\u0010\u0003\u0000\u0002\u0010\u0004\u0000\u0002\u0010\u0003\u0000\u0002\r\u0005\u0000\u0002\r\u0003\u0000\u0002\u0011\u0003\u0000\u0002\u0011\u0003\u0000\u0002\u0011\u0003\u0000\u0002\u0011\u0003\u0000\u0002\u0011\u0003\u0000\u0002\u0011\u0003');
  protected static readonly _action_table = LRParser.unpackFromStrings('\u0000j\u0000\u0006\u0002\uffff \u0004\u0001\u0002\u0000\f\u0003\u0007\u000b\ufffe\u0012\ufffe\u0013\ufffe\u001f\ufffe\u0001\u0002\u0000\u0004\u0002\u0006\u0001\u0002\u0000\u0004\u0002\u0001\u0001\u0002\u0000\n\u000b￼\u0012￼\u0013￼\u001f￼\u0001\u0002\u0000\n\u000b\t\u0012\r\u0013\f\u001f\u000b\u0001\u0002\u0000(\u0003K\u0004￩\u0006￩\b￩\u000eM\u0015￩\u0016￩\u0017￩\u0018￩\u0019￩\u001a￩\u001b￩$￩&￩\'￩(￩)￩*￩+￩\u0001\u0002\u0000\n\u000b�\u0012�\u0013�\u001f�\u0001\u0002\u0000\u0004\f\u000e\u0001\u0002\u0000\n\u000b\ufffa\u0012\ufffa\u0013\ufffa\u001f\ufffa\u0001\u0002\u0000\n\u000b\ufffb\u0012\ufffb\u0013\ufffb\u001f\ufffb\u0001\u0002\u0000(\u0004\u001b\b#\u000b\ufff8\u0012\ufff8\u0013\ufff8\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019\u001f\ufff8$ &\u0011\'\u001e(\u0012)\u0010*\u0017+\u0014\u0001\u0002\u00004\u0004ﾽ\u0005ﾽ\u0007ﾽ\bﾽ\tﾽ\u0014ﾽ\u0015ﾽ\u0016ﾽ\u0017ﾽ\u0018ﾽ\u0019ﾽ\u001aﾽ\u001cﾽ\u001dﾽ!ﾽ"ﾽ#ﾽ$ﾽ%ﾽ&ﾽ\'ﾽ(ﾽ)ﾽ*ﾽ+ﾽ\u0001\u0002\u00002\u0004\uffd0\u0005\uffd0\u0007\uffd0\b\uffd0\u0014\uffd0\u0015\uffd0\u0016\uffd0\u0017\uffd0\u0018\uffd0\u0019\uffd0\u001a\uffd0\u001c\uffd0\u001d\uffd0!\uffd0"\uffd0#\uffd0$\uffd0%\uffd0&\uffd0\'\uffd0(\uffd0)\uffd0*\uffd0+\uffd0\u0001\u0002\u00002\u0004\uffd1\u0005\uffd1\u0007\uffd1\b\uffd1\u0014\uffd1\u0015\uffd1\u0016\uffd1\u0017\uffd1\u0018\uffd1\u0019\uffd1\u001a\uffd1\u001c\uffd1\u001d\uffd1!\uffd1"\uffd1#\uffd1$\uffd1%\uffd1&\uffd1\'\uffd1(\uffd1)\uffd1*\uffd1+\uffd1\u0001\u0002\u0000\u001e\u0004\u001b\b#\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019&\u0011\'\u001e(\u0012)\u0010*\u0017+\u0014\u0001\u0002\u00004\u0004\uffbf\u0005\uffbf\u0007\uffbf\b\uffbf\t\uffbf\u0014\uffbf\u0015\uffbf\u0016\uffbf\u0017\uffbf\u0018\uffbf\u0019\uffbf\u001a\uffbf\u001c\uffbf\u001d\uffbf!\uffbf"\uffbf#\uffbf$\uffbf%\uffbf&\uffbf\'\uffbf(\uffbf)\uffbf*\uffbf+\uffbf\u0001\u0002\u00002\u0004ￕ\u0005ￕ\u0007ￕ\bￕ\u0014ￕ\u0015ￕ\u0016ￕ\u0017ￕ\u0018ￕ\u0019ￕ\u001aￕ\u001cￕ\u001dￕ!ￕ"ￕ#ￕ$ￕ%ￕ&ￕ\'ￕ(ￕ)ￕ*ￕ+ￕ\u0001\u0002\u0000\u0006\u0014I$E\u0001\u0002\u00002\u0004ￓ\u0005ￓ\u0007ￓ\bￓ\u0014ￓ\u0015ￓ\u0016ￓ\u0017ￓ\u0018ￓ\u0019ￓ\u001aￓ\u001cￓ\u001dￓ!ￓ"ￓ#ￓ$ￓ%ￓ&ￓ\'ￓ(ￓ)ￓ*ￓ+ￓ\u0001\u0002\u00002\u0004ￒ\u0005ￒ\u0007ￒ\bￒ\u0014ￒ\u0015ￒ\u0016ￒ\u0017ￒ\u0018ￒ\u0019ￒ\u001aￒ\u001cￒ\u001dￒ!ￒ"ￒ#ￒ$ￒ%ￒ&ￒ\'ￒ(ￒ)ￒ*ￒ+ￒ\u0001\u0002\u00004\u0004ﾾ\u0005ﾾ\u0007ﾾ\bﾾ\tﾾ\u0014ﾾ\u0015ﾾ\u0016ﾾ\u0017ﾾ\u0018ﾾ\u0019ﾾ\u001aﾾ\u001cﾾ\u001dﾾ!ﾾ"ﾾ#ﾾ$ﾾ%ﾾ&ﾾ\'ﾾ(ﾾ)ﾾ*ﾾ+ﾾ\u0001\u0002\u00004\u0004ﾺ\u0005ﾺ\u0007ﾺ\bﾺ\tﾺ\u0014ﾺ\u0015ﾺ\u0016ﾺ\u0017ﾺ\u0018ﾺ\u0019ﾺ\u001aﾺ\u001cﾺ\u001dﾺ!ﾺ"ﾺ#ﾺ$ﾺ%ﾺ&ﾺ\'ﾺ(ﾺ)ﾺ*ﾺ+ﾺ\u0001\u0002\u0000*\u0004\u001b\u0005￢\u0007￢\b#\u0014￢\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019\u001c￢\u001d￢$￢&\u0011\'\u001e(\u0012)\u0010*\u0017+\u0014\u0001\u0002\u0000 \u0004\u001b\b#\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019$ &\u0011\'\u001e(\u0012)\u0010*\u0017+\u0014\u0001\u0002\u00004\u0004ﾻ\u0005ﾻ\u0007ﾻ\bﾻ\tﾻ\u0014ﾻ\u0015ﾻ\u0016ﾻ\u0017ﾻ\u0018ﾻ\u0019ﾻ\u001aﾻ\u001cﾻ\u001dﾻ!ﾻ"ﾻ#ﾻ$ﾻ%ﾻ&ﾻ\'ﾻ(ﾻ)ﾻ*ﾻ+ﾻ\u0001\u0002\u00002\u0004ￔ\u0005ￔ\u0007ￔ\bￔ\u0014ￔ\u0015ￔ\u0016ￔ\u0017ￔ\u0018ￔ\u0019ￔ\u001aￔ\u001cￔ\u001dￔ!ￔ"ￔ#ￔ$ￔ%ￔ&ￔ\'ￔ(ￔ)ￔ*ￔ+ￔ\u0001\u0002\u0000\u001e\u0004\u001b\b#\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019&\u0011\'\u001e(\u0012)\u0010*\u0017+\u0014\u0001\u0002\u0000*\u0004\uffdf\u0005\uffdf\u0007\uffdf\b\uffdf\u0014\uffdf\u0015\uffdf\u0016\uffdf\u0017\uffdf\u0018\uffdf\u0019\uffdf\u001a\uffdf\u001c\uffdf\u001d\uffdf$\uffdf&\uffdf\'\uffdf(\uffdf)\uffdf*\uffdf+\uffdf\u0001\u0002\u0000\u000e\u0005￡\u0007￡\u0014￡\u001c￡\u001d￡$￡\u0001\u0002\u00004\u0004ﾼ\u0005ﾼ\u0007ﾼ\bﾼ\tﾼ\u0014ﾼ\u0015ﾼ\u0016ﾼ\u0017ﾼ\u0018ﾼ\u0019ﾼ\u001aﾼ\u001cﾼ\u001dﾼ!ﾼ"ﾼ#ﾼ$ﾼ%ﾼ&ﾼ\'ﾼ(ﾼ)ﾼ*ﾼ+ﾼ\u0001\u0002\u00002\u0004\uffde\u0005\uffde\u0007\uffde\b\uffde\u0014\uffde\u0015\uffde\u0016\uffde\u0017\uffde\u0018\uffde\u0019\uffde\u001a\uffde\u001c\uffde\u001d\uffde!>"<#=$\uffde%?&\uffde\'\uffde(\uffde)\uffde*\uffde+\uffde\u0001\u0002\u0000\u001a\u0006\'\t(\n&\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019),*)++\u0001\u0002\u0000\u0016\tￆ\u0015ￆ\u0016ￆ\u0017ￆ\u0018ￆ\u0019ￆ\u001aￆ)ￆ*ￆ+ￆ\u0001\u0002\u0000\u0016\t\uffc8\u0015\uffc8\u0016\uffc8\u0017\uffc8\u0018\uffc8\u0019\uffc8\u001a\uffc8)\uffc8*\uffc8+\uffc8\u0001\u0002\u0000\u0014\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019),*)++\u0001\u0002\u0000\u0018\t5\n4\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019),*)++\u0001\u0002\u00002\u0004ￏ\u0005ￏ\u0007ￏ\bￏ\u0014ￏ\u0015ￏ\u0016ￏ\u0017ￏ\u0018ￏ\u0019ￏ\u001aￏ\u001cￏ\u001dￏ!ￏ"ￏ#ￏ$ￏ%ￏ&ￏ\'ￏ(ￏ)ￏ*ￏ+ￏ\u0001\u0002\u0000\u0016\tￄ\u0015ￄ\u0016ￄ\u0017ￄ\u0018ￄ\u0019ￄ\u001aￄ)ￄ*ￄ+ￄ\u0001\u0002\u0000\u0016\t1\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019),*2+3\u0001\u0002\u0000\u0016\tￂ\u0015ￂ\u0016ￂ\u0017ￂ\u0018ￂ\u0019ￂ\u001aￂ)ￂ*ￂ+ￂ\u0001\u0002\u0000\u0018\t\uffc0\n-\u0015\uffc0\u0016\uffc0\u0017\uffc0\u0018\uffc0\u0019\uffc0\u001a\uffc0)\uffc0*\uffc0+\uffc0\u0001\u0002\u0000\u0004).\u0001\u0002\u0000\u0016\t\uffc1\u0015\uffc1\u0016\uffc1\u0017\uffc1\u0018\uffc1\u0019\uffc1\u001a\uffc1)\uffc1*\uffc1+\uffc1\u0001\u0002\u0000\u0016\tￇ\u0015ￇ\u0016ￇ\u0017ￇ\u0018ￇ\u0019ￇ\u001aￇ)ￇ*ￇ+ￇ\u0001\u0002\u0000\u0016\t\uffc9\u0015\uffc9\u0016\uffc9\u0017\uffc9\u0018\uffc9\u0019\uffc9\u001a\uffc9)\uffc9*\uffc9+\uffc9\u0001\u0002\u00002\u0004ￎ\u0005ￎ\u0007ￎ\bￎ\u0014ￎ\u0015ￎ\u0016ￎ\u0017ￎ\u0018ￎ\u0019ￎ\u001aￎ\u001cￎ\u001dￎ!ￎ"ￎ#ￎ$ￎ%ￎ&ￎ\'ￎ(ￎ)ￎ*ￎ+ￎ\u0001\u0002\u0000\u0016\tￅ\u0015ￅ\u0016ￅ\u0017ￅ\u0018ￅ\u0019ￅ\u001aￅ)ￅ*ￅ+ￅ\u0001\u0002\u0000\u0016\tￃ\u0015ￃ\u0016ￃ\u0017ￃ\u0018ￃ\u0019ￃ\u001aￃ)ￃ*ￃ+ￃ\u0001\u0002\u0000\u0014\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019),*)++\u0001\u0002\u00002\u0004ￍ\u0005ￍ\u0007ￍ\bￍ\u0014ￍ\u0015ￍ\u0016ￍ\u0017ￍ\u0018ￍ\u0019ￍ\u001aￍ\u001cￍ\u001dￍ!ￍ"ￍ#ￍ$ￍ%ￍ&ￍ\'ￍ(ￍ)ￍ*ￍ+ￍ\u0001\u0002\u0000\u0016\t7\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019),*2+3\u0001\u0002\u00002\u0004ￌ\u0005ￌ\u0007ￌ\bￌ\u0014ￌ\u0015ￌ\u0016ￌ\u0017ￌ\u0018ￌ\u0019ￌ\u001aￌ\u001cￌ\u001dￌ!ￌ"ￌ#ￌ$ￌ%ￌ&ￌ\'ￌ(ￌ)ￌ*ￌ+ￌ\u0001\u0002\u0000\u0016\t9\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019),*2+3\u0001\u0002\u00002\u0004ￊ\u0005ￊ\u0007ￊ\bￊ\u0014ￊ\u0015ￊ\u0016ￊ\u0017ￊ\u0018ￊ\u0019ￊ\u001aￊ\u001cￊ\u001dￊ!ￊ"ￊ#ￊ$ￊ%ￊ&ￊ\'ￊ(ￊ)ￊ*ￊ+ￊ\u0001\u0002\u0000\u0016\t;\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019),*2+3\u0001\u0002\u00002\u0004ￋ\u0005ￋ\u0007ￋ\bￋ\u0014ￋ\u0015ￋ\u0016ￋ\u0017ￋ\u0018ￋ\u0019ￋ\u001aￋ\u001cￋ\u001dￋ!ￋ"ￋ#ￋ$ￋ%ￋ&ￋ\'ￋ(ￋ)ￋ*ￋ+ￋ\u0001\u0002\u00002\u0004ￛ\u0005ￛ\u0007ￛ\bￛ\u0014ￛ\u0015ￛ\u0016ￛ\u0017ￛ\u0018ￛ\u0019ￛ\u001aￛ\u001cￛ\u001dￛ!ￛ"ￛ#ￛ$ￛ%ￛ&ￛ\'ￛ(ￛ)ￛ*ￛ+ￛ\u0001\u0002\u00002\u0004ￚ\u0005ￚ\u0007ￚ\bￚ\u0014ￚ\u0015ￚ\u0016ￚ\u0017ￚ\u0018ￚ\u0019ￚ\u001aￚ\u001cￚ\u001dￚ!ￚ"ￚ#ￚ$ￚ%ￚ&ￚ\'ￚ(ￚ)ￚ*ￚ+ￚ\u0001\u0002\u0000\u0006\u0011@!A\u0001\u0002\u00002\u0004\uffd9\u0005\uffd9\u0007\uffd9\b\uffd9\u0014\uffd9\u0015\uffd9\u0016\uffd9\u0017\uffd9\u0018\uffd9\u0019\uffd9\u001a\uffd9\u001c\uffd9\u001d\uffd9!\uffd9"\uffd9#\uffd9$\uffd9%\uffd9&\uffd9\'\uffd9(\uffd9)\uffd9*\uffd9+\uffd9\u0001\u0002\u00002\u0004\uffd8\u0005\uffd8\u0007\uffd8\b\uffd8\u0014\uffd8\u0015\uffd8\u0016\uffd8\u0017\uffd8\u0018\uffd8\u0019\uffd8\u001a\uffd8\u001c\uffd8\u001d\uffd8!\uffd8"\uffd8#\uffd8$\uffd8%\uffd8&\uffd8\'\uffd8(\uffd8)\uffd8*\uffd8+\uffd8\u0001\u0002\u0000\u0004\u0011B\u0001\u0002\u00002\u0004ￗ\u0005ￗ\u0007ￗ\bￗ\u0014ￗ\u0015ￗ\u0016ￗ\u0017ￗ\u0018ￗ\u0019ￗ\u001aￗ\u001cￗ\u001dￗ!ￗ"ￗ#ￗ$ￗ%ￗ&ￗ\'ￗ(ￗ)ￗ*ￗ+ￗ\u0001\u0002\u0000*\u0004\uffdd\u0005\uffdd\u0007\uffdd\b\uffdd\u0014\uffdd\u0015\uffdd\u0016\uffdd\u0017\uffdd\u0018\uffdd\u0019\uffdd\u001a\uffdd\u001c\uffdd\u001d\uffdd$\uffdd&\uffdd\'\uffdd(\uffdd)\uffdd*\uffdd+\uffdd\u0001\u0002\u0000\u0006\u0005F$E\u0001\u0002\u0000\u001e\u0004\u001b\b#\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019&\u0011\'\u001e(\u0012)\u0010*\u0017+\u0014\u0001\u0002\u00002\u0004ￖ\u0005ￖ\u0007ￖ\bￖ\u0014ￖ\u0015ￖ\u0016ￖ\u0017ￖ\u0018ￖ\u0019ￖ\u001aￖ\u001cￖ\u001dￖ!ￖ"ￖ#ￖ$ￖ%ￖ&ￖ\'ￖ(ￖ)ￖ*ￖ+ￖ\u0001\u0002\u0000*\u0004\u001b\u0005￣\u0007￣\b#\u0014￣\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019\u001c￣\u001d￣$￣&\u0011\'\u001e(\u0012)\u0010*\u0017+\u0014\u0001\u0002\u0000*\u0004￠\u0005￠\u0007￠\b￠\u0014￠\u0015￠\u0016￠\u0017￠\u0018￠\u0019￠\u001a￠\u001c￠\u001d￠$￠&￠\'￠(￠)￠*￠+￠\u0001\u0002\u0000\n\u000b\ufff9\u0012\ufff9\u0013\ufff9\u001f\ufff9\u0001\u0002\u0000*\u0004ￜ\u0005ￜ\u0007ￜ\bￜ\u0014ￜ\u0015ￜ\u0016ￜ\u0017ￜ\u0018ￜ\u0019ￜ\u001aￜ\u001cￜ\u001dￜ$ￜ&ￜ\'ￜ(ￜ)ￜ*ￜ+ￜ\u0001\u0002\u0000,\u0002\ufff1\u0003\ufff1\u0004\ufff1\u0006\ufff1\b\ufff1\u000e\ufff1\u0011\ufff1\u0015\ufff1\u0016\ufff1\u0017\ufff1\u0018\ufff1\u0019\ufff1\u001a\ufff1\u001b\ufff1$\ufff1&\ufff1\'\ufff1(\ufff1)\ufff1*\ufff1+\ufff1\u0001\u0002\u0000$\u0004￤\u0006a\b￤\u0015￤\u0016￤\u0017￤\u0018￤\u0019￤\u001a￤\u001b_$￤&￤\'￤(￤)￤*￤+￤\u0001\u0002\u0000\u0004\u001fS\u0001\u0002\u0000,\u0002\ufff4\u0003\ufff4\u0004\ufff4\u0006\ufff4\b\ufff4\u000e\ufff4\u0011\ufff4\u0015\ufff4\u0016\ufff4\u0017\ufff4\u0018\ufff4\u0019\ufff4\u001a\ufff4\u001b\ufff4$\ufff4&\ufff4\'\ufff4(\ufff4)\ufff4*\ufff4+\ufff4\u0001\u0002\u0000*\u0002\u0000\u0003K\u0004￩\u0006￩\b￩\u000eP\u0015￩\u0016￩\u0017￩\u0018￩\u0019￩\u001a￩\u001b￩$￩&￩\'￩(￩)￩*￩+￩\u0001\u0002\u0000\u0004\u001fS\u0001\u0002\u0000,\u0002\ufff7\u0003\ufff7\u0004\ufff7\u0006\ufff7\b\ufff7\u000e\ufff7\u0011\ufff7\u0015\ufff7\u0016\ufff7\u0017\ufff7\u0018\ufff7\u0019\ufff7\u001a\ufff7\u001b\ufff7$\ufff7&\ufff7\'\ufff7(\ufff7)\ufff7*\ufff7+\ufff7\u0001\u0002\u0000\u0004\u000fV\u0001\u0002\u0000\u0006\rT\u000f\uffe7\u0001\u0002\u0000\u0006\u000f￦\u001fS\u0001\u0002\u0000\u0004\u000f￨\u0001\u0002\u0000&\u0004￪\u0006￪\b￪\u0010W\u0015￪\u0016￪\u0017￪\u0018￪\u0019￪\u001a￪\u001b￪$￪&￪\'￪(￪)￪*￪+￪\u0001\u0002\u0000(\u0003K\u0004￩\u0006￩\b￩\u000eM\u0015￩\u0016￩\u0017￩\u0018￩\u0019￩\u001a￩\u001b￩$￩&￩\'￩(￩)￩*￩+￩\u0001\u0002\u0000*\u0003K\u0004￩\u0006￩\b￩\u000eP\u0011Y\u0015￩\u0016￩\u0017￩\u0018￩\u0019￩\u001a￩\u001b￩$￩&￩\'￩(￩)￩*￩+￩\u0001\u0002\u0000,\u0002\ufff6\u0003\ufff6\u0004\ufff6\u0006\ufff6\b\ufff6\u000e\ufff6\u0011\ufff6\u0015\ufff6\u0016\ufff6\u0017\ufff6\u0018\ufff6\u0019\ufff6\u001a\ufff6\u001b\ufff6$\ufff6&\ufff6\'\ufff6(\ufff6)\ufff6*\ufff6+\ufff6\u0001\u0002\u0000\u0004\u000f[\u0001\u0002\u0000&\u0004￪\u0006￪\b￪\u0010\\\u0015￪\u0016￪\u0017￪\u0018￪\u0019￪\u001a￪\u001b￪$￪&￪\'￪(￪)￪*￪+￪\u0001\u0002\u0000(\u0003K\u0004￩\u0006￩\b￩\u000eM\u0015￩\u0016￩\u0017￩\u0018￩\u0019￩\u001a￩\u001b￩$￩&￩\'￩(￩)￩*￩+￩\u0001\u0002\u0000*\u0003K\u0004￩\u0006￩\b￩\u000eP\u0011^\u0015￩\u0016￩\u0017￩\u0018￩\u0019￩\u001a￩\u001b￩$￩&￩\'￩(￩)￩*￩+￩\u0001\u0002\u0000,\u0002\ufff5\u0003\ufff5\u0004\ufff5\u0006\ufff5\b\ufff5\u000e\ufff5\u0011\ufff5\u0015\ufff5\u0016\ufff5\u0017\ufff5\u0018\ufff5\u0019\ufff5\u001a\ufff5\u001b\ufff5$\ufff5&\ufff5\'\ufff5(\ufff5)\ufff5*\ufff5+\ufff5\u0001\u0002\u0000\u0004\u001el\u0001\u0002\u0000 \u0004\u001b\b#\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019$ &\u0011\'\u001e(\u0012)\u0010*\u0017+\u0014\u0001\u0002\u0000 \u0004￥\b￥\u0015￥\u0016￥\u0017￥\u0018￥\u0019￥\u001a￥$￥&￥\'￥(￥)￥*￥+￥\u0001\u0002\u0000\f\u0007e\u0014￮\u001c￮\u001dc$E\u0001\u0002\u0000 \u0004\u001b\b#\u0015\u0013\u0016\u0018\u0017\u000f\u0018!\u0019\u001c\u001a\u0019$ &\u0011\'\u001e(\u0012)\u0010*\u0017+\u0014\u0001\u0002\u0000\u0006\u0014g\u001cf\u0001\u0002\u0000\u0006\u0014\ufff0\u001c\ufff0\u0001\u0002\u0000,\u0002￫\u0003￫\u0004￫\u0006￫\b￫\u000e￫\u0011￫\u0015￫\u0016￫\u0017￫\u0018￫\u0019￫\u001a￫\u001b￫$￫&￫\'￫(￫)￫*￫+￫\u0001\u0002\u0000\u0004\u001ei\u0001\u0002\u0000,\u0002\ufff3\u0003\ufff3\u0004\ufff3\u0006\ufff3\b\ufff3\u000e\ufff3\u0011\ufff3\u0015\ufff3\u0016\ufff3\u0017\ufff3\u0018\ufff3\u0019\ufff3\u001a\ufff3\u001b\ufff3$\ufff3&\ufff3\'\ufff3(\ufff3)\ufff3*\ufff3+\ufff3\u0001\u0002\u0000,\u0002￬\u0003￬\u0004￬\u0006￬\b￬\u000e￬\u0011￬\u0015￬\u0016￬\u0017￬\u0018￬\u0019￬\u001a￬\u001b￬$￬&￬\'￬(￬)￬*￬+￬\u0001\u0002\u0000\n\u0007k\u0014\uffef\u001c\uffef$E\u0001\u0002\u0000\u0006\u0014￭\u001c￭\u0001\u0002\u0000,\u0002\ufff2\u0003\ufff2\u0004\ufff2\u0006\ufff2\b\ufff2\u000e\ufff2\u0011\ufff2\u0015\ufff2\u0016\ufff2\u0017\ufff2\u0018\ufff2\u0019\ufff2\u001a\ufff2\u001b\ufff2$\ufff2&\ufff2\'\ufff2(\ufff2)\ufff2*\ufff2+\ufff2\u0001\u0002');
  protected static readonly _reduce_table = LRParser.unpackFromStrings('\u0000j\u0000\u0004\u0006\u0004\u0001\u0001\u0000\u0004\u0003\u0007\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0004\u0004\t\u0001\u0001\u0000\b\u0005M\u000fK\u0012N\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u000e\u0007\u0014\b\u0019\t\u001e\n!\u000b\u001c\u0011\u0015\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\n\tI\n!\u000b\u001c\u0011\u0015\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\n\tG\n!\u000b\u001c\u0011\u0015\u0001\u0001\u0000\u000e\u0007C\b\u0019\t\u001e\n!\u000b\u001c\u0011\u0015\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\n\tB\n!\u000b\u001c\u0011\u0015\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\b\r$\u0010)\u0011#\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\b\r$\u00109\u0011#\u0001\u0001\u0000\b\r$\u00105\u0011#\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0006\r/\u0011.\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\b\r$\u00107\u0011#\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0006\r/\u0011.\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0006\r/\u0011.\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0006\r/\u0011.\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\f\bF\t\u001e\n!\u000b\u001c\u0011\u0015\u0001\u0001\u0000\u0002\u0001\u0001\u0000\n\tG\n!\u000b\u001c\u0011\u0015\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0004\u0013_\u0001\u0001\u0000\u0004\u000eY\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0006\u0005P\u000fK\u0001\u0001\u0000\u0004\u000eQ\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0004\u000eT\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\b\u0005M\u000fK\u0012W\u0001\u0001\u0000\u0006\u0005P\u000fK\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\b\u0005M\u000fK\u0012\\\u0001\u0001\u0000\u0006\u0005P\u000fK\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u000e\u0007a\b\u0019\t\u001e\n!\u000b\u001c\u0011\u0015\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0004\fc\u0001\u0001\u0000\u000e\u0007i\b\u0019\t\u001e\n!\u000b\u001c\u0011\u0015\u0001\u0001\u0000\u0004\u0014g\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001\u0000\u0002\u0001\u0001');
  public scanner: LexScan;
  protected action_obj: LexParseActions;
  
  public constructor (s?) {
    super(s);
    // this.scanner = s;
  }
  
  public production_table () {
    return LexParse._production_table;
  }
  
  public action_table () {
    return LexParse._action_table;
  }
  
  public reduce_table () {
    return LexParse._reduce_table;
  }
  
  public do_action (act_num, parser, stack, top): Symbol {
    return this.action_obj.do_action(act_num, parser, stack, top);
  }
  
  public start_state () {
    return 0;
  }
  
  public start_production () {
    return 0;
  }
  
  public EOF_sym () {
    return 0;
  }
  
  public error_sym () {
    return 1;
  }
  
  public user_init () {
    this.action_obj.scanner = this.scanner;
  }
  
  public getCharClasses () {
    return this.action_obj.charClasses;
  }
  
  public getEOFActions (): EOFActions {
    return this.action_obj.eofActions;
  }
  
  public report_error (message, info) {
    if (info instanceof Symbol) {
      const s = <Symbol>info;
      if (s.sym === 0) {
        console.log(ErrorMessages.UNEXPECTED_EOF);
      } else {
        // console.log(this.scanner.file, ErrorMessages.SYNTAX_ERROR, s.left, s.right);
      }
    } else {
      console.log(ErrorMessages.UNKNOWN_SYNTAX);
    }
    
  }
  
  public report_fatal_error (message, info) {
    throw new Error('GeneratorException()');
  }
  
  protected init_actions () {
    this.action_obj = new LexParseActions(this);
  }
}
