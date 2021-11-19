addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request) {
  const cookieName = "able-test";
  const abConfig = await DATA_STORE.get("ab-config", { type: "json" });
  const host = request.headers.get("host");
  const cookie = request.headers.get("cookie");
  const filter = abConfig.rule.filter;
  const destinations = abConfig.rule.destinations;
  let variants = abConfig.variants;

  // strip leading http:// or https:// from urls if present
  variants = variants.map((variant) => {
    if (variant.url.startsWith("http://")) {
      variant.url = variant.url.slice(7);
      return variant;
    } else if (variant.url.startsWith("https://")) {
      variant.url = variant.url.slice(8);
      return variant;
    } else return variant;
  });

  if (cookie) {
    const destination = destinations.find(({ variantName }) =>
      cookie.includes(`${cookieName}=${variantName}`)
    );
    if (destination) {
      const variant = variants.find(
        (variant) => variant.name === destination.variantName
      );
      const newUrl = request.url.replace(host, variant.url);
      let response = await fetch(newUrl, request);
      response = injectScriptInHTML(variant.script, response);
      return response;
    }
  }

  if (!matchCriteria(request, filter)) {
    return await fetch(request.url, request);
  }

  const destination = randomDestination(destinations);
  const variant = variants.find(
    (variant) => variant.name === destination.variantName
  );
  const newUrl = request.url.replace(host, variant.url);
  let response = await fetch(newUrl, request);
  response = addCookie(response, cookieName, variant.name);
  response = injectScriptInHTML(variant.script, response);
  return response;
}

function addCookie(response, cookieName, variantName) {
  const newResponse = new Response(response.body, response);
  newResponse.headers.append(
    "Set-Cookie",
    `${cookieName}=${variantName}; path=/`
  );
  return newResponse;
}

function randomDestination(destinations) {
  const num = Math.random() * 100;
  let total = 0;
  let destination;
  for (let index = 0; index < destinations.length; index += 1) {
    destination = destinations[index];
    total += destination.weight;
    if (total >= num) {
      break;
    }
  }
  return destination;
}

function injectScriptInHTML(script, response) {
  return new HTMLRewriter()
    .on("head", new ElementHandler(script))
    .transform(response);
}

function matchCriteria(request, filter) {
  const criteriaTypes = {
    device: matchDeviceCriteria,
    header: matchHeaderCriteria,
    browser: matchBrowserCriteria,
    cookie: matchCookieCriteria,
  };

  let isMatch = true;
  for (const [key, value] of Object.entries(filter)) {
    const match = criteriaTypes[key](request, value);
    if (!match) {
      isMatch = match;
      break;
    }
  }

  return isMatch;
}

function matchDeviceCriteria(request, value) {
  if (value === "") return true;
  const regex =
    /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i;
  const device = request.headers.get("User-Agent").match(regex)
    ? "mobile"
    : "desktop";
  return value === device;
}

function matchBrowserCriteria(request, values) {
  if (values.length === 0) return true;
  const regex = /(edg|opera|chrome|safari|firefox|msie|trident)/i;
  const userBrowser = request.headers.get("User-Agent").match(regex)[0];
  return values.some(
    (browser) => browser.toLowerCase() === userBrowser.toLowerCase()
  );
}

function matchHeaderCriteria(request, header) {
  return Object.keys(header).length === 0 || request.headers.get(header.name) === header.value;
}

function matchCookieCriteria(request, value) {
  if (!value) return true
  const cookie = request.headers.get("cookie");
  if (!cookie) return false;
  return cookie.includes(value);
}

class ElementHandler {
  constructor(scriptTag) {
    this.scriptTag = scriptTag;
  }
  element(element) {
    element.append(this.scriptTag, { html: true });
  }
}
