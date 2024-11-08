import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

await i18next
.use(Backend)
.init({
    debug: true, // TODO Set depending on dev mode
    lng: 'en', // TODO Set language from .env
    fallbackLng: 'en',
    preload: ['en'],
    backend: {
        loadPath: "locales/{{lng}}/{{ns}}.json",
    },
});