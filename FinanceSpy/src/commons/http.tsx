import axios from "axios";

const ENDPOINT = "http://localhost:5000";

function urlFrom(
  route: string,
  parameters: Record<string, string> | null = null,
) {
  const params = parameters ? "?" + new URLSearchParams(parameters) : "";
  if (route.startsWith("/")) {
    return ENDPOINT + route + params;
  }

  return ENDPOINT + "/" + route + params;
}

async function get<T>(
  route: string,
  parameters: Record<string, string> | null = null,
) {
  console.log(
    `getting: ${route} with parameters ${JSON.stringify(parameters)}`,
  );

  const url = urlFrom(route, parameters);
  const result = await axios.get<T>(url);

  return await result.data;
}

async function put<T>(
  route: string,
  body: T,
  parameters: Record<string, string> | null = null,
) {
  const url = urlFrom(route, parameters);
  await axios.put(url, body);
}

async function post<T, U>(
  route: string,
  body: T,
  parameters: Record<string, string> | null = null,
) {
  const url = urlFrom(route, parameters);
  const result = await axios.post<U>(url, body);

  return await result.data;
}

async function del(
  route: string,
  parameters: Record<string, string> | null = null,
) {
  const url = urlFrom(route, parameters);
  await axios.delete(url);
}


export { get, put, post, del};
