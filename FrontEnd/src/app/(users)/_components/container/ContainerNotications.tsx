"use client";
import React from "react";
import { Loading } from "@components/ui/loading";
import { motion } from "framer-motion";
import { variants } from "../aside/aside-trends";
import { UserCard } from "../user/user-card";
import { MainHeader } from "../home/main-header";
import { useRouter } from "next/navigation";
import NotificationMain from "../notification/notification-main";

const ContainerNotification = () => {
  const { back } = useRouter();

  const loading = false;
  return (
    <>
      <section>
        <motion.div className="mt-0.5" {...variants}>
          <NotificationMain />
        </motion.div>
      </section>
    </>
  );
};

export default ContainerNotification;
