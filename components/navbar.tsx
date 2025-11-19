import Link from "next/link";
import { History } from "./history";

export const Navbar = async () => {
  return (
    <div className="bg-white absolute top-0 left-0 w-dvw border-b dark:border-zinc-800 py-2 px-3 justify-between flex flex-row items-center dark:bg-zinc-900 z-30">
      <div className="flex flex-row gap-3 items-center">
        <History />
        <div className="text-sm dark:text-zinc-300">LakayAI Simple</div>
      </div>

      <Link
        href="login"
        className="text-sm p-1 px-2 bg-zinc-900 rounded-md text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Login
      </Link>
    </div>
  );
};
