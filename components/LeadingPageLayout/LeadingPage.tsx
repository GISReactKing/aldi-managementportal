import { ReactElement } from "react";
import Header from "./Header";
interface Props {
  children?: any;
}

function LeadingPage({ children }: Props): ReactElement {
  return (
    <div>
      <Header />
      <main className="h-auto max-w-screen-2xl mt-0 mb-0 mx-auto">
        {children}
      </main>
    </div>
  );
}

export default LeadingPage;
