const declarationRe = /^\#d.(\d+).(\w+|\d+|-).(.*)/;
const tupleRe = /^\[(.*\w+|\d+)\]/;
const validTypeRe = /^(uint|int|addr|bool|word)$/;
const validNameRe = /^\w((\w|-)+)?\w$/; // starts and ends with [a-z0-9_], can contain - in the middle

// list and tuple tpyes should be better represented
// an enum would make more sense
export type ArgType = {
  name: string;
  typ: string | Tuple;
  optional: boolean;
  tuple: boolean;
  list: boolean;
};

export type AbiMethod = {
  id: number;
  name: string;
  args: ArgType[];
};

export type Tuple = [ArgType, ArgType];
export type List = ArgType[];

function isTuple(args: ArgType[]): args is Tuple {
  return args.length === 2;
}

function parseArgs(acc: ArgType[], rawArgs: string): ArgType[] {
  if (!rawArgs) throw new Error("Invalid method definition");
  let tuple = false;
  let tupleArgs: Tuple | null = null;

  if (rawArgs.startsWith("[")) {
    tuple = true;
    const [tupleString, tupleRawArgs] = rawArgs.match(tupleRe)!;
    rawArgs = rawArgs.replace(tupleString, "");
    const args = parseArgs([], tupleRawArgs);
    if (!isTuple(args)) {
      throw new Error("Invalid tuple definition");
    }
    tupleArgs = args;
  }

  const [first, ...rest] = rawArgs.split(",");
  const [rawTyp, rawName] = first.split(":");

  const list = rawTyp.endsWith("[]");
  const optional = rawName.startsWith("?");
  let typ: string | Tuple = rawTyp.replace("[]", "");
  const name = rawName.replace("?", "");

  if (tuple && tupleArgs) {
    typ = tupleArgs;
  }
  if (!tuple && !validTypeRe.test(rawTyp.replace("[]", ""))) {
    throw new Error(`Invalid type: ${typ}`);
  }
  if (!validNameRe.test(name)) throw new Error(`Invalid name: ${name}`);

  acc.push({ name, typ, optional, list, tuple });

  if (rest.length > 0) return parseArgs(acc, rest.join(","));
  return acc;
}

export function parseProtocol(rawString: string) {
  const rawProtocol = rawString
    .trim()
    .replaceAll(" ", "")
    .replaceAll("\t", "")
    .replaceAll("\n", "");

  if (!rawProtocol.startsWith("#d."))
    throw new Error("protocol should start with #d.");

  const [, id, name, rawMethods] = rawProtocol.match(declarationRe)!;
  const methods: AbiMethod[] = rawMethods.split("|").map((m) => {
    const [decl, rawArgs] = m.split("&");
    const [id, name] = decl.split(":");
    const args = parseArgs([], rawArgs);
    return { id: parseInt(id), name, args };
  });

  const uniqIds = [...new Set(methods.map((m) => m.id))];
  if (uniqIds.length !== methods.length)
    throw new Error("All methods IDs must be unique");
  const uniqNames = [...new Set(methods.map((m) => m.name))];
  if (uniqNames.length !== methods.length)
    throw new Error("All methods names must be unique");

  return { id, name, methods };
}
