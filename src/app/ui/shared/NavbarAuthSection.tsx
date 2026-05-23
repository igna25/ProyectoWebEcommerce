"use client";
import { useSession } from "next-auth/react";
import BuysRecordButton from "./BuysRecordButton";
import UserMenu from "./UserMenu";
import LoginButton from "./LoginButton";

const NavbarAuthSection = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return session ? (
    <>
      <BuysRecordButton />
      <UserMenu
        userName={session.user?.name ?? session.user?.email ?? undefined}
      />
    </>
  ) : (
    <LoginButton />
  );
};

export default NavbarAuthSection;
