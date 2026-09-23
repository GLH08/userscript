function ensureAdFree(body) {
  if (typeof body !== "string" || !body) return body;
  if (/window\.__ad_free\s*=\s*true/.test(body)) {
    return body.replace(/window\.__ad_free\s*=\s*false/g, "window.__ad_free=true");
  }
  const tag = "<script>window.__ad_free=true;</script>";
  if (/<head(\s[^>]*)?>/i.test(body)) {
    return body.replace(/<head(\s[^>]*)?>/i, (m) => m + tag);
  }
  if (/<html(\s[^>]*)?>/i.test(body)) {
    return body.replace(/<html(\s[^>]*)?>/i, (m) => m + tag);
  }
  return tag + body;
}
let body = $response.body;
if (body) {
  body = ensureAdFree(body);
  $done({ body });
} else {
  $done({});
}
