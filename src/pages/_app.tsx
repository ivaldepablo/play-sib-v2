import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Play Sib v2 - Сибирская викторина</title>
        <meta name="description" content="Play Sib - Современная игра-викторина о торговой истории Томска и Сибири" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Comfortaa Font from Google Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Play Sib v2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Play Sib v2" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2dd4bf" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Play Sib v2 - Сибирская викторина" />
        <meta property="og:description" content="Проверьте свои знания о торговой истории Томска! Играйте в одиночку или дуэлью с друзьями." />
        <meta property="og:site_name" content="Play Sib v2" />
      </Head>
      
      <main className={`font-sans ${inter.variable} min-h-screen bg-gradient-to-br from-primary-400 via-secondary-500 to-purple-600`}>
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
