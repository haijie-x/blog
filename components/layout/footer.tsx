import Container from "./container";

const Footer = () => {
  return (
    <footer>
      <Container>
        <div className="flex flex-col items-center justify-center pb-5 pt-14">
          <p className="font-black tracking-tighter leading-tight text-center">
            ©2023&nbsp;&nbsp;&nbsp;Hai
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
