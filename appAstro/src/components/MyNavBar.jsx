"use client";

import { Button, Navbar } from "flowbite-react";

export default function Component() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Perritos
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Inicio
        </Navbar.Link>
        <Navbar.Link href="/csr">Client Side Rendering</Navbar.Link>
        <Navbar.Link href="/ssr">Server Side Rendering</Navbar.Link>
        <Navbar.Link href="#">Static Site Generation</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
