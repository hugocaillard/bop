import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { parseProtocol } from "../bop/parse";
import { AbiDetails } from "../components/AbiDetails";
import { AbiForm } from "../components/AbiForm";
import { Disclaimer } from "../components/Disclaimer";
import { Header } from "../components/Header";

const exampleProtocol = `#d.42.fakeft:
  0: deploy&
    uint: id, word: name, uint: ?max|
  1: mint&
    uint: id, uint: ?amount|
  2: tranfert&
    uint: id, uint: amount, addr: ?to
`;

export function Home() {
  const [protocol, setProtocol] = useState(exampleProtocol);
  const [abi, setAbi] = useState<ReturnType<typeof parseProtocol> | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const protocolData = parseProtocol(protocol);
      setError(null);
      setIsValid(true);
      setAbi(protocolData);
    } catch (e: any) {
      setError(e.message);
      setIsValid(false);
    }
  }, [protocol]);

  return (
    <div>
      <Header />

      <p>This page allows to write and debug BOP protocols.</p>
      <p>
        If you want to know more about the BFT protocol, visit the{" "}
        <Link
          className="text-amber-600 transition-colors hover:text-amber-700 hover:underline"
          to="/bft"
        >
          BFT protocol
        </Link>{" "}
        page.
      </p>

      <div className="mt-6 w-full">
        <p>Edit the protocol below to see how the syntax is analysed.</p>
        <p>
          Find the BOP doc{" "}
          <a
            className="text-amber-600 transition-colors hover:text-amber-700 hover:underline"
            target="_blank"
            href="https://github.com/hugocaillard/bop"
          >
            here on GitHub
          </a>{" "}
          to write valid protocol.
        </p>
        <Disclaimer />
        <textarea
          className={clsx(
            "h-52 w-full rounded border-2 bg-neutral-700 px-8 py-4 font-mono text-neutral-200 outline-none",
            isValid ? "border-neutral-700" : "border-amber-700"
          )}
          onChange={(v) => setProtocol(v.target.value)}
          value={protocol}
        />
        {!isValid && (
          <p className="text-amber-700">Invalid protocol syntax ({error})</p>
        )}
      </div>
      {abi ? <AbiDetails abi={abi} /> : null}
      <hr className="my-6" />
      <p>
        Since protocols are well defined, it's possible to automatically
        generate protocol forms that output the command to inscribe on the
        blockchain to call the protocol.
      </p>
      {abi ? <AbiForm abi={abi} /> : null}
    </div>
  );
}
