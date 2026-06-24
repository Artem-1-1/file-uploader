import { env } from "$env/dynamic/private";
import { ourFileRouter } from "$lib/server/uploadthing";
import { createRouteHandler } from "uploadthing/server";

const handler = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
})

export { handler as GET, handler as POST};