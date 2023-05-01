import dynamic from "next/dynamic";
import Link from "next/link";
const ThemeSwitchButton = dynamic(() => import("../theme-switch-button"), {
  ssr: false,
});

const Header = () => {
  return (
    <div className="flex justify-between py-8">
      <h2 className="text-pink-700 text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight">
        <Link href="/" className="hover:underline">
          Blog.
        </Link>
      </h2>
      <div>
        <ThemeSwitchButton />
      </div>
    </div>
  );
};

export default Header;
