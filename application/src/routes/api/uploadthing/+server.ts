import { UPLOADTHING_TOKEN } from "$env/static/private";
import { OurFileRouter } from "$lib/server/uploadthing";
import { createRouteHandler } from "uploadthing/server";

const handler = createRouteHandler({
  router: OurFileRouter,
  config: {
    token: UPLOADTHING_TOKEN,
  },
})

export { handler as GET, handler as POST};