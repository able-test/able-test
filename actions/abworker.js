addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request) {
  // Name of cookie
  const name = "experiment-0";

  // Fetch config file from Worker KV and assign to 'abConfig'
  const abConfig = await DATA_STORE.get("ab-config", { type: "json" });
  const host = request.headers.get("host");
  const controlUrl = request.url.replace(host, abConfig.controlUrl);
  const controlGA = abConfig.controlGA;
  const testUrl = request.url.replace(host, abConfig.testUrl);
  const testGA = abConfig.testGA;
  const cookie = request.headers.get("cookie");

  // If a 'experiment-0' cookie exist
  let res;
  let googleAnalytics;

  if (cookie && cookie.includes(`${name}=control`)) {
    res = await fetch(controlUrl, request);
    googleAnalytics = controlGA;
  } else if (cookie && cookie.includes(`${name}=test`)) {
    res = await fetch(testUrl, request);
    googleAnalytics = testGA;
  }

  if (res) {
    return new HTMLRewriter()
      .on("head", new ElementHandler(googleAnalytics))
      .transform(res);
  }

  // If a 'experiment-0' cookie does not exist
  const group = Math.random() * 100 < abConfig.split ? "test" : "control";

  if (group === "control") {
    res = await fetch(controlUrl, request);
    googleAnalytics = controlGA;
  } else {
    res = await fetch(testUrl, request);
    googleAnalytics = testGA;
  }

  const response = new Response(res.body, res);
  response.headers.append("Set-Cookie", `${name}=${group}; path=/`);
  return new HTMLRewriter()
    .on("head", new ElementHandler(googleAnalytics))
    .transform(response);
}

class ElementHandler {
  constructor(scriptTag) {
    this.scriptTag = scriptTag;
  }
  element(element) {
    element.append(this.scriptTag, { html: true });
  }
}
