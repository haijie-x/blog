const Footer = () => {
  return (
    <footer className="pb-5 pt-14 font-black tracking-tighter leading-tight text-center">
      <span>©2023&nbsp;&nbsp;&nbsp;Hai</span>
      <a
        href="https://github.com/haijie-x"
        className="underline hover:text-blue-600 duration-200 transition-colors mr-3 text-sm font-medium"
      >
        Github
      </a>
      <a
        href="https://juejin.cn/user/2419405559439229"
        className="underline hover:text-blue-600 duration-200 transition-colors mr-3 text-sm font-medium"
      >
        掘金
      </a>
      <a
        href="mailto:haijie0619@gmail.com"
        className="underline hover:text-blue-600 duration-200 transition-colors mr-3 text-sm font-medium"
      >
        Email
      </a>
      <a
        href="https://twitter.com/xihiji2"
        className="underline hover:text-blue-600 duration-200 transition-colors text-sm font-medium"
      >
        Twitter
      </a>
    </footer>
  );
};

export default Footer;
