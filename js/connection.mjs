import { config } from "./config.js";
const client_id = config.id;
const redirect_uri = "http://127.0.0.1:3000/profile.html";
const client_secret = config.cls;
let code_verifier = localStorage.getItem("code_verifier");

let access_token = null;
let refresh_token = null;
let expires_in = null;
let variableFunc = null;
const horaActual = Date.now();

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";

export function connect(varFunc) {
  variableFunc = varFunc;
  if (window.location.search.length > 0) {
    handleRedirect();
  } else {
    access_token = localStorage.getItem("access_token");
    if (access_token === undefined) {
      // Si no tienes un access_token, verifica si tienes un code_verifier
      code_verifier = localStorage.getItem("code_verifier");
      if (code_verifier == null) {
        // Si no tienes un code_verifier, genera uno
        code_verifier = generateCodeVerifier();
        localStorage.setItem("code_verifier", code_verifier);
      }
      // Luego, solicita la autorización
      alert(
        "Se a alcanzado el Tiempo limite establecido. \n Volver a INICIAR SESION"
      );
      requestAuthorization();
    }
    return varFunc();
  }
}

function generateCodeVerifier() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const codeVerifier = [];
  for (let i = 0; i < 128; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    codeVerifier.push(characters.charAt(randomIndex));
  }
  return codeVerifier.join("");
}

function handleRedirect() {
  let code = getCode();
  fetchAccessToken(code);
  window.history.pushState("", "", redirect_uri); //Remueve los parametros visibles de la URL
}

/*Obtener el Code*/
function getCode() {
  let code = null;
  const queryString = window.location.search;
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get("code");
  }
  return code;
}

/**Aqui otorgamos las credenciales necesarias para realizar la validacion para la Authorizacion */
function fetchAccessToken(code) {
  let body = "grant_type=authorization_code";
  body += "&code=" + code;
  body += "&redirect_uri=" + encodeURI(redirect_uri);
  body += "&client_id=" + client_id;
  body += "&code_verifier=" + code_verifier;
  callAuthorizationApi(body);
}

/**Con el Code se brindara acceso con el ACCESS Y REFRESH TOKEN inicial */
function callAuthorizationApi(body) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", TOKEN, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader(
    "Authorization",
    "Basic " + btoa(client_id + ":" + client_secret)
  );
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
}

/**Si el Acceso ha sido concedido se pasara al siguiente codigo , caso contrario se visualizara el error por Consola */
function handleAuthorizationResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    console.log(data);
    if (data.access_token != undefined) {
      access_token = data.access_token;
      expires_in = data.expires_in;
      refresh_token = data.refresh_token;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
      localStorage.setItem("horaInicial", horaActual);
      localStorage.setItem("refresh_token", refresh_token);
    }
    if (data.refresh_token != undefined) {
      refresh_token = data.refresh_token;
      localStorage.setItem("refresh_token", refresh_token);
    }
    connect(variableFunc);
  } else {
    console.log(this.responseText);
    alert(
      "Se a alcanzado el Tiempo limite establecido. \n Volver a INICIAR SESION"
    );
    requestAuthorization();
  }
}

/**Aqui se volvera a realizar el pedido de Authorizacion, solo si es necesario */
function requestAuthorization() {
  localStorage.setItem("client_id", client_id);
  localStorage.setItem("client_secret", client_secret); // In a real app you should not expose your client_secret to the user

  let url = AUTHORIZE;
  url += "?client_id=" + client_id;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url +=
    "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private user-follow-modify user-follow-read user-top-read";
  window.location.href = url; // Show Spotify's authorization screen
}

/**Aqui se realiza el pedido del refresh TOKEN */
const refreshAccessToken = async () => {
  refresh_token = localStorage.getItem("refresh_token");
  let body = "grant_type=refresh_token";
  body += "&refresh_token=" + refresh_token;
  body += "&client_id=" + client_id;

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  };
  const res_refre = await fetch(TOKEN, payload);
  const response = await res_refre.json();

  localStorage.setItem("access_token", response.accessToken);
  callAuthorizationApi(body);
};

/**Aqui se limpian los ACCESOS de ser necesario */
function clearLocalStorage() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

/**Aqui se Cronometra el timepo de Acceso para la otorgacion de un nuevo TOKEN */
export function tiempoAcceso() {
  const verfToken = localStorage.getItem("access_token");
  const horaAlmac = parseInt(localStorage.getItem("horaInicial"), 10);

  const horaActualDespuesDe1H = Date.now();

  if (horaActualDespuesDe1H - horaAlmac >= 3600000) {
    if (access_token === verfToken) {
      refreshAccessToken();
    } else {
      console.log("El valor ha cambiado después de una hora.");
    }
  } else {
    console.log("No ha pasado una hora todavía.");
  }
}
