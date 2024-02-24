export default defineEventHandler(async (event) => {
  const ipRes = await fetch("https://ifconfig.co/ip", {
    method: "GET",
  });
  const ipTxt = (await ipRes.text()).trim();

  return ipTxt;
});
