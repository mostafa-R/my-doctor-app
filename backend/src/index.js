import "dotenv/config";
import models, { sequelize } from "./models";
import app from "./app";

sequelize.sync().then(() => {
  app
    .listen(process.env.PORT, () => {
      console.log("Express is running");
    })
    .on("error", (e) => {
      console.log("error", e);
    });
});
