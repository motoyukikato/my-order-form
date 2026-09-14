export default {
  async fetch(request, env) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      });
    }

    const [scheme, encoded] = authHeader.split(' ');
    if (scheme !== 'Basic' || !encoded) {
      return new Response('Bad Request', { status: 400 });
    }

    const decoded = atob(encoded);
    const [user, pass] = decoded.split(':');

    // 設定した環境変数と照合
    if (user === env.BASIC_USER && pass === env.BASIC_PASS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  },
};
