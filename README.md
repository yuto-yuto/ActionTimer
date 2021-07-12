# ActionTimer

A class to execute an action every specified msec. The functions are only `start`, `stop` and `notify`. `notify` function interrupts the timer and execute the specified action if the action isn't executing. It does nothing while the action is executing.
Use `QueuedActionTimer` if you want to execute the action after current action process is completed.

## Usage

```ts
const instance = new ActionTimer(1000);
const action = () => {
    // your function
}
instance.action = action;
instance.start();
// action is called when the callback returns true
// the timer starts from 0 again
instance.notify(() => true);
instance.stop();

// action isn't called while timer stops
instance.notify(() => true);
```

## Example output

See [example code](https://github.com/yuto-yuto/ActionTimer/blob/main/example/app.ts). It executes every second but it calls notify function after 2800 msec.

```bash
2021-07-12T04:29:51.358Z ---- timer start ----
2021-07-12T04:29:52.380Z call count: 1
2021-07-12T04:29:53.382Z call count: 2 // diff - 1000 msec
interrupt
2021-07-12T04:29:54.168Z call count: 3 // diff - 800 msec
2021-07-12T04:29:55.179Z call count: 4 // diff - 1000 msec
2021-07-12T04:29:56.249Z call count: 5 // diff - 1000 msec
2021-07-12T04:29:56.373Z ---- timer stop ----
```

