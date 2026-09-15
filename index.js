export default {
  async fetch(request, env) {
    const USERNAME = 'admin';
    const PASSWORD = '87010';

    const authHeader = request.headers.get('Authorization');

    // ① 未認証の場合は 401 を返してポップアップを強制表示
    if (!authHeader) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      });
    }

    try {
      const auth = authHeader.split(' ')[1];
      const decoded = atob(auth);
      const [user, pass] = decoded.split(':');

      // ② ID・パスワード照合
      if (user === USERNAME && pass === PASSWORD) {
        // 認証成功時：リクエストされた静的ファイルを読み込んで返す
        return fetch(request);
      }
    } catch (e) {
      // エラー処理
    }

    // ③ 認証失敗時
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  },
};
