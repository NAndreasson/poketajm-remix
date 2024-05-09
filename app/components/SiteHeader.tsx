import { Form, Link } from "@remix-run/react";
import poketajm from './image.png'

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

      <div className="py-16 sm:px-2 lg:relative lg:px-0 lg:py-20">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 lg:max-w-8xl lg:px-8 xl:gap-x-16 xl:px-12">
          {/* Add a search bar */}
          <Form id="search-form" action="/search" method="GET" role="search">
            <input
              type="search"
              placeholder="Search"
              name="q"
              className="p-2"
            />
            <button type="submit">Search</button>
          </Form>
        </div>
      </div>

      <Link to="/pokemons/new" className="rounded bg-white px-2 py-1 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
>
        Add pokemon
      </Link>

      <div className="rounded-full bg-white border-black border-[10px] w-32 h-32 absolute bottom-[-100px] left-[45%]">
      </div>
      </div>
    </header>
  );
}
