const Intro = () => {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Blog.
      </h1>
      <div className="text-center md:text-right mt-5 md:pl-8">
        <div className="font-thin text-lg">
          A front-end development engineer who is enthusiastic about full stack.
        </div>
        <a
          href="https://github.com/haijie-x"
          className="underline hover:text-blue-600 duration-200 transition-colors mr-3 text-sm font-black"
        >
          Github
        </a>
        <a
          href="https://juejin.cn/user/2419405559439229"
          className="underline hover:text-blue-600 duration-200 transition-colors mr-3 text-sm font-black"
        >
          掘金
        </a>
        <a
          href="mailto:haijie0619@gmail.com"
          className="underline hover:text-blue-600 duration-200 transition-colors mr-3 text-sm font-black"
        >
          Email
        </a>
        <a
          href="https://twitter.com/xihiji2"
          className="underline hover:text-blue-600 duration-200 transition-colors text-sm font-black"
        >
          Twitter
        </a>
      </div>
    </section>
  );
};

export default Intro;
