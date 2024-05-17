import React, { useEffect, useState } from "react";
import { NativeBaseProvider } from "native-base";
import RNFS from "react-native-fs";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

import { Provider } from "react-redux";
import RootNavigation from "@app/navigation/RootNavigation";
import { store } from "@app/redux/store";
import { channelInit } from "@app/api/api";
import { AuthProvider } from "@app/context/AuthContext";
import { NetworkProvider } from "@app/context/NetworkContext";
import { SocketCom } from "@app/components/SocketComponent";
import { ColorProvider } from "@app/context/ColorContex";
import getTheme from "@app/utils/ThemeConfig";
import local from "@app/utils/locales";
import toastConfig from "@app/utils/ToastConfig";

interface ISettings {
  init: boolean;
  color: string;
  lang: string;
  network: "mainnet" | "testnet";
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [settings, setSettings] = useState<ISettings>({
    init: true,
    color: "dark",
    lang: "zh",
    network: "mainnet",
  });

  useEffect(() => {
    const prepareResources = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        // Load settings from AsyncStorage
        const lang = await AsyncStorage.getItem("language");
        const color = await AsyncStorage.getItem("color");
        const network = await AsyncStorage.getItem("network");
        const init = await AsyncStorage.getItem("init");

        // @ts-ignore
        setSettings((prev) => ({
          init: init || prev.init,
          lang: lang || prev.lang,
          color: color || prev.color,
          network: network || prev.network,
        }));

        channelInit(RNFS.DocumentDirectoryPath);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareResources();
  }, []);

  if (!appIsReady) {
    return null;
  }

  const theme = getTheme(settings.color);
  local.setLanguage(settings.lang);

  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketCom />
        <NetworkProvider defaultNetwork={settings.network}>
          <NativeBaseProvider theme={theme}>
            <ColorProvider>
              <RootNavigation init={settings.init} />
              <Toast config={toastConfig} />
            </ColorProvider>
          </NativeBaseProvider>
        </NetworkProvider>
      </AuthProvider>
    </Provider>
  );
}
