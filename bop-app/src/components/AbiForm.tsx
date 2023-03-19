import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";

import type { AbiMethod, ArgType, parseProtocol } from "../bop/parse";
import { Disclaimer } from "./Disclaimer";
import { ErrorBoundary } from "./ErrorBoundary";

type ArgValues = string | [string, string];

export function AbiForm({ abi }: { abi: ReturnType<typeof parseProtocol> }) {
  if (abi.methods.length === 0) return null;

  return (
    // @ts-ignore
    <ErrorBoundary fallBack={<p>Something went wrong, please refresh</p>}>
      <div className="mb-12 w-full">
        <Tabs.Root defaultValue={`tab${abi.methods[0].id}`}>
          <Tabs.List className="flex w-full" aria-label="">
            {abi.methods.map((m) => (
              <Tabs.Trigger
                className="flex-1 border border-gray-600 px-4 py-2 text-left transition-colors hover:bg-gray-100 data-[state=active]:bg-gray-200 data-[state=active]:text-amber-600 [&:not(:last-child)]:border-r-0"
                value={`tab${m.id}`}
                key={`trigger-${m.id}`}
              >
                {m.id}.{m.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {abi.methods.map((m) => (
            <Tabs.Content
              className="mb-6 px-4 py-2"
              value={`tab${m.id}`}
              key={`content-${m.id}`}
            >
              <MethodForm
                {...{
                  method: m,
                  protocolId: abi.id,
                }}
              />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </ErrorBoundary>
  );
}

function argsToString(args: ArgType[], values: (ArgValues | ArgValues[])[]) {
  return args.reduce((acc, a, i) => {
    let newValue = `${acc}`;
    if (i > 0) newValue += ",";

    if (!a.list) {
      if (a.tuple && (!!values[i][0] || !!values[i][0]))
        newValue += `[${values[i][0] || ""},${values[i][1] || ""}]`;
      else newValue += values[i];
    }

    if (
      a.list &&
      (values[i] as any[]).flatMap((v) => v).filter((v) => !!v).length
    ) {
      if (a.tuple && (!!values[i][0] || !!values[i][0]))
        newValue += `[${(values[i] as any[])
          .map((v) => `[${(v as string[]).join(",")}]`)
          .join(",")}]`;
      else newValue += `[${(values[i] as string[]).join(",")}]`;
    }
    return newValue;
  }, "");
}

function MethodForm({
  protocolId,
  method,
}: {
  protocolId: string;
  method: AbiMethod;
}) {
  const getInitialArgValues = () =>
    [...new Array(method.args.length)].map((_, i) => {
      if (method.args[i].list && method.args[i].tuple)
        return [["", ""]] as [string, string][];
      if (method.args[i].list) return [""];
      if (method.args[i].tuple) return ["", ""];
      return "";
    });

  const [argValues, setArgsValues] = useState<(ArgValues | ArgValues[])[]>(
    getInitialArgValues()
  );

  useEffect(() => {
    setArgsValues(getInitialArgValues());
  }, [method]);

  const handleArgValueChange = (index: number, value: string) => {
    setArgsValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleTupleArgValueChange = (
    index: number,
    tuplePos: number,
    value: string
  ) => {
    setArgsValues((prev) => {
      const next = [...prev];
      (next[index] as [string, string])[tuplePos] = value;
      return next;
    });
  };

  const handleListArgValueChange = (
    index: number,
    listIndex: number,
    value: string
  ) => {
    setArgsValues((prev) => {
      const next = [...prev];
      const nextListItem = [...next[index]];
      nextListItem[listIndex] = value;
      next[index] = nextListItem;
      return next;
    });
  };

  const handleListTupleArgValueChange = (
    index: number,
    listIndex: number,
    tuplePos: number,
    value: string
  ) => {
    setArgsValues((prev) => {
      const next = [...prev];
      const nextListItem = [...next[index]];
      (nextListItem[listIndex] as [string, string])[tuplePos] = value;
      return next;
    });
  };

  const handleAddEntry = (index: number) => {
    setArgsValues((prev) => {
      const next = [...prev];
      (next[index] as any[]).push("");
      return next;
    });
  };

  const handleAddTupleEntry = (index: number) => {
    setArgsValues((prev) => {
      const next = [...prev];
      (next[index] as any[]).push(["", ""]);
      return next;
    });
  };

  const handleRemoveEntry = (index: number, listIndex: number) => {
    setArgsValues((prev) => {
      const next = [...prev];
      (next[index] as any[]).splice(listIndex, 1);
      return next;
    });
  };

  let command = `#c.${protocolId}.${method.id}&${argsToString(
    method.args,
    argValues
  )}`;
  while (command.endsWith(",")) {
    command = command.slice(0, command.length - 1);
  }

  return (
    // @ts-ignore
    <ErrorBoundary fallBack={<p>Something went wrong, please refresh</p>}>
      <form className="min-h-[120px]">
        {method.args.map((a, i) => (
          <div className="my-4" key={`input-${method.id}-${i}`}>
            <label
              className="mr-2 inline-block font-bold"
              htmlFor={`input-${method.id}-${i}`}
            >
              {a.name}
              {!a.optional && "*"}:{" "}
            </label>

            {/* this code could be improved to better handle lists and tuple */}

            {/* string */}
            {!a.tuple && !a.list ? (
              <input
                id={`input-${method.id}-${i}`}
                name={`input-${method.id}-${i}`}
                value={argValues[i] as string}
                placeholder={a.typ as string}
                onChange={(e) => handleArgValueChange(i, e.target.value)}
                className="border border-neutral-300 px-1"
              />
            ) : null}

            {/* tuple */}
            {a.tuple && !a.list ? (
              <>
                <input
                  id={`input-${method.id}-${i}-0`}
                  name={`input-${method.id}-${i}-0`}
                  value={argValues[i][0] || ""}
                  placeholder={(a.typ[0] as ArgType).typ as string}
                  onChange={(e) =>
                    handleTupleArgValueChange(i, 0, e.target.value)
                  }
                  className="mr-1 border border-neutral-300 px-1"
                />
                <input
                  id={`input-${method.id}-${i}-1`}
                  name={`input-${method.id}-${i}-1`}
                  value={argValues[i][1] || ""}
                  placeholder={(a.typ[1] as ArgType).typ as string}
                  onChange={(e) =>
                    handleTupleArgValueChange(i, 1, e.target.value)
                  }
                  className="border border-neutral-300 px-1"
                />
              </>
            ) : null}

            {/* list but not tuple */}
            {!a.tuple && a.list && Array.isArray(argValues[i]) ? (
              <div>
                {(argValues[i] as ArgValues[]).map((v, j) => (
                  <div key={`input-${method.id}-${i}-${j}`}>
                    <input
                      value={v}
                      placeholder={a.typ as string}
                      onChange={(e) =>
                        handleListArgValueChange(i, j, e.target.value)
                      }
                      className="mr-1 inline-block border border-neutral-300 px-1"
                    />
                    <button
                      className="text-neutral-500 hover:text-neutral-900"
                      type="button"
                      onClick={() => handleRemoveEntry(i, j)}
                    >
                      - remove entry
                    </button>
                  </div>
                ))}
                <div>
                  <button
                    className="text-neutral-500 hover:text-neutral-900"
                    type="button"
                    onClick={() => handleAddEntry(i)}
                  >
                    + add entry
                  </button>
                </div>
              </div>
            ) : null}

            {/* list of tuples */}
            {a.tuple && a.list && Array.isArray(argValues[i]) ? (
              <div>
                {(argValues[i] as ArgValues[]).map((v, j) => (
                  <div key={`input-${method.id}-${i}-${j}`}>
                    <input
                      id={`input-${method.id}-${i}-${j}-0`}
                      name={`input-${method.id}-${i}-${j}-0`}
                      value={argValues[i][j][0] || ""}
                      placeholder={(a.typ[0] as ArgType).typ as string}
                      onChange={(e) =>
                        handleListTupleArgValueChange(i, j, 0, e.target.value)
                      }
                      className="mr-1 border border-neutral-300 px-1"
                    />
                    <input
                      id={`input-${method.id}-${i}-${j}-1`}
                      name={`input-${method.id}-${i}-${j}-1`}
                      value={argValues[i][j][1] || ""}
                      placeholder={(a.typ[1] as ArgType).typ as string}
                      onChange={(e) =>
                        handleListTupleArgValueChange(i, j, 1, e.target.value)
                      }
                      className="mr-1 inline-block border border-neutral-300 px-1"
                    />
                    <button
                      className=" text-neutral-500 hover:text-neutral-900"
                      type="button"
                      onClick={() => handleRemoveEntry(i, j)}
                    >
                      - remove entry
                    </button>
                  </div>
                ))}
                <div>
                  <button
                    className="text-neutral-500 hover:text-neutral-900"
                    type="button"
                    onClick={() => handleAddTupleEntry(i)}
                  >
                    + add entry
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </form>

      <Disclaimer />
      <pre className="bg-neutral-700 px-8 py-4 text-neutral-100">{command}</pre>
    </ErrorBoundary>
  );
}
