import Container from "./container";
import { EXAMPLE_PATH } from "../../lib/constants";

const Footer = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-14 flex flex-col lg:flex-row items-center justify-center">
          <h3 className="text-4xl lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center lg:text-left lg:mb-0 lg:pr-4">
            ©2023&nbsp;&nbsp;&nbsp;Hai
          </h3>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
