function Login(){
  //Code Verifier
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const codeVerifier  = generateRandomString(64);

//Code Challenge
const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

(async () => {
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  // Hacer algo con codeChallenge, ya que estás dentro de un contexto async

    //Request User Authorization

const client_id = 'b02e4343f8a347d596e2d7eec6807c97';
const redirect_uri = 'http://127.0.0.1:3000/profile.html';

const scope = 'user-read-private user-read-email';
const authUrl = new URL("https://accounts.spotify.com/authorize");

// generated in the previous step
window.localStorage.setItem('code_verifier', codeVerifier);

const params =  {
response_type: 'code',
client_id: client_id,
scope,
code_challenge_method: 'S256',
code_challenge: codeChallenge,
redirect_uri: redirect_uri,
}

authUrl.search = new URLSearchParams(params).toString();
window.location.href = authUrl.toString();

})();

}


