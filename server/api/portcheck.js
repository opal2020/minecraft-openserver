import net from "net";

export default async function defineEventHandler(event) {
  const { port, ip } = getQuery(event);
  const portToCheck = port;

  const timeout = 5000; // 5 seconds

  await new Promise((resolve, reject) => {
    const client = net.createConnection(portToCheck, ip);

    client.setTimeout(timeout);

    client.on("connect", () => {
      setResponseStatus(event, 200, `Port ${portToCheck} is open`);
      client.end();
      resolve();
    });

    client.on("timeout", () => {
      setResponseStatus(
        event,
        502,
        `Timeout: Port ${portToCheck} is not reachable`
      );
      client.destroy();
      resolve();
    });

    client.on("error", (err) => {
      setResponseStatus(event, 504, `Error occured from server`);
      console.log(err);
      client.destroy();
      resolve();
    });
  });
}
