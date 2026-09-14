export default {
  async fetch(request, env) {
    // 💡 設定したいユーザー名とパスワードをここに直接記述します
    const USERNAME = 'admin';
    const PASSWORD = '87010';// ← ここをご希望のパスワードに変更してください

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

      // 直書きしたユーザー名・パスワードと照合
      if (user === USERNAME && pass === PASSWORD) {
        if (env.ASSETS) {
          return env.ASSETS.fetch(request);
        }
        return fetch(request);
      }
    } catch (e) {
      // エラー時の処理
    }

    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  },
};
