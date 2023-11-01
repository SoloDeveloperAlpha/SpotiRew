const client_id = 'b02e4343f8a347d596e2d7eec6807c97';
const redirect_uri = 'http://127.0.0.1:3000/profile.html';
const client_secret = '09397abef5364f6ca096e6fd5f0d0cbb';
const urlToken = 'https://accounts.spotify.com/api/token';
const nombre=document.querySelector("h3");
let accss="";
let refre="";

window.onload=function(){
  checkTokens();
};

function checkTokens() {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (accessToken && refreshToken) {
    getProfile();
  } else {
    obtainCode();
  }
}


function obtainCode(){
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if(code){
    authenticateUser(code);
  }
}

const authenticateUser = async code =>{

  let codeVerifier = localStorage.getItem('code_verifier');
  try{
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: client_id,
      grant_type: 'authorization_code',
      code:code,
      redirect_uri: redirect_uri,
      code_verifier: codeVerifier,
    })
  }
  const body = await fetch(urlToken, payload)
  const res = await body.json();
    localStorage.setItem('access_token',res.access_token);
    localStorage.setItem('refresh_token',res.refresh_token);
    getProfile();
  }
  catch(error){
    console.log(error);
  }
}

const getRefreshToken = async () => {

  // refresh token that has been previously stored
  const refreshToken = localStorage.getItem('refresh_token');
  const url = "https://accounts.spotify.com/api/token";

   const payload = {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
     },
     body: new URLSearchParams({
       grant_type: 'refresh_token',
       refresh_token: refreshToken,
       client_id: client_id
     }),
   }
   const body = await fetch(url, payload);
   const response = await body.json();

   localStorage.setItem('access_token', response.accessToken);
   localStorage.setItem('refresh_token', response.refreshToken);
   getProfile();
 }

async function getProfile() {
  let accessToken = localStorage.getItem('access_token');

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
  console.log(data.display_name);
  nombre.innerHTML=data.display_name;
}