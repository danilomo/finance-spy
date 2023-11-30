const ENDPOINT = "http://localhost:5000";

function urlFrom(route: string) {
  if (route.startsWith("/")) {
    return ENDPOINT + route;
  }

  return ENDPOINT + "/" + route;
}

async function get(route: string, parameters: Record<string, string> | null = null) {
  console.log(`getting: ${route} with parameters ${JSON.stringify(parameters)}`)
  if (! parameters ) {
    return (await fetch(urlFrom(route))).json();
  }

  return (await fetch(urlFrom(route) + "?" + new URLSearchParams(parameters))).json();
}

export { get };
