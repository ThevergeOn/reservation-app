import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Reservation from "../components/ReservationCalendar"
export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      router.push("/login");
    }
  }, []);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 `}
    >

      <Reservation/>
    </main>
  );
}
