function Login() {
  //Code Verifier
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const codeVerifier = generateRandomString(64);

  //Code Challenge
  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  (async () => {
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    // Hacer algo con codeChallenge, ya que estás dentro de un contexto async
    const client_id = "b02e4343f8a347d596e2d7eec6807c97";
    const redirect_uri = "http://127.0.0.1:3000/profile.html";
    //Request User Authorization

    let authUrl = "https://accounts.spotify.com/authorize";
    authUrl += "?client_id=" + client_id;
    authUrl += "&response_type=code";
    authUrl += "&redirect_uri=" + encodeURI(redirect_uri);
    authUrl += "&show_dialog=true";
    authUrl +=
      "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-top-read user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private user-follow-modify user-follow-read";

    // generated in the previous step
    window.localStorage.setItem("code_verifier", codeVerifier);

    window.location.href = authUrl;
  })();
}
