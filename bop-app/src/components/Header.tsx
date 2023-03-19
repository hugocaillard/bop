import { Link } from "react-router-dom";

import { H1 } from "./ui/Headings";

export function Header() {
  return (
    <>
      <H1>
        <Link to="/">bop command builder</Link>
      </H1>
      <p className="font-bold text-red-800">
        This is a proof of concept, not even in alpha. Use at your own risks
      </p>
    </>
  );
}
