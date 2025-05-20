import {createVuetify, ThemeInstance} from "vuetify";

import themeJson from '@/assets/material-theme.json' with {type: 'json'}
import {md3} from "vuetify/blueprints/md3";

import * as icons from "vuetify/lib/iconsets/mdi.mjs"

const themeInstance:ThemeInstance = {
    themes: {
        dark: {
            dark: true,
            colors: {
                'background': themeJson.schemes.dark.backgound,
                'on-background': themeJson.schemes.dark.onBackgound,
                "surface": themeJson.schemes.dark.surface,
                "on-surface": themeJson.schemes.dark.onSurface,
                ...themeJson.schemes.dark
            }
        },
        light: {
            dark: false,
            colors: {
                'background': themeJson.schemes.light.backgound,
                'on-background': themeJson.schemes.light.onBackgound,
                "surface": themeJson.schemes.light.surface,
                "on-surface": themeJson.schemes.light.onSurface,
                ...themeJson.schemes.light
            }
        }
    },
}

export default createVuetify({
    blueprint: md3,
    theme: {
        defaultTheme: 'light',
        themes: themeInstance.themes
    },
    icons: icons

})