const repl_acc_token = localStorage.getItem("access_token");
import { connect, tiempoAcceso } from "./connection.mjs";

const obtenerRecPlay = async () => {
  tiempoAcceso();
  const RECENT_PLY = "https://api.spotify.com/v1/me/player/recently-played";
  const rec_tracks = document.querySelector(".recent-tracks");
  const methe = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + repl_acc_token,
    },
  };

  const data_play = await fetch(RECENT_PLY, methe);
  const res_play = await data_play.json();
  console.log(res_play.items[0].track);
  console.log(res_play.items[0].track.name);
  console.log(res_play.items[0].track.artists[0].name);
  console.log(res_play.items[0].track.album.name);
  console.log(res_play.items[0].track.album.images[2].url);
  console.log(res_play.items[0].track.duration_ms);

  for (let i = 0; i < res_play.items.length; i++) {
    let tempo = res_play.items[i].track.duration_ms;
    let segu = Math.floor(tempo / 1000);
    let minu = segu / 60;
    let res_seg = Math.floor((minu % 1) * 100);
    let cadena = Math.floor(res_seg);
    let cadena_conv = cadena.toString();
    if (cadena_conv.length === 1) {
      cadena = "0" + cadena;
    }

    rec_tracks.innerHTML += ` <a href="${
      res_play.items[i].track.external_urls.spotify
    }" target="_blank" class="track">
    <div class="track-pt1">
        <span>${i + 1}</span>
        <img src="${res_play.items[i].track.album.images[2].url}" alt="">
        <div class="canc-artista">
            <h5>${res_play.items[i].track.name}</h5>
            <span id="cantante"> ${
              res_play.items[i].track.artists[0].name
            }</span>
        </div>
    </div>
    <span class="track-ptm">${res_play.items[i].track.album.name}</span>
    <span class="track-pt2">${Math.floor(minu)}:${cadena}</span>
</a>`;
  }

  document.querySelector(".container-load").style.display = "none";
};

const obtenerMostPlay = async () => {
  tiempoAcceso();
  const played_view = document.querySelector("#played-vw");
  const vw_imagen = document.getElementById("vw-imagen");
  const mst_ply = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + repl_acc_token,
      },
    }
  );
  const res_mst = await mst_ply.json();
  console.log(res_mst.items);
  console.log(res_mst.items[0].name);

  for (let i = 0; i < res_mst.items.length; i++) {
    played_view.innerHTML += `
    <div id="ply-trac">
    <img id="img-foto" src="${res_mst.items[i].album.images[1].url}" alt="">
    <span id="id_alb" style="display:none;">${res_mst.items[i].album.id}</span>
    <div id="ply-info">
        <span id="ply-song">${res_mst.items[i].name}</span>
        <span id="ply-artist">${res_mst.items[i].artists[0].name}</span>
    </div>
</div>`;
  }
  vw_imagen.innerHTML = `<img id="alb-trc" src="${res_mst.items[0].album.images[1].url}" alt=""><a href=""><img id="alb-inf" src="assets/images/info.png" alt=""></a>`;

  const ply_trac = document.querySelectorAll("#ply-trac");

  ply_trac.forEach((tpLn) =>
    tpLn.addEventListener("click", (e) => {
      let img_foto = tpLn.querySelector("#img-foto");
      let id_foto_alb = tpLn.querySelector("#id_alb");
      localStorage.setItem("IdeAlbum", id_foto_alb.textContent);
      vw_imagen.innerHTML = "";
      vw_imagen.innerHTML = `<img id="alb-trc" src="${img_foto.getAttribute(
        "src"
      )}" alt=""><a href="albums.html"><img id="alb-inf" src="assets/images/info.png" alt=""></a>`;
    })
  );

  document.querySelector(".container-load").style.display = "none";
};

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname === "/mostPlayed.html") {
    connect(obtenerMostPlay);
  } else {
    connect(obtenerRecPlay);
  }
});
