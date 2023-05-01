import Footer from "./footer";
import Meta from "../layout/meta";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen bg-white">
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
