import { useCopyToClipboard } from "react-use";
import { parseProtocol } from "../bop/parse";
import { AbiForm } from "./AbiForm";
import { ErrorBoundary } from "./ErrorBoundary";

type ArgType = {
  name: string;
  typ: string | Tuple | List;
  optional: boolean;
};
type Tuple = [ArgType, ArgType];
type List = ArgType[];

export function BftInscription() {
  const content =
    "#d.0.bft.0:deploy&uint:id,word:name,uint:?max,[uint:duration-in-blocks,uint:mint-limit][]:?limits|1:mint&uint:id,uint:?amount|2:!tranfert&uint:id,uint:amount,addr:?to";

  const protocol = parseProtocol(content);
  const { id, name, methods } = protocol;

  useCopyToClipboard();
  return (
    // @ts-ignore
    <ErrorBoundary fallBack={<p>Something went wrong, please refresh</p>}>
      <div>
        <p>
          <b>id</b>: {id}, <b>name</b>: {name}
        </p>
        <p>
          View inscription on{" "}
          <a
            className="text-amber-600 transition-colors hover:text-amber-700 hover:underline"
            href="https://ordinals.hiro.so/inscription/2575466c50a2137ac12b8cfb55e38609018264cbb9b1b0091c56c8992b7d1917i0"
            target="_blank"
          >
            explorer.hiro.so
          </a>
        </p>
        <div className=" mt-6 max-w-2xl overflow-hidden rounded">
          <pre className="bg-neutral-700 px-8 py-4 text-neutral-200">
            <div>
              #d.{id}.{name}.
            </div>

            {methods.map((m, i) => (
              <div className="ml-4" key={m.id}>
                {m.id}:{m.name}&
                {m.args.map((arg, j) => (
                  <div className="ml-6" key={j}>
                    {!arg.tuple
                      ? `${arg.typ}${arg.list ? "[]" : ""}:${
                          arg.optional ? "?" : ""
                        }${arg.name}`
                      : null}

                    {arg.tuple
                      ? `${getTupleString(arg.typ as Tuple)}${
                          arg.list ? "[]" : ""
                        }:${arg.optional ? "?" : ""}${arg.name}`
                      : null}

                    {j < m.args.length - 1
                      ? ","
                      : i < methods.length - 1
                      ? "|"
                      : null}
                  </div>
                ))}
              </div>
            ))}
          </pre>
        </div>
        <hr className="my-6" />

        <p className="mb-6 font-bold">
          When deploying a BFT, Make sure the id and name are not already taken.
          <br />
          Be extra careful, there is no data validation, inscribe at your own
          risks.
        </p>

        <p className="mb-6">
          The form below is generated based on the BFT protocol as it is
          inscribed.
          <br />
          It can be used to generate the commands to inscribe in order to call
          the protocol.
        </p>

        <div>
          <AbiForm abi={protocol} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

function getTupleString(arg: Tuple) {
  return `[${arg[0].typ}:${arg[0].optional ? "?" : ""}${arg[0].name},${
    arg[1].typ
  }:${arg[1].optional ? "?" : ""}${arg[1].name}]`;
}
