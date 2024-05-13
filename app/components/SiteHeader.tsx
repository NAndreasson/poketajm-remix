import { Form, Link } from "@remix-run/react";
import poketajm from "./image.png";
import { HeaderSearchBar } from "./HeaderSearchBar";

export function SiteHeader() {
  return (
    <header className="relative flex flex-none flex-wrap items-center border-black border-b-[40px] justify-between px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 sm:px-6 lg:px-8 dark:shadow-none dark:bg-transparent bg-red-800">
      <div className="mx-auto sm:px-2 lg:px-8 xl:px-12 w-full max-w-7xl relative flex flex-col md:flex-row flex-grow basis-0 items-center space-between">
        <div className="">
          <h1 className="text-4xl text-white">
            <a aria-label="Home page" href="/">
              <img src={poketajm} alt="Poketajm" className="h-40" />
            </a>
          </h1>
        </div>

        <HeaderSearchBar />
      </div>
      <div className="rounded-full bg-white border-black border-[10px] w-32 h-32 absolute bottom-[-80px] left-[45%]"></div>
    </header>
  );
}
