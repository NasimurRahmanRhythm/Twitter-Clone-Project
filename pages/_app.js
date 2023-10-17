import "@/src/styles/globals.css";
import Layout from "@/src/components/Layout";
import LoginModal from "@/src/components/modals/LoginModal/LoginModal";
import RegisterModal from "@/src/components/modals/RegisterModal/RegisterModal";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import EditModal from "@/src/components/modals/EditModal/EditModal";
import EditPostModal from "@/src/components/modals/EditPostModal/EditPostModal";
import { SocketProvider } from "@/src/providers/SocketProvider";
import { MessageProvider } from "@/src/providers/MessageProvider";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Toaster />
      {/* <FollowerModal />
      <FollowingModal /> */}
      <EditModal />
      <LoginModal />
      <RegisterModal />
      <EditPostModal />
      <SocketProvider>
        <MessageProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MessageProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
