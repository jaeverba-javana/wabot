import fs from 'node:fs/promises'
import express from 'express'
import morgan from "morgan";
import cookieParser from 'cookie-parser';

import {BASE as base, IS_PRODUCTION as isProduction, CONSOLE_COLORS as CC} from "./server/utils/contants.js";
import { isAuthenticated } from './server/api/auth.js';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

app.use(express.json())
// Add cookie parser
app.use(cookieParser())

app.use(morgan((tokens, req, res) => {
  const status = (res.headersSent ? Boolean(res.header) : res.headersSent)
    ? res.statusCode
    : undefined;

  const statusColor = (status) => {
    switch (true) {
      case status >= 500:
        return CC.fg_red; // red
      case status >= 400:
        return CC.fg_yellow; // yellow
      case status >= 300:
        return CC.fg_cyan; // cyan
      case status >= 200:
        return CC.fg_green; // green
      default:
        return CC.reset; // no color
    }
  };

  // console.log(req);

  // console.log(req.headers["sec-ch-ua"]);

  const sac = [];

  for (
    const n of req.headers["sec-ch-ua"]?.match(
      /(?<=")[\w ]+(?=";)/g,
    ) ?? []
  ) {
    sac.push({
      name: n,
      version: ((new RegExp(`(?<="${n}";v=")[^"]+(?=")`)).exec(req.headers["sec-ch-ua"])[0] ?? ""),
    });
  }

  // console.log(sac);

  // console.log(req.useragent)
  // console.log(status)

  return [
    tokens.date(req, res, "clf"),
    "-",
    statusColor(status) + status + CC.reset,
    CC.fg_cyan + tokens.method(req, res) + CC.reset,
    tokens.url(req, res),
    "from: " + tokens.referrer(req, res),
    "-|-",
    // tokens['user-agent'](req, res), "-",
    (req.headers["sec-ch-ua"] && sac.length)
      ? sac.map((v) =>
        `${v.name.split(" ")[v.name.split(" ").length - 1]}:${v.version}`
      ).join(" ")
      // @ts-ignore: It works
      : `${req.useragent?.browser}:${req.useragent?.version}`,
    "-|-",
    tokens.res(req, res, "content-length") ?? "none",
    tokens["response-time"](req, res) && [
      "-",
      tokens["response-time"](req, res) + "ms",
    ].join(" "),
    // tokens['total-time'](req, res)
  ].join(" ");
}));

app.use((await import('./server/api/index.js')).default)

// Serve HTML
app.get('*all', async (req, res) => {

  const user = await isAuthenticated(req)

  const authExcluded = ["/login", "/signup"]
  
  
  if ((authExcluded.includes(req.originalUrl)) && user) res.redirect("/")
  else if (!(authExcluded.includes(req.originalUrl)) && !user) res.redirect("/login")
  else

  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.ts').render} */
    // let render

    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      // render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
    } else {
      template = templateHtml
      // render = (await import('./dist/server/entry-server.js')).render
    }

    // const rendered = await render(url)

    // const html = template
    //   .replace(`<!--app-head-->`, rendered.head ?? '')
    //   .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(template)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

export default app