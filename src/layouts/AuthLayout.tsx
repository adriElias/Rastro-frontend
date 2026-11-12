import { HeartHandshake } from "lucide-react";
import { Outlet } from "react-router";
import { Logo } from "@/components/brand/logo";
import { communityStats } from "@/lib/data";

export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <main className="flex flex-col px-5 py-6 sm:px-10">
        <Logo className="self-start" />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <Outlet />
        </div>
      </main>
      <aside className="relative hidden overflow-hidden bg-secondary/30 lg:block">
        <img
          src="/images/auth.png"
          alt="A smiling person hugging their dog outdoors"
          loading="eager"
          fetchPriority="high"
          sizes="50vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-10 bottom-10 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur">
            <HeartHandshake className="size-4" aria-hidden="true" />
            {communityStats.reunited.toLocaleString("en-US")} pets reunited in Madrid
          </span>
          <p className="mt-4 max-w-md font-heading text-3xl font-extrabold leading-tight text-balance">
            “The whole neighbourhood looked for Bruno. Three days later, he was home.”
          </p>
          <p className="mt-2 font-semibold opacity-90">
            Lucía F. · RASTRO member since 2024
          </p>
        </div>
      </aside>
    </div>
  );
}
