import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useLoading } from "@/participated/hooks/useLoading";
import { LoadingBar } from "@/participated/components/loading-bar/LoadingBar";
import { useEffect } from "react";
import { Router, useRouter } from "next/router";
import { ModalProvider } from "@/participated/contexts/modalContext";
import { ToastProvider } from "@/participated/contexts/ToastContext";
import { SocketProvider } from "@/main/Providers/SocketProvider";
import { MessageProvider } from "@/components/conversation/providers/message-provider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const loading = useLoading();
  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      loading.start();
    });
    Router.events.on("routeChangeComplete", (url) => {
      loading.complete();
    });
    Router.events.on("routeChangeError", (url) => {
      loading.complete();
    });
  }, [Router]);

  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <ModalProvider>
        <ToastProvider>
          <SocketProvider>
            <MessageProvider>
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  zIndex: 10,
                }}
              >
                <LoadingBar loading={loading.loading} />
              </div>
              <Component {...pageProps} key={router.asPath} />
            </MessageProvider>
          </SocketProvider>
        </ToastProvider>
      </ModalProvider>
    </SessionProvider>
  );
}
