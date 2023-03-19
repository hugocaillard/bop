import { BftInscription } from "../components/BftInscription";
import { Header } from "../components/Header";
import { H2 } from "../components/ui/Headings";

export function Bft() {
  return (
    <div>
      <Header />
      <H2 className="">bft</H2>
      <BftInscription />
    </div>
  );
}
