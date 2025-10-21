
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const PORT = process.env.PORT || IS_PRODUCTION? 5174 : 5173;
export const BASE = process.env.BASE || '/'

export const CONSOLE_COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg_black: "\x1b[30m",
    fg_red: "\x1b[31m",
    fg_green: "\x1b[32m",
    fg_yellow: "\x1b[33m",
    fg_blue: "\x1b[34m",
    fg_magenta: "\x1b[35m",
    fg_cyan: "\x1b[36m",
    fg_white: "\x1b[37m",
    bg_black: "\x1b[40m",
    bg_red: "\x1b[41m",
    bg_green: "\x1b[42m",
    bg_yellow: "\x1b[43m",
    bg_blue: "\x1b[44m",
    bg_magenta: "\x1b[45m",
    bg_cyan: "\x1b[46m",
    bg_white: "\x1b[47m"
}