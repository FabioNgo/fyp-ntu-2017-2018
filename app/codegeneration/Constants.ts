export class Constants {
  static ExprCodeDefault = '\
    package ast;\n\
    \n\
    import java.util.ArrayList;\n\
    \n\
    import soot.Local;\n\
    import soot.Scene;\n\
    import soot.SootClass;\n\
    import soot.SootMethodRef;\n\
    import soot.Type;\n\
    import soot.Unit;\n\
    import soot.Value;\n\
    import soot.jimple.Constant;\n\
    import soot.jimple.IntConstant;\n\
    import soot.jimple.Jimple;\n\
    import soot.jimple.NopStmt;\n\
    import soot.jimple.StaticInvokeExpr;\n\
    import soot.jimple.StringConstant;\n\
    import soot.util.Chain;\n\
    \n\
    /**\n\
     * This class is in charge of creating Jimple code for a given expression (and its nested\n\
     * expressions, if applicable).\n\
     */\n\
    public class ExprCodeGenerator extends Visitor<Value> {\n\
      /** The {@link FunctionCodeGenerator} that instantiated this object. */\n\
      private final FunctionCodeGenerator fcg;\n\
    \n\
      /** We cache the statement list of the enclosing function for convenience. */\n\
      private final Chain<Unit> units;\n\
    \n\
      private ExprCodeGenerator(FunctionCodeGenerator fcg) {\n\
        this.fcg = fcg;\n\
        this.units = fcg.getBody().getUnits();\n\
      }\n\
    \n\
      /**\n\
       * Ensures that the given value can be used as an operand; that is, if the\n\
       * value is not a {@link Local} or a {@link Constant}, this method allocates\n\
       * a new temporary variable and stores the value into that temporary.\n\
       */\n\
      private Value wrap(Value v) {\n\
        if(v == null || v instanceof Local || v instanceof Constant) {\n\
          return v;\n\
        } else {\n\
          Local temp = fcg.mkTemp(v.getType());\n\
          units.add(Jimple.v().newAssignStmt(temp, v));\n\
          return temp;\n\
        }\n\
      }\n\
    \n\
      /**\n\
       * Convenience method to generate code for an expression and wrap it.\n\
       */\n\
      public static Value generate(Expr expr, FunctionCodeGenerator fcg) {\n\
        ExprCodeGenerator gen = new ExprCodeGenerator(fcg);\n\
        return gen.wrap(expr.accept(gen));\n\
      }\n\
    \n\
      /** Generate code for an assignment. */\n\
      @Override\n\
      public Value visitAssignment(Assignment nd) {\n\
        // note that the left hand side should _not_ be wrapped!\n\
        Value lhs = nd.getLHS().accept(this),\n\
          rhs = wrap(nd.getRHS().accept(this));\n\
        units.add(Jimple.v().newAssignStmt(lhs, rhs));\n\
        return rhs;\n\
      }\n\
    \n\
      /** Generate code for an integer literal. */\n\
      @Override\n\
      public Value visitIntLiteral(IntLiteral nd) {\n\
        /* TODO: return something meaningful here */\n\
        return IntConstant.v(nd.getValue());\n\
      }\n\
    \n\
      /** Generate code for a string literal. */\n\
      @Override\n\
      public Value visitStringLiteral(StringLiteral nd) {\n\
        /* TODO: return something meaningful here */\n\
        return StringConstant.v(nd.getValue());\n\
      }\n\
    \n\
      /** Generate code for a Boolean literal. */\n\
      @Override\n\
      public Value visitBooleanLiteral(BooleanLiteral nd) {\n\
        /* TODO: return something meaningful here (hint: translate \'true\' to integer\n\
         *       constant 1, \'false\' to integer constant 0) */\n\
        return nd.getValue() ? IntConstant.v(1) : IntConstant.v(0);\n\
      }\n\
    \n\
      /** Generate code for an array literal. */\n\
      @Override\n\
      public Value visitArrayLiteral(ArrayLiteral nd) {\n\
        Type elttp = SootTypeUtil.getSootType(nd.getElement(0).type());\n\
        // create a new array with the appropriate number of elements\n\
        Value array = wrap(Jimple.v().newNewArrayExpr(elttp, IntConstant.v(nd.getNumElement())));\n\
        for(int i=0;i<nd.getNumElement();++i) {\n\
          // generate code to store the individual expressions into the elements of the array\n\
          Value elt = wrap(nd.getElement(i).accept(this));\n\
          units.add(Jimple.v().newAssignStmt(Jimple.v().newArrayRef(array, IntConstant.v(i)), elt));\n\
        }\n\
        return array;\n\
      }\n\
    \n\
      /** Generate code for an array index expression. */\n\
      @Override\n\
      public Value visitArrayIndex(ArrayIndex nd) {\n\
        /* TODO: generate code for array index */\n\
        Value base = nd.getBase().accept(this), index = wrap(nd.getIndex().accept(this));\n\
        return Jimple.v().newArrayRef(base, index);\n\
      }\n\
    \n\
      /** Generate code for a variable name. */\n\
      @Override\n\
      public Value visitVarName(VarName nd) {\n\
        VarDecl decl = nd.decl();\n\
        // determine whether this name refers to a local or to a field\n\
        if(decl.isLocal()) {\n\
          return fcg.getSootLocal(decl);\n\
        } else {\n\
          SootClass declaringClass = fcg.getModuleCodeGenerator().getProgramCodeGenerator().getSootClass(decl.getModule());\n\
          Type fieldType = SootTypeUtil.getSootType(decl.getTypeName().getDescriptor());\n\
          return Jimple.v().newStaticFieldRef(Scene.v().makeFieldRef(declaringClass, decl.getName(), fieldType, true));\n\
        }\n\
      }\n\
    \n\
      /** Generate code for a binary expression. */\n\
      @Override\n\
      public Value visitBinaryExpr(BinaryExpr nd) {\n\
        /* TODO: generate code for binary expression here; you can either use a visitor\n\
         *       to determine the type of binary expression you are dealing with, or\n\
         *       generate code in the more specialised visitor methods visitAddExpr,\n\
         *       visitSubExpr, etc., instead\n\
         */\n\
        final Value left = wrap(nd.getLeft().accept(this)), right = wrap(nd.getRight().accept(this));\n\
        Value res = nd.accept(new Visitor<Value>(){\n\
          @Override\n\
          public Value visitAddExpr(AddExpr nd) {\n\
            return Jimple.v().newAddExpr(left,right);\n\
          }\n\
    \n\
          @Override\n\
          public Value visitSubExpr(SubExpr nd) {\n\
            return Jimple.v().newSubExpr(left,right);\n\
          }\n\
    \n\
          @Override\n\
          public Value visitMulExpr(MulExpr nd) {\n\
            return Jimple.v().newMulExpr(left, right);\n\
          }\n\
    \n\
          @Override\n\
          public Value visitDivExpr(DivExpr nd) {\n\
            return Jimple.v().newDivExpr(left, right);\n\
          }\n\
    \n\
          @Override\n\
          public Value visitModExpr(ModExpr nd) {\n\
            return Jimple.v().newRemExpr(left, right);\n\
          }\n\
        });\n\
        return res;\n\
      }\n\
    \n\
      /** Generate code for a comparison expression. */\n\
      @Override\n\
      public Value visitCompExpr(CompExpr nd) {\n\
        final Value left = wrap(nd.getLeft().accept(this)),\n\
          right = wrap(nd.getRight().accept(this));\n\
        Value res = nd.accept(new Visitor<Value>() {\n\
          @Override\n\
          public Value visitEqExpr(EqExpr nd) {\n\
            return Jimple.v().newEqExpr(left, right);\n\
          }\n\
          @Override\n\
          public Value visitNeqExpr(NeqExpr nd) {\n\
            return Jimple.v().newNeExpr(left, right);\n\
          }\n\
          @Override\n\
          public Value visitLtExpr(LtExpr nd) {\n\
            return Jimple.v().newLtExpr(left, right);\n\
          }\n\
          @Override\n\
          public Value visitGtExpr(GtExpr nd) {\n\
            return Jimple.v().newGtExpr(left, right);\n\
          }\n\
          @Override\n\
          public Value visitLeqExpr(LeqExpr nd) {\n\
            return Jimple.v().newLeExpr(left, right);\n\
          }\n\
          @Override\n\
          public Value visitGeqExpr(GeqExpr nd) {\n\
            return Jimple.v().newGeExpr(left, right);\n\
          }\n\
        });\n\
        // compute a result of 0 or 1 depending on the truth value of the expression\n\
        Local resvar = fcg.mkTemp(SootTypeUtil.getSootType(nd.type()));\n\
        units.add(Jimple.v().newAssignStmt(resvar, IntConstant.v(1)));\n\
        NopStmt join = Jimple.v().newNopStmt();\n\
        units.add(Jimple.v().newIfStmt(res, join));\n\
        units.add(Jimple.v().newAssignStmt(resvar, IntConstant.v(0)));\n\
        units.add(join);\n\
        return resvar;\n\
      }\n\
    \n\
      /** Generate code for a negation expression. */\n\
      @Override\n\
      public Value visitNegExpr(NegExpr nd) {\n\
        /* TODO: generate code for negation expression */\n\
        return Jimple.v().newNegExpr(wrap(nd.getOperand().accept(this)));\n\
      }\n\
    \n\
      /** Generate code for a function call. */\n\
      @Override\n\
      public Value visitCall(Call nd) {\n\
        String calleeName = nd.getCallee().getName();\n\
        FunctionDeclaration calleeDecl = nd.getCallTarget();\n\
        Module calleeModule = calleeDecl.getModule();\n\
        ArrayList<Type> parmTypes = new ArrayList<Type>(calleeDecl.getNumParameter());\n\
        for(Parameter parm : calleeDecl.getParameters())\n\
          parmTypes.add(SootTypeUtil.getSootType(parm.type()));\n\
        Type rettp = SootTypeUtil.getSootType(calleeDecl.getReturnType().getDescriptor());\n\
    \n\
        // compute reference to callee\n\
        SootClass calleeSootClass = fcg.getModuleCodeGenerator().getProgramCodeGenerator().getSootClass(calleeModule);\n\
        SootMethodRef callee = Scene.v().makeMethodRef(calleeSootClass, calleeName, parmTypes, rettp, true);\n\
    \n\
        // prepare arguments\n\
        Value[] args = new Value[nd.getNumArgument()];\n\
        for(int i=0;i<args.length;++i)\n\
          args[i] = wrap(nd.getArgument(i).accept(this));\n\
    \n\
        // assemble invoke expression\n\
        StaticInvokeExpr invk = Jimple.v().newStaticInvokeExpr(callee, args);\n\
    \n\
        // decide what to do with the result\n\
        if(rettp == soot.VoidType.v()) {\n\
          units.add(Jimple.v().newInvokeStmt(invk));\n\
          return null;\n\
        } else {\n\
          Local res = fcg.mkTemp(rettp);\n\
          units.add(Jimple.v().newAssignStmt(res, invk));\n\
          return res;\n\
        }\n\
      }\n\
    }\n';
  static StmtCodeDefault = '\
package ast;\n\
\n\
import java.util.HashMap;\n\
\n\
import soot.Unit;\n\
import soot.Value;\n\
import soot.jimple.IntConstant;\n\
import soot.jimple.Jimple;\n\
import soot.jimple.NopStmt;\n\
import soot.util.Chain;\n\
\n\
/**\n\
 * This class is in charge of creating Jimple code for a given statement (and its nested\n\
 * statements, if applicable).\n\
 */\n\
public class StmtCodeGenerator extends Visitor<Void> {\n\
\t/** Cache Jimple singleton for convenience. */\n\
\tprivate final Jimple j = Jimple.v();\n\
\n\
\t/** The {@link FunctionCodeGenerator} that created this object. */\n\
\tprivate final FunctionCodeGenerator fcg;\n\
\n\
\t/** The statement list of the enclosing function body. */\n\
\tprivate final Chain<Unit> units;\n\
\n\
\t/** A map from while statements to their break target. */\n\
\tprivate final HashMap<WhileStmt, Unit> breakTargets = new HashMap<WhileStmt, Unit>();\n\
\n\
\tpublic StmtCodeGenerator(FunctionCodeGenerator fcg) {\n\
\t\tthis.fcg = fcg;\n\
\t\tthis.units = fcg.getBody().getUnits();\n\
\t}\n\
\n\
\t/** Generates code for an expression statement. */\n\
\t@Override\n\
\tpublic Void visitExprStmt(ExprStmt nd) {\n\
\t\tExprCodeGenerator.generate(nd.getExpr(), fcg);\n\
\t\treturn null;\n\
\t}\n\
\n\
\t/** Generates code for a break statement. */\n\
\t@Override\n\
\tpublic Void visitBreakStmt(BreakStmt nd) {\n\
\t\t/* TODO: generate code for break statement (hint: use ASTNode.getEnclosingLoop and breakTargets;\n\
\t\t *       use units.add() to insert the statement into the surrounding method) */\n\
    Unit breakTarget = breakTargets.get(nd.getEnclosingLoop());\n\
    units.add(j.newGotoStmt(breakTarget));\n\
    return null;\n\
\t}\n\
\n\
\t/** Generates code for a block of statements. */\n\
\t@Override\n\
\tpublic Void visitBlock(Block nd) {\n\
\t\tfor(Stmt stmt : nd.getStmts())\n\
\t\t\tstmt.accept(this);\n\
\t\treturn null;\n\
\t}\n\
\n\
\t/** Generates code for a return statement. */\n\
\t@Override\n\
\tpublic Void visitReturnStmt(ReturnStmt nd) {\n\
\t\tUnit stmt;\n\
\t\tif(nd.hasExpr())\n\
\t\t\tstmt = j.newReturnStmt(ExprCodeGenerator.generate(nd.getExpr(), fcg));\n\
\t\telse\n\
\t\t\tstmt = j.newReturnVoidStmt();\n\
\t\tunits.add(stmt);\n\
\t\treturn null;\n\
\t}\n\
\n\
\t/** Generates code for an if statement. */\n\
\t@Override\n\
\tpublic Void visitIfStmt(IfStmt nd) {\n\
\t\tValue cond = ExprCodeGenerator.generate(nd.getExpr(), fcg);\n\
\t\tNopStmt join = j.newNopStmt();\n\
\t\tunits.add(j.newIfStmt(j.newEqExpr(cond, IntConstant.v(0)), join));\n\
\t\tnd.getThen().accept(this);\n\
\t\tif(nd.hasElse()) {\n\
\t\t\tNopStmt els = join;\n\
\t\t\tjoin = j.newNopStmt();\n\
\t\t\tunits.add(j.newGotoStmt(join));\n\
\t\t\tunits.add(els);\n\
\t\t\tnd.getElse().accept(this);\n\
\t\t}\n\
\t\tunits.add(join);\n\
\t\treturn null;\n\
\t}\n\
\n\
\t/** Generates code for a while statement. */\n\
\t@Override\n\
\tpublic Void visitWhileStmt(WhileStmt nd) {\n\
\t\t/* TODO: generate code for while statement as discussed in lecture; add the NOP statement you\n\
\t\t *       generate as the break target to the breakTargets map\n\
\t\t */\n\
    NopStmt label0 = j.newNopStmt();\n\
    units.add(label0);\n\
    NopStmt label1 = j.newNopStmt();\n\
    breakTargets.put(nd, label1);\n\
    Value cond = ExprCodeGenerator.generate(nd.getExpr(), fcg);\n\
    units.add(j.newIfStmt(j.newEqExpr(cond, IntConstant.v(0)), label1));\n\
    nd.getBody().accept(this);\n\
    units.add(j.newGotoStmt(label0));\n\
    units.add(label1);\n\
\t\treturn null;\n\
\t}\n\
}\n';
  static testDefault = '@Test\n\n public void testAddition() {\n\t\truntest("module Test {" +\n\t\t\t\t"  public int f() {" +\n\t\t\t\t"    return 23+19;" +\n\t\t\t\t"  }" +\n\t\t\t\t"}",\n\t\t\t\t"Test",\n\t\t\t\t"f",\n\t\t\t\tnew Class<?>[0],\n\t\t\t\tnew Object[0],\n\t\t\t\t42);\n\t}\n\n\t@Test\n public void testSubtraction() {\n\t\truntest("module Test {" +\n\t\t\t\t"  public int f() {" +\n\t\t\t\t"    return 42-19;" +\n\t\t\t\t"  }" +\n\t\t\t\t"}",\n\t\t\t\t"Test",\n\t\t\t\t"f",\n\t\t\t\tnew Class<?>[0],\n\t\t\t\tnew Object[0],\n\t\t\t\t23);\n\t}\n\n\t@Test\n public void testMultiplication() {\n\t\truntest("module Test {" +\n\t\t\t\t"  public int f() {" +\n\t\t\t\t"    return 2*21;" +\n\t\t\t\t"  }" +\n\t\t\t\t"}",\n\t\t\t\t"Test",\n\t\t\t\t"f",\n\t\t\t\tnew Class<?>[0],\n\t\t\t\tnew Object[0],\n\t\t\t\t42);\n\t}\n\n\t@Test\n public void testDivision() {\n\t\truntest("module Test {" +\n\t\t\t\t"  public int f() {" +\n\t\t\t\t"    return 42/2;" +\n\t\t\t\t"  }" +\n\t\t\t\t"}",\n\t\t\t\t"Test",\n\t\t\t\t"f",\n\t\t\t\tnew Class<?>[0],\n\t\t\t\tnew Object[0],\n\t\t\t\t21);\n\t}\n\n\t@Test\n public void testPrecedence() {\n\t\truntest("module Test {" +\n\t\t\t\t"  public int f() {" +\n\t\t\t\t"    return 2+42/2;" +\n\t\t\t\t"  }" +\n\t\t\t\t"}",\n\t\t\t\t"Test",\n\t\t\t\t"f",\n\t\t\t\tnew Class<?>[0],\n\t\t\t\tnew Object[0],\n\t\t\t\t23);\n\t}\n\n     @Test\n public void testParentheses() {\n\t\truntest("module Test {" +\n\t\t\t\t"  public int f() {" +\n\t\t\t\t"    return (2+42)/2;" +\n\t\t\t\t"  }" +\n\t\t\t\t"}",\n\t\t\t\t"Test",\n\t\t\t\t"f",\n\t\t\t\tnew Class<?>[0],\n\t\t\t\tnew Object[0],\n\t\t\t\t22);\n\t}\n\n\t@Test\n public void testNegation() {\n\t\truntest("module Test {" +\n\t\t\t\t"  public int f() {" +\n\t\t\t\t"    return -42;" +\n\t\t\t\t"  }" +\n\t\t\t\t"}",\n\t\t\t\t"Test",\n\t\t\t\t"f",\n\t\t\t\tnew Class<?>[0],\n\t\t\t\tnew Object[0],\n\t\t\t\t-42);\n\t}';
}
