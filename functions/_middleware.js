export async function onRequest(context) {
  const { request, env } = context;

  // Cloudflareの管理画面で設定する環境変数を読み込む
  const BASIC_USER = env.BASIC_USER || "admin";
  const BASIC_PASS = env.BASIC_PASS || "password123";

  const authHeader = request.headers.get("Authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(":");

      // IDとパスワードが合っていれば画面を表示
      if (user === BASIC_USER && pass === BASIC_PASS) {
        return await context.next();
      }
    }
  }

  // 未入力または誤りの場合はログイン画面を出す（HTMLすら読み込ませない）
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Please enter ID and Password"',
    },
  });
}
