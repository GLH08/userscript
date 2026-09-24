/**
 * 2048ai.vip / madouai.xyz — 仅播放页加载 m3u8 时通知外播
 * 触发: GET /api/v1/m3u8/proxy?path=...
 * 过滤: Referer 必须像 /videos/:id 或 /short-dramas/:id/...（首页横幅预览也会打 proxy，必须排除）
 * 参数: argument=player=SenPlayer|VidHub|Lenna|Infuse  或 scheme=自定义前缀
 * 远程: https://raw.githubusercontent.com/GLH08/userscript/main/surge/2048ai-play-notify.js
 */
(function () {
  const req = $request && $request.url;
  if (!req || req.indexOf("/api/v1/m3u8/proxy") === -1) {
    $done({});
    return;
  }

  const headers = ($request && $request.headers) || {};
  const referer =
    headers.Referer ||
    headers.referer ||
    headers.Referrer ||
    headers.referrer ||
    "";
  // 首页 /media/、列表页不要弹；仅详情/剧集播放页
  if (!/\/(?:videos|short-dramas)\/\d+/i.test(referer)) {
    $done({});
    return;
  }

  const playUrl = req.split("#")[0];

  const key = "2048ai:last-play";
  try {
    const prev = JSON.parse($persistentStore.read(key) || "{}");
    if (prev.url === playUrl && Date.now() - (prev.ts || 0) < 3000) {
      $done({});
      return;
    }
    $persistentStore.write(JSON.stringify({ url: playUrl, ts: Date.now() }), key);
  } catch (e) {}

  function parseArg(raw) {
    const out = {};
    if (!raw || typeof raw !== "string") return out;
    raw.split("&").forEach((pair) => {
      const i = pair.indexOf("=");
      if (i < 0) return;
      out[decodeURIComponent(pair.slice(0, i))] = decodeURIComponent(pair.slice(i + 1));
    });
    return out;
  }

  const arg = parseArg(typeof $argument === "string" ? $argument : "");
  const player = (arg.player || "SenPlayer").trim();
  const custom = (arg.scheme || "").trim();

  const presets = {
    senplayer: "senplayer://x-callback-url/play?url=",
    sensplayer: "senplayer://x-callback-url/play?url=",
    vidhub: "open-vidhub://x-callback-url/play?url=",
    lenna: "lenna://play?url=",
    infuse: "infuse://x-callback-url/play?url=",
  };

  const openUrl = custom
    ? custom + encodeURIComponent(playUrl)
    : (presets[player.toLowerCase()] || presets.senplayer) + encodeURIComponent(playUrl);

  try {
    if (typeof $clipboard !== "undefined" && $clipboard.write) $clipboard.write(playUrl);
  } catch (e) {}

  try {
    $notification.post(
      "2048 AI · 外播",
      player + (custom ? " (自定义)" : ""),
      "已复制 m3u8 代理地址，点此用播放器打开（可倍速）",
      { url: openUrl }
    );
  } catch (e) {
    try {
      $notification.post("2048 AI · 外播", player, "已复制 m3u8 代理地址");
    } catch (e2) {}
  }

  $done({});
})();