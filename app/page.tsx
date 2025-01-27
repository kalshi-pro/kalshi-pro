'use client';

import Link from 'next/link';
import { Vortex } from './components/ui/vortex';

export default function Home() {
  return (
    <div className="mx-auto h-full w-full overflow-hidden bg-black dark">
      <Vortex
        backgroundColor="black"
        rangeY={900}
        // particleCount={700}
        rangeRadius={2}
        baseHue={90}
        baseSpeed={4}
        className="flex h-screen w-full flex-col items-center justify-center px-2 py-4 md:px-10"
      >
        <div className="rounded-3xl bg-black/50 p-10 shadow-[0px_2px_0px_0px_#FFFFFF40_inset] backdrop-blur-lg">
          <h2 className="text-center text-2xl font-bold text-white md:text-6xl">
            Your Kalshi co-pilot
          </h2>
          <p className="mt-6 max-w-xl text-center text-sm text-white/80 md:text-xl">
            Open-source tools for trading on Kalshi. Get profit and loss data, trade history, and
            more.
          </p>
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-in">
              <button className="rounded-lg bg-green-600 px-4 py-2 font-bold text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] transition duration-200 hover:bg-green-700">
                Get Started
              </button>
            </Link>
            <Link href="https://github.com/openbook-hq/openbook" target="_blank">
              <button className="rounded-lg bg-black px-4 py-2 text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] hover:bg-white/20">
                Contribute
              </button>
            </Link>
          </div>
        </div>
      </Vortex>
    </div>
  );
}
