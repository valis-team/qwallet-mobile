import { useEffect } from "react";
import { NativeBaseProvider } from "native-base";
import RNFS from "react-native-fs";
import Toast from "react-native-toast-message";

import { Provider } from "react-redux";
import RootNavigation from "@app/navigation/RootNavigation";
import { store } from "@app/redux/store";
import { channelInit } from "@app/api/api";
import { AuthProvider } from "@app/context/AuthContext";
import { NetworkProvider } from "@app/context/NetworkContext";
import { SocketCom } from "@app/components/SocketComponent";
import { ColorProvider } from "@app/context/ColorContex";
import theme from "@app/utils/ThemeConfig";
import local from "@app/utils/locales";
import toastConfig from "@app/utils/ToastConfig";

local.setLanguage("en");

export default function App() {
  useEffect(() => {
    channelInit(RNFS.DocumentDirectoryPath);
  }, []);
  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketCom />
        <NetworkProvider defaultNetwork="mainnet">
          <NativeBaseProvider theme={theme}>
            <ColorProvider>
              <RootNavigation />
              <Toast config={toastConfig} />
            </ColorProvider>
          </NativeBaseProvider>
        </NetworkProvider>
      </AuthProvider>
    </Provider>
  );
}
