// app/app.config.ts
import companyData from './data/company.json';

export default defineAppConfig({
    site: {
        name: 'NuxtCommerce',
        logoLight: 'logo_light.png',
        logoDark: 'logo_dark.png'
    },
    ui: {
        primary: 'blue',
        gray: 'neutral',
    },
    company: companyData,
    developer: {
        name: "rikp777",
        social: {
            linkedin: "https://www.linkedin.com/in/rik-peeters-708735252/",
        }
    },
});
