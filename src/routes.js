import { Router } from "express";

const routes = new Router();

routes.get("/status", (request, response) => {
  return response.status(200).json({ message: "✅ API ⚙️ FUNCIONANDO!!! 🍔🚀" });
});

export default routes;
