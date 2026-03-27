"use client";
import { useSession } from "next-auth/react";
import BuysRecordButton from "./BuysRecordButton";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

const NavbarAuthSection = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return session ? (
    <>
      <BuysRecordButton />
      <LogoutButton />
    </>
  ) : (
    <LoginButton />
  );
};

export default NavbarAuthSection;
