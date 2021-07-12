import { ActionTimer } from "../lib/ActionTimer";

const instance = new ActionTimer(1000);
let count = 0;
const action = () => {
    count++;
    const now = new Date().toISOString();
    console.log(`${now} call count: ${count}`);
}
instance.action = action;

console.log(`${new Date().toISOString()} ---- timer start ----`);
instance.start();

const intervalTimer = setTimeout(() => {
    console.log("interrupt")
    instance.notify(() => true);
}, 2800);

setTimeout(() => {
    console.log(`${new Date().toISOString()} ---- timer stop ----`);
    instance.stop();
}, 5000);
