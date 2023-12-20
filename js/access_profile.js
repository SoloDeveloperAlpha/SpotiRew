const nombre = document.getElementById("nombre");
const log_out = document.getElementById("log-out");
const menu = document.querySelector(".menu");

let access_token = null;
let refresh_token = null;
let expires_in = null;
const horaActual = Date.now();

const USER_PROF = "https://api.spotify.com/v1/me";
const FOLLOWING = "https://api.spotify.com/v1/me/following";
const TOP_ARTIST = "https://api.spotify.com/v1/me/top/artists";
const TOP_TRACKS = "https://api.spotify.com/v1/me/top/tracks";

/*BOTON DE DESLOGUEO*/
log_out.addEventListener("click", function () {
  const confirmacion = confirm(
    "¿Esta seguro de que deseas cerrar la sesión de Spotify CHRONOHITS?"
  );
  if (confirmacion) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.setAttribute("href", "../index.html");
  }
});
/******************************/
import { connect, tiempoAcceso } from "./connection.mjs";
/*INICIO DEL CODIGO LLAMADO DESDE UNA CARGA EN EL BODY DEL HTML*/
async function getProfile() {
  tiempoAcceso();
  let accessToken = localStorage.getItem("access_token");
  const methead = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };

  const response = await fetch(USER_PROF, methead);
  const data = await response.json();
  /**================================================= */
  const fowi = await fetch(FOLLOWING + "?type=artist", methead);
  const fowi_data = await fowi.json();
  /**==================================================== */
  let profile_id = data.id;
  const ply_list = await fetch(
    `https://api.spotify.com/v1/users/${profile_id}/playlists`,
    methead
  );
  const ply_data = await ply_list.json();
  /**======================================================== */
  const top_art = await fetch(
    TOP_ARTIST + "?limit=10&time_range=long_term",
    methead
  );
  const data_art = await top_art.json();
  /**======================================================= */
  const top_track = await fetch(
    TOP_TRACKS + "?limit=10&time_range=long_term",
    methead
  );
  const data_track = await top_track.json();

  /**IMPRESION DE CONSOLA */
  console.log("Informacion de USER_PROFILE \n" + data);
  console.log("Informacion de #Artistas que sigues \n" + fowi_data);
  console.log("Informacion de PLAYLISTS \n" + ply_data);
  console.log("Impresion de TOP 10 Artistas \n" + data_art);
  console.log("Impresion de TOP 10 Canciones mas escuchadas \n" + data_track);

  /**Creacion de constantes para poder usar los elementos del DOM */
  const foto_perfil = document.getElementById("foto-perfil");
  const stat_followers = document.getElementById("stat-followers");
  const stat_following = document.getElementById("stat-following");
  const stat_playlist = document.getElementById("stat-playlist");
  const music_top = document.querySelector(".music-top");
  const topCancion = document.querySelectorAll("#top-cancion");
  const music_played = document.querySelector(".music-played");
  /**Impresion de Datos */
  foto_perfil.style.display = "block";
  foto_perfil.setAttribute("src", `${data.images[0].url}`);
  nombre.innerHTML = data.display_name;
  stat_followers.innerHTML = data.followers.total;
  stat_following.innerHTML = fowi_data.artists.total;
  stat_playlist.innerHTML = ply_data.total;

  for (let i = 0; i < data_art.items.length; i++) {
    music_top.innerHTML += `
    <div id="top-cancion">
    <img src="${data_art.items[i].images[2].url}" alt="">
    <a href="artists_data.html" id="top-links">${data_art.items[i].name}<span style="display:none; id="ide">${data_art.items[i].id}</span></a>
    
</div>`;
  }

  /**Guardado de id ARTISTA */
  const topLinks = document.querySelectorAll("#top-links");

  topLinks.forEach((tpLn) =>
    tpLn.addEventListener("click", (e) => {
      let spanContent = tpLn.querySelector("span").textContent;
      localStorage.removeItem("id_cancion");
      localStorage.setItem("id_cancion", spanContent);
    })
  );

  for (let j = 0; j < data_art.items.length; j++) {
    let mili = data_track.items[j].duration_ms;
    let seg = Math.floor(mili / 1000);
    let min = Math.floor(seg / 60);
    let segrest = seg % 60;
    if (segrest.toString().length < 2) {
      segrest += "0";
    }
    music_played.innerHTML += `<div id="top-played">
    <div id="track-img-name">
        <img src="${data_track.items[j].album.images[2].url}" alt="">
        <div id="track-artist">
            <p>${data_track.items[j].name}</p>
            <span>${data_track.items[j].artists[0].name} . ${data_track.items[j].album.name}</span>
        </div>
    </div>
    <span>${min}:${segrest}</span>
</div> `;
  }

  document.querySelector(".container-load").style.display = "none";
  menu.style.display = "block";
}

connect(getProfile);
