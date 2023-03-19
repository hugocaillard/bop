import { JSONTree } from "react-json-tree";

import type { ArgType, parseProtocol, Tuple } from "../bop/parse";

export function Args({ args }: { args: ArgType[] | Tuple }) {
  return (
    <>
      {args.map((a, i) => {
        return (
          <div className="ml-4 font-mono" key={i}>
            {a.name}: {a.list && <span>list of </span>}{" "}
            {a.tuple ? (
              <>
                tuple: <Args args={a.typ as Tuple} />
              </>
            ) : (
              (a.typ as string)
            )}
            {a.optional && <span className="font-sans">(optional)</span>}{" "}
          </div>
        );
      })}
    </>
  );
}

export function AbiDetails({ abi }: { abi: ReturnType<typeof parseProtocol> }) {
  return (
    <div className="mt-6">
      {abi ? (
        <div className="flex gap-4">
          <div className="flex-1">
            <p>
              {" "}
              id: <b className="font-mono">{abi.id}</b>
            </p>
            <p>
              name: <b className="font-mono">{abi.name}</b>
            </p>
            <div className="mt-2">
              <p>methods:</p>
              {abi.methods.map((m) => (
                <div className="ml-4 mt-2" key={m.id}>
                  <p>
                    method id: <b className="font-mono">{m.id}</b>
                  </p>
                  <p>
                    method name: <b className="font-mono">{m.name}</b>
                  </p>
                  <p>method arguments:</p>
                  <Args args={m.args} />
                </div>
              ))}
            </div>
          </div>
          <div className="hidden flex-1 md:block">
            <JSONTree
              data={abi}
              theme={{
                scheme: "colors",
                author: "mrmrs (http://clrs.cc)",
                base00: "#fff", // original is #111111
                base01: "#333333",
                base02: "#555555",
                base03: "#777777",
                base04: "#999999",
                base05: "#bbbbbb",
                base06: "#dddddd",
                base07: "#ffffff",
                base08: "#ff4136",
                base09: "#ff851b",
                base0A: "#ffdc00",
                base0B: "#2ecc40",
                base0C: "#7fdbff",
                base0D: "#0074d9",
                base0E: "#b10dc9",
                base0F: "#85144b",
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
