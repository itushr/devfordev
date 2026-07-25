export async function parseRequestBody(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await req.json();
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(await req.text()));
  }

  if (contentType.includes("multipart/form-data")) {
    return Object.fromEntries((await req.formData()).entries());
  }

  return {}
}