'use client';
import { UserButton } from '@clerk/nextjs';
import { DashboardContext } from '../context/DashboardContextProvider';
import { useContext } from 'react';
import { IconBrandGithub, IconExchange } from '@tabler/icons-react';
import { Button } from '@heroui/react';
import Link from 'next/link';

const NAV_ELEMENTS = [
  {
    route: 'trades',
    displayName: 'Profit and Loss',
    icon: <IconExchange />,
  },
];

export const NavBar = () => {
  const { selectedSlot, setSelectedSlot } = useContext(DashboardContext);

  return (
    <div className="bg-navbar-background hidden h-screen w-[16rem] flex-col items-center justify-between px-6 py-6 sm:flex">
      <h1 className="mt-8 text-4xl font-black">OpenBook</h1>
      <ul className="mt-16 h-full w-full space-y-4 font-bold text-opacity-50">
        {NAV_ELEMENTS.map((element) => (
          <li
            key={element.route}
            className={`${
              selectedSlot === element.route
                ? 'bg-green-400 text-green-700 dark:bg-neutral-600 dark:text-white'
                : ''
            } flex w-full cursor-pointer flex-row gap-4 rounded-md bg-opacity-35 p-4`}
            onClick={() => setSelectedSlot(element.route)}
          >
            {element.icon}
            {element.displayName}
          </li>
        ))}
      </ul>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Link href="/sign-in" className="w-full">
          <Button className="w-full" startContent={<IconBrandGithub />}>
            Contribute{' '}
          </Button>
        </Link>
        <UserButton />
      </div>
    </div>
  );
};
