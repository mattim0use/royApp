"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import {
  FaucetButton,
  RainbowKitCustomConnectButton,
} from "@/app/components/scaffold-eth";
import { useOutsideClick } from "@/app/hooks/aiu/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-yellow-200 text-green-800 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${
              isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"
            }`}
            onClick={() => {
              setIsDrawerOpen((prevIsOpenState) => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link
          href="/"
          passHref
          className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0"
        >
          <div className="flex relative w-10 h-10">
            <Image
              alt="SE2 logo"
              className="cursor-pointer rounded-xl"
              fill
              src="/RoyLogo.png"
            />
          </div>
          <div className="flex flex-col">
            {/* <span className="font-bold leading-tight">Scaffold-ETH</span>
                        <span className="text-xs">Ethereum dev stack</span> */}
          </div>
        </Link>
        <div className="overflow-hidden h-8 relative flex items-center">
          {" "}
          {/* Set the height to your preference */}
          <div className="animate-ticker font-pixellify font-bold whitespace-nowrap">
            <span className="mx-3">
              Roy is now LIVE! Can you be the best Roy?
            </span>
            <span className="mx-3">
              Lots of twists and turns in this one broh!
            </span>
            <span className="mx-3">Plan accordingly.</span>
            <span className="mx-3">~~Mint will start at 0.025 ETH~~</span>
            <span className="mx-3">
              After you mint you will be able to use the game, and do the
              craziest shit with your Roy!
            </span>
            <span className="mx-3">
              Be a Roy in the 1700s! Be a South American Roy! 100 years! Maybe
              your Roy makes the Scheswan Sauce! You can do *anything* with your
              Roy!
            </span>
          </div>
        </div>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
