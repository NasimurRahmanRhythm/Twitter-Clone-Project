import "@/src/styles/globals.css";
import Layout from "@/src/components/Layout";
import LoginModal from "@/src/components/modals/LoginModal/LoginModal";
import RegisterModal from "@/src/components/modals/RegisterModal/RegisterModal";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import EditModal from "@/src/components/modals/EditModal/EditModal";
import EditPostModal from "@/src/components/modals/EditPostModal/EditPostModal";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Toaster />
      <EditModal />
      <LoginModal />
      <RegisterModal />
      <EditPostModal />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
