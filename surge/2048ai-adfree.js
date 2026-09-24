$done({
  body: JSON.stringify({
    code: 200,
    message: "ok",
    data: {
      promotionApp: { enabled: false },
      popup: { enabled: false, mode: "none", items: [] },
      singlePopup: { enabled: false, mode: "none", items: [] },
      multiPopup: { enabled: false, mode: "none", items: [] },
    },
  }),
  headers: { "Content-Type": "application/json; charset=utf-8" },
});
