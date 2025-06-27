import { projectsRouter } from "@/modules/projects/server/prodedures";
import { createTRPCRouter } from "../init";

import { messagesRouter } from "@/modules/messages/server/prodedures";
export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
