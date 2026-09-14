export default {
  async fetch(request, env) {
    const authHeader = request.headers.get('Authorization');

    // ① パスワード入力（認証ヘッダー）がない場合は、401エラーを出してポップアップを表示させる
    if (!authHeader) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      });
    }

    try {
      const auth = authHeader.split(' ')[1];
      const [user, pass] = atob(auth).split(':');

      // ② 環境変数 BASIC_USER / BASIC_PASS と照合
      if (user === env.BASIC_USER && pass === env.BASIC_PASS) {
        // ③ 認証成功時：env.ASSETS があればそれを使ってファイルを返し、無ければ直接アクセスを通す
        if (env.ASSETS) {
          return env.ASSETS.fetch(request);
        }
        return fetch(request);
      }
    } catch (e) {
      // エラー時の処理
    }

    // ④ IDやパスワードが間違っている場合は再度ポップアップを出す
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  },
};
