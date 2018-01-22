export class Constants {
  static ExprCodeDefault = `package ast;

import java.util.ArrayList;

import soot.Local;
import soot.Scene;
import soot.SootClass;
import soot.SootMethodRef;
import soot.Type;
import soot.Unit;
import soot.Value;
import soot.jimple.Constant;
import soot.jimple.IntConstant;
import soot.jimple.Jimple;
import soot.jimple.NopStmt;
import soot.jimple.StaticInvokeExpr;
import soot.jimple.StringConstant;
import soot.util.Chain;
import ast.AddExpr;
import ast.ArrayIndex;
import ast.ArrayLiteral;
import ast.Assignment;
import ast.BinaryExpr;
import ast.BooleanLiteral;
import ast.Call;
import ast.CompExpr;
import ast.DivExpr;
import ast.EqExpr;
import ast.Expr;
import ast.FunctionDeclaration;
import ast.GeqExpr;
import ast.GtExpr;
import ast.IntLiteral;
import ast.LeqExpr;
import ast.LtExpr;
import ast.ModExpr;
import ast.Module;
import ast.MulExpr;
import ast.NegExpr;
import ast.NeqExpr;
import ast.Parameter;
import ast.StringLiteral;
import ast.SubExpr;
import ast.VarDecl;
import ast.VarName;
import ast.Visitor;

/**
 * This class is in charge of creating Jimple code for a given expression (and its nested
 * expressions, if applicable).
 */
public class ExprCodeGenerator extends Visitor<Value> {
	/** The {@link FunctionCodeGenerator} that instantiated this object. */
	private final FunctionCodeGenerator fcg;
	
	/** We cache the statement list of the enclosing function for convenience. */
	private final Chain<Unit> units;
	
	private ExprCodeGenerator(FunctionCodeGenerator fcg) {
		this.fcg = fcg;
		this.units = fcg.getBody().getUnits();
	}
	
	/**
	 * Ensures that the given value can be used as an operand; that is, if the
	 * value is not a {@link Local} or a {@link Constant}, this method allocates
	 * a new temporary variable and stores the value into that temporary.
	 */
	private Value wrap(Value v) {
		if(v == null || v instanceof Local || v instanceof Constant) {
			return v;
		} else {
			Local temp = fcg.mkTemp(v.getType());
			units.add(Jimple.v().newAssignStmt(temp, v));
			return temp;
		}
	}

	/**
	 * Convenience method to generate code for an expression and wrap it.
	 */
	public static Value generate(Expr expr, FunctionCodeGenerator fcg) {
		ExprCodeGenerator gen = new ExprCodeGenerator(fcg);
		return gen.wrap(expr.accept(gen));
	}
	
	/** Generate code for an assignment. */
	@Override
	public Value visitAssignment(Assignment nd) {
		// note that the left hand side should _not_ be wrapped!
		Value lhs = nd.getLHS().accept(this),
			  rhs = wrap(nd.getRHS().accept(this));
		units.add(Jimple.v().newAssignStmt(lhs, rhs));
		return rhs;
	}
	
	/** Generate code for an integer literal. */
	@Override
	public Value visitIntLiteral(IntLiteral nd) {
		/* TODO: return something meaningful here */
		//TO DO
	}
	
	/** Generate code for a string literal. */
	@Override
	public Value visitStringLiteral(StringLiteral nd) {
		/* TODO: return something meaningful here */
		//TO DO
	}
	
	/** Generate code for a Boolean literal. */
	@Override
	public Value visitBooleanLiteral(BooleanLiteral nd) {
		/* TODO: return something meaningful here (hint: translate 'true' to integer
		 *       constant 1, 'false' to integer constant 0) */
		//TO DO
	}
	
	/** Generate code for an array literal. */
	@Override
	public Value visitArrayLiteral(ArrayLiteral nd) {
		Type elttp = SootTypeUtil.getSootType(nd.getElement(0).type());
		// create a new array with the appropriate number of elements
		Value array = wrap(Jimple.v().newNewArrayExpr(elttp, IntConstant.v(nd.getNumElement())));
		for(int i=0;i<nd.getNumElement();++i) {
			// generate code to store the individual expressions into the elements of the array
			Value elt = wrap(nd.getElement(i).accept(this));
			units.add(Jimple.v().newAssignStmt(Jimple.v().newArrayRef(array, IntConstant.v(i)), elt));
		}
		return array;
	}
	
	/** Generate code for an array index expression. */
	@Override
	public Value visitArrayIndex(ArrayIndex nd) {
		/* TODO: generate code for array index */
		//TO DO
	}
	
	/** Generate code for a variable name. */
	@Override
	public Value visitVarName(VarName nd) {
		VarDecl decl = nd.decl();
		// determine whether this name refers to a local or to a field
		if(decl.isLocal()) {
			return fcg.getSootLocal(decl);
		} else {
			SootClass declaringClass = fcg.getModuleCodeGenerator().getProgramCodeGenerator().getSootClass(decl.getModule());
			Type fieldType = SootTypeUtil.getSootType(decl.getTypeName().getDescriptor());
			return Jimple.v().newStaticFieldRef(Scene.v().makeFieldRef(declaringClass, decl.getName(), fieldType, true));
		}
	}
	
	/** Generate code for a binary expression. */
	@Override
	public Value visitBinaryExpr(BinaryExpr nd) {
		/* TODO: generate code for binary expression here; you can either use a visitor
		 *       to determine the type of binary expression you are dealing with, or
		 *       generate code in the more specialised visitor methods visitAddExpr,
		 *       visitSubExpr, etc., instead
		 */
		//TO DO
	}
	
	/** Generate code for a comparison expression. */
	@Override
	public Value visitCompExpr(CompExpr nd) {
		final Value left = wrap(nd.getLeft().accept(this)),
					right = wrap(nd.getRight().accept(this));
		Value res = nd.accept(new Visitor<Value>() {
			@Override
			public Value visitEqExpr(EqExpr nd) {
				return Jimple.v().newEqExpr(left, right);
			}
			@Override
			public Value visitNeqExpr(NeqExpr nd) {
				return Jimple.v().newNeExpr(left, right);
			}
			@Override
			public Value visitLtExpr(LtExpr nd) {
				return Jimple.v().newLtExpr(left, right);
			}
			@Override
			public Value visitGtExpr(GtExpr nd) {
				return Jimple.v().newGtExpr(left, right);
			}
			@Override
			public Value visitLeqExpr(LeqExpr nd) {
				return Jimple.v().newLeExpr(left, right);
			}
			@Override
			public Value visitGeqExpr(GeqExpr nd) {
				return Jimple.v().newGeExpr(left, right);
			}
		});
		// compute a result of 0 or 1 depending on the truth value of the expression
		Local resvar = fcg.mkTemp(SootTypeUtil.getSootType(nd.type()));
		units.add(Jimple.v().newAssignStmt(resvar, IntConstant.v(1)));
		NopStmt join = Jimple.v().newNopStmt();
		units.add(Jimple.v().newIfStmt(res, join));
		units.add(Jimple.v().newAssignStmt(resvar, IntConstant.v(0)));
		units.add(join);
		return resvar;
	}
	
	/** Generate code for a negation expression. */
	@Override
	public Value visitNegExpr(NegExpr nd) {
		/* TODO: generate code for negation expression */
		//TO DO
	}
	
	/** Generate code for a function call. */
	@Override
	public Value visitCall(Call nd) {
		String calleeName = nd.getCallee().getName();
		FunctionDeclaration calleeDecl = nd.getCallTarget();
		Module calleeModule = calleeDecl.getModule();
		ArrayList<Type> parmTypes = new ArrayList<Type>(calleeDecl.getNumParameter());
		for(Parameter parm : calleeDecl.getParameters())
			parmTypes.add(SootTypeUtil.getSootType(parm.type()));
		Type rettp = SootTypeUtil.getSootType(calleeDecl.getReturnType().getDescriptor());
		
		// compute reference to callee
		SootClass calleeSootClass = fcg.getModuleCodeGenerator().getProgramCodeGenerator().getSootClass(calleeModule);
		SootMethodRef callee = Scene.v().makeMethodRef(calleeSootClass, calleeName, parmTypes, rettp, true);
		
		// prepare arguments
		Value[] args = new Value[nd.getNumArgument()];
		for(int i=0;i<args.length;++i)
			args[i] = wrap(nd.getArgument(i).accept(this));
		
		// assemble invoke expression
		StaticInvokeExpr invk = Jimple.v().newStaticInvokeExpr(callee, args);
		
		// decide what to do with the result
		if(rettp == soot.VoidType.v()) {
			units.add(Jimple.v().newInvokeStmt(invk));
			return null;
		} else {
			Local res = fcg.mkTemp(rettp);
			units.add(Jimple.v().newAssignStmt(res, invk));
			return res;
		}
	}
}`;
  static StmtCodeDefault = `package ast;

import java.util.HashMap;

import soot.Unit;
import soot.Value;
import soot.jimple.IntConstant;
import soot.jimple.Jimple;
import soot.jimple.NopStmt;
import soot.util.Chain;
import ast.Block;
import ast.BreakStmt;
import ast.ExprStmt;
import ast.IfStmt;
import ast.ReturnStmt;
import ast.Stmt;
import ast.Visitor;
import ast.WhileStmt;

/**
 * This class is in charge of creating Jimple code for a given statement (and its nested
 * statements, if applicable).
 */
public class StmtCodeGenerator extends Visitor<Void> {
	/** Cache Jimple singleton for convenience. */
	private final Jimple j = Jimple.v();
	
	/** The {@link FunctionCodeGenerator} that created this object. */
	private final FunctionCodeGenerator fcg;
	
	/** The statement list of the enclosing function body. */
	private final Chain<Unit> units;
	
	/** A map from while statements to their break target. */
	private final HashMap<WhileStmt, Unit> breakTargets = new HashMap<WhileStmt, Unit>();
	
	public StmtCodeGenerator(FunctionCodeGenerator fcg) {
		this.fcg = fcg;
		this.units = fcg.getBody().getUnits();
	}
	
	/** Generates code for an expression statement. */
	@Override
	public Void visitExprStmt(ExprStmt nd) {
		ExprCodeGenerator.generate(nd.getExpr(), fcg);
		return null;
	}
	
	/** Generates code for a break statement. */
	@Override
	public Void visitBreakStmt(BreakStmt nd) {
		/* TODO: generate code for break statement (hint: use ASTNode.getEnclosingLoop and breakTargets;
		 *       use units.add() to insert the statement into the surrounding method) */
		//TO DO
	}

	/** Generates code for a block of statements. */
	@Override
	public Void visitBlock(Block nd) {
		for(Stmt stmt : nd.getStmts())
			stmt.accept(this);
		return null;
	}
	
	/** Generates code for a return statement. */
	@Override
	public Void visitReturnStmt(ReturnStmt nd) {
		Unit stmt;
		if(nd.hasExpr())
			stmt = j.newReturnStmt(ExprCodeGenerator.generate(nd.getExpr(), fcg));
		else
			stmt = j.newReturnVoidStmt();
		units.add(stmt);
		return null;
	}
	
	/** Generates code for an if statement. */
	@Override
	public Void visitIfStmt(IfStmt nd) {
		Value cond = ExprCodeGenerator.generate(nd.getExpr(), fcg);
		NopStmt join = j.newNopStmt();
		units.add(j.newIfStmt(j.newEqExpr(cond, IntConstant.v(0)), join));
		nd.getThen().accept(this);
		if(nd.hasElse()) {
			NopStmt els = join;
			join = j.newNopStmt();
			units.add(j.newGotoStmt(join));
			units.add(els);
			nd.getElse().accept(this);
		}
		units.add(join);
		return null;
	}
	
	/** Generates code for a while statement. */
	@Override
	public Void visitWhileStmt(WhileStmt nd) {
		/* TODO: generate code for while statement as discussed in lecture; add the NOP statement you
		 *       generate as the break target to the breakTargets map
		 */
		//TO DO
	}
}
`;
  static testDefault = `package ast;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.io.StringReader;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashMap;
import java.util.Map;

import ast.ProgramCodeGenerator;

import org.junit.Assert;
import lexer.Lexer;
import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;
import parser.Parser;
import soot.Printer;
import soot.SootClass;
import soot.jimple.JasminClass;
import soot.util.JasminOutputStream;

/**
 * System tests for the compiler: compiles a given program to Java bytecode, then immediately
 * loads it into the running JVM and executes it.
 */
public class CompilerTests {
  // set this flag to true to dump generated Jimple code to standard output
  private static final boolean DEBUG = false;
  public static void main(String[] args){
    String output = "";
    Result result = JUnitCore.runClasses(CompilerTests.class);
    for (Failure failure : result.getFailures()) {
      output += (failure.toString()+"\\n");
    }
    output += (result.wasSuccessful() +"\\n");
    System.out.println(output);
    return ;
  }
  /**
   * A simple class loader that allows us to directly load compiled classes.
   */
  private static class CompiledClassLoader extends URLClassLoader {
    private final Map<String, byte[]> classes = new HashMap<String, byte[]>();

    public CompiledClassLoader() {
      super(new URL[0], CompilerTests.class.getClassLoader());
    }

    public void addClass(String name, byte[] code) {
      classes.put(name, code);
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
      if(classes.containsKey(name)) {
        byte[] code = classes.get(name);
        return defineClass(name, code, 0, code.length);
      }
      return super.findClass(name);
    }
  }

  /**
   * Test runner class.
   *
   * @param modules_src Array of strings, representing the source code of the program modules
   * @param main_module the name of the main module
   * @param main_function the name of the main function
   * @param parm_types the parameter types of the main function
   * @param args arguments to pass to the main method
   * @param expected expected result
   */
  private void runtest(String[] modules_src, String main_module, String main_function, Class<?>[] parm_types, Object[] args, Object expected) {
    try {
      List<Module> modules = new List<Module>();
      for(String module_src : modules_src) {
        Parser parser = new Parser();
        Module module = (Module)parser.parse(new Lexer(new StringReader(module_src)));
        modules.add(module);
      }
      Program prog = new Program(modules);

      prog.namecheck();
      prog.typecheck();
      prog.flowcheck();
      if(prog.hasErrors()) {
        Assert.fail(prog.getErrors().iterator().next().toString());
      }

      CompiledClassLoader loader = new CompiledClassLoader();
      try {
        for(SootClass klass : new ProgramCodeGenerator().generate(prog)) {
          if(DEBUG) {
            PrintWriter stdout_pw = new PrintWriter(System.out);
            Printer.v().printTo(klass, stdout_pw);
            stdout_pw.flush();
          }

          String name = klass.getName();
          ByteArrayOutputStream baos = new ByteArrayOutputStream();
          PrintWriter pw = new PrintWriter(new JasminOutputStream(baos));
          new JasminClass(klass).print(pw);
          pw.flush();
          loader.addClass(name, baos.toByteArray());
        }

        Class<?> testclass = loader.loadClass(main_module);
        Method method = testclass.getMethod(main_function, parm_types);
        Object actual = method.invoke(null, args);
        if(!method.getReturnType().equals(void.class))
          Assert.assertEquals(expected, actual);
      } finally {
        loader.close();
      }
    } catch(Exception e) {
      e.printStackTrace();
      Assert.fail(e.getMessage());
    } catch(ClassFormatError e) {
      e.printStackTrace();
      Assert.fail(e.getMessage());
    }
  }

  /** Convenience wrapper for runtest with only a single module. Other arguments are the same .*/
  private void runtest(String string, String classname, String methodname, Class<?>[] parmTypes, Object[] args, Object expected) {
    runtest(new String[] { string }, classname, methodname, parmTypes, args, expected);
  }

  @Test public void testAddition() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return 23+19;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      42);
  }

  @Test public void testSubtraction() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return 42-19;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      23);
  }

  @Test public void testMultiplication() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return 2*21;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      42);
  }

  @Test public void testDivision() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return 42/2;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      21);
  }

  @Test public void testPrecedence() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return 2+42/2;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      23);
  }

  @Test public void testParentheses() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return (2+42)/2;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      22);
  }

  @Test public void testNegation() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return -42;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      -42);
  }

  //Test Expressions
  @Test public void testNegInt() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return -42;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      -42);
  }

  @Test public void testPosInt() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return 35;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      35);
  }

  @Test public void testString() {
    runtest("module Test {" +
        "  public String f() {" +
        "    return \\"good luck!\\";" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      "good luck!");
  }

  @Test public void testBoolean() {
    runtest("module Test {" +
        "  public boolean f() {" +
        "    return false;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      false);
  }

  @Test public void testArrayIndex() {
    runtest("module Test {" +
        "  public int f() {" +
        "    int[] a;" +
        "    int b;" +
        "    int c;" +
        "	 b=2;" +
        "	 c=5;" +
        "    a = [2,4,6,7,-100,-20,b*c];" +
        "    return a[6];}" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      10);
  }

  @Test public void testAddExpr() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return 1+4;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      5);
  }

  @Test public void testSubExpr() {
    runtest("module Test {" +
        "  public int f() {" +
        "	 int a;" +
        "	 int b;" +
        "	 a=3;" +
        "	 b=4;" +
        "    return a*b;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      12);
  }

  @Test public void testMulExpr() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return 100*4;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      400);
  }

  @Test public void testDivExpr() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return -6/2;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      -3);
  }

  @Test public void testModExpr() {
    runtest("module Test {" +
        "  public int f() {" +
        "    return 5%2;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      1);
  }

  @Test public void testWhileStatement() {
    runtest("module Test {" +
        "  public int f() {" +
        "    int a;"+
        "    int b;"+
        "    a=40;"+
        "    b=24;"+
        "    while(a!=b){" +
        "    	if(a>b) a=a-b;" +
        "    	else b=b-a;" +
        "	 }"+
        "    return a;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      8);
  }

  @Test public void testBreakStatement() {
    runtest("module Test {" +
        "  public int f() {" +
        "    int a;"+
        "    a=40;"+
        "    while(true){" +
        "    	a=a-1;" +
        "    	if(a==4) break;"+
        "	 }"+
        "    return a;" +
        "  }" +
        "}",
      "Test",
      "f",
      new Class<?>[0],
      new Object[0],
      4);
  }
  //TO DO
}`;
}
