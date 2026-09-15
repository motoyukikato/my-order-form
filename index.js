export default {
  async fetch(request, env) {
    const USERNAME = 'admin';
    const PASSWORD = '87010'; // ← 設定したパスワード

    const authHeader = request.headers.get('Authorization');

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

      if (user === USERNAME && pass === PASSWORD) {
        // 認証成功時：静的アセットから該当ファイルを読み込んで返却
        return env.ASSETS.fetch(request);
      }
    } catch (e) {
      // エラー処理
    }

    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  },
};
