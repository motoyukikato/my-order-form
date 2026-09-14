export default {
  async fetch(request, env) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      });
    }

    try {
      const auth = authHeader.split(' ')[1];
      const [user, pass] = atob(auth).split(':');

      // 設定した環境変数と照合
      if (user === env.BASIC_USER && pass === env.BASIC_PASS) {
        // 認証成功時、そのまま要求されたファイル（hanamado.html等）を表示
        return env.ASSETS.fetch(request);
      }
    } catch (e) {
      // エラー時の処理
    }

    // パスワードが一致しない場合
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  },
};
