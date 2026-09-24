import "./main.css";
import Main from "./game/Main";

async function start() {
  const main = new Main();
  await main.init();
}

start();