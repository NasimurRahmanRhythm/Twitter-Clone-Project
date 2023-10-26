import "@/styles/globals.css";
import Layout from "@/components/Layout";
import LoginModal from "@/components/modals/LoginModal/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal/RegisterModal";
import { Toaster } from "react-hot-toast";
import EditModal from "@/components/modals/EditModal/EditModal";
import EditPostModal from "@/components/modals/EditPostModal/EditPostModal";
import { SocketProvider } from "@/providers/SocketProvider";
import { MessageProvider } from "@/providers/MessageProvider";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <SocketProvider>
        <MessageProvider>
          <Toaster />
          <EditModal />
          <LoginModal />
          <RegisterModal />
          <EditPostModal />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MessageProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
