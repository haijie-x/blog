import Container from "./container";

const Footer = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-3 flex flex-col lg:flex-row items-center justify-center">
          <p className=" font-bold tracking-tighter leading-tight text-center lg:text-left lg:mb-0 lg:pr-4">
            ©2023&nbsp;&nbsp;&nbsp;Hai
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
