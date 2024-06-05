import liveServer from "live-server";

let params = {
  port: "6969",
  root: "src/scripts/main/public",
  file: "index.html",
};

liveServer.start(params);
