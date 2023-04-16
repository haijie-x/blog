const Intro = () => {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Blog.
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        <a
          href="https://github.com/haijie-x"
          className="underline hover:text-blue-600 duration-200 transition-colors mr-3"
        >
          Github
        </a>
        <a
          href="https://juejin.cn/user/2419405559439229"
          className="underline hover:text-blue-600 duration-200 transition-colors mr-3"
        >
          掘金
        </a>
        <a
          href="mailto:haijie0619@gmail.com"
          className="underline hover:text-blue-600 duration-200 transition-colors mr-3"
        >
          Email
        </a>
        <a
          href="https://twitter.com/xihiji2"
          className="underline hover:text-blue-600 duration-200 transition-colors"
        >
          Twitter
        </a>
      </h4>
    </section>
  );
};

export default Intro;
