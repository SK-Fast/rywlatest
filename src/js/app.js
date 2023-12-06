// Import Vue
import { createApp } from 'vue';
import { loadFromPreferences } from "./lib/stdsession.js"

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.vue';
import store from "./store.js"

import PageEnd from '@/components/page-end.vue'
import ChipIcon from '@/components/chip-icon.vue'

import Logger from "js-logger"

import platform from "platform"

import { Capacitor } from '@capacitor/core';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init App
const app = createApp(App);

// Register Framework7 Vue components
registerComponents(app);

app.component('page-end', PageEnd);
app.component('chip-icon', ChipIcon);

Logger.useDefaults()
Logger.setHandler(Logger.createDefaultHandler({
    formatter: function (messages, context) {
        messages.unshift(`[${context.level.name}]`)
    }
}))

console.log("------------")
console.log(`%cRYW Latest ${__APP_VERSION__}`, "color:#FFC700; font-size:30px");
console.log("Github:", "https://github.com/SK-Fast/rywlatest")
console.log("IG:", "https://www.instagram.com/rywlatest/")
console.log("Licensed under MIT License")
console.log("------------")

const firebaseConfig = {
    apiKey: "AIzaSyDfTB_fOPDaYw2KCMCQ5aHJbO4DT4vb7ik",
    authDomain: "rywlatest.firebaseapp.com",
    projectId: "rywlatest",
    storageBucket: "rywlatest.appspot.com",
    messagingSenderId: "675000735085",
    appId: "1:675000735085:web:076602a4febe8c24def664",
    measurementId: "G-VW7KQ5L3NF",
};

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    window.darkMode = true
    document.querySelector("#theme-color-meta").setAttribute("content", "#121212")
}

async function preStartup() {
    Logger.info("Fetching app metadata...")

    const res = await fetch("https://rywlatest.web.app/app/meta.json")
    const metadata = await res.json()

    window.isNative = Capacitor.isNativePlatform()
    window.currentPlatform = platform.name
    window.isDesktop = (platform.os.family != "Android" && platform.os.family != "iOS")

    Logger.info("Running on", platform.name)
    Logger.info("OS:", platform.os.family)

    for (const [key, value] of Object.entries(metadata.storeData)) {
        store.state[key] = value
    }

    app.config.globalProperties.isDesktop = window.isDesktop
    app.config.globalProperties.isNative = window.isNative
    app.config.globalProperties.currentPlatform = window.currentPlatform

    if (window.isNative) {
        Logger.info("Connecting Directly...")

        window.rywlAPIs = {
            main: "https://rayongwit.ac.th",
            rywl: "https://rywlatest.web.app",
        }
    } else {
        Logger.info("Connecting via Proxy...")

        window.rywlAPIs = {
            main: "https://rywproxy.deno.dev",
            rywl: "https://rywlatest.web.app",
        }

        window.rywlUseProxy = true

        /*
        console.log("Registering Firebase FCM")
        navigator.serviceWorker.register('firebase-messaging-sw.js')

        console.log("Connecting Firebase...")
        initializeApp(firebaseConfig)
        */
    }

    Logger.info("Loading user preferences...")
    try { await loadFromPreferences() } catch (err) { Logger.error("Failed to load user data", err) }

    // Mount the app
    app.mount('#app')

    Logger.info("Application view mounted")
}

preStartup()