import styles from "./mainLayout.module.css";
import localFont from "next/font/local";
import { Navbar } from "@/participated/components/navbar/Navbar";
import { Modal } from "@/participated/components/modal/Modal";
import { AuthBottomBar } from "@/components/auth/components/auth-bottom-bar/AuthBottomBar";
import { useRouter } from "next/router";
import { LoginCard } from "@/components/auth/components/login/LoginCard";
import { SignupCard } from "@/components/user/components/signup/SignupCard";
import { AuthCard } from "@/components/auth/components/auth-card/AuthCard";
import { useSession } from "next-auth/react";

const roboto = localFont({
  src: [
    {
      path: "../../../public/fonts/Roboto-Bold.ttf",
      weight: "bold",
    },
    {
      path: "../../../public/fonts/Roboto-BoldItalic.ttf",
      weight: "700",
    },
    {
      path: "../../../public/fonts/Roboto-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../../public/fonts/Roboto-Regular.ttf",
      weight: "normal",
    },
  ],
});

export function MainLayout({ onNewTweet, children }) {
  const router = useRouter();
  const { page } = router.query;
  const { status } = useSession();
  const onClose = () => router.push("/", "", { shallow: true });
  return (
    <main className={styles.main + " " + roboto.className}>
      <aside className={styles.leftBar}>
        <Navbar onNewTweet={onNewTweet} />
      </aside>
      <div className={styles.content}>{children}</div>
      {page === "create-account" && (
        <Modal onClose={onClose}>
          <div style={{ padding: "0 20%" }}>
            <SignupCard />
          </div>
        </Modal>
      )}
      {page === "login" && (
        <Modal onClose={onClose}>
          <div style={{ padding: "0 20%" }}>
            <LoginCard />
          </div>
        </Modal>
      )}
      {page === "signup" && (
        <Modal onClose={onClose}>
          <div style={{ padding: "0 10%" }}>
            <AuthCard />
          </div>
        </Modal>
      )}
      {status === "unauthenticated" && <AuthBottomBar />}
    </main>
  );
}
