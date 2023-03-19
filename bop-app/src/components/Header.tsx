import { Link } from "react-router-dom";

import { H1 } from "./ui/Headings";

export function Header() {
  return (
    <div className="mb-6">
      <H1>
        <Link to="/">bop command builder</Link>
      </H1>
      <p className="font-bold text-red-800">
        This is a proof of concept, not even in alpha. Use at your own risks
      </p>
      <Link
        className="text-amber-600 transition-colors hover:text-amber-700 hover:underline"
        to="/"
      >
        Home
      </Link>
      {" - "}
      <Link
        className="text-amber-600 transition-colors hover:text-amber-700 hover:underline"
        to="/bft"
      >
        BFT
      </Link>
    </div>
  );
}
