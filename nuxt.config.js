// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  router: {
    base: "/minecraft-openserver/",
  },
  typescript: {
    typeCheck: false,
    strict: false,
  },
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module"],
  vuetify: {
    moduleOptions: {},
    vuetifyOptions: {},
  },
  app: {
    head: {
      title: "Minecraft Server Helper",
    },
  },
});
