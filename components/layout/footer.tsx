import Container from "./container";

const Footer = () => {
  return (
    <footer>
      <Container>
        <div className="py-3 flex flex-col items-center justify-center py-5">
          <p className="font-black tracking-tighter leading-tight text-center">
            ©2023&nbsp;&nbsp;&nbsp;Hai
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
