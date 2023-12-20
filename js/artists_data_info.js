import { connect, tiempoAcceso } from "./connection.mjs";
const obtenerArtista = async () => {
  tiempoAcceso();
  const data_art_acc_token = localStorage.getItem("access_token");
  const burbuja_img = document.querySelector(".bubble-art");
  const title_name = document.querySelector(".title-name");
  const imagen = burbuja_img.querySelector("img");
  const data1 = document.querySelector(".row-data1");
  const item1 = data1.querySelector("#item1");
  const item2 = data1.querySelector("#item2");
  const etiq_d1 = item1.querySelector("h3");
  const etiq_d2 = item2.querySelector("h2");
  const menu_data_artist = document.querySelector(".menu-data-artist");
  const rated = document.getElementById("rated");
  const discografia = document.getElementById("discografia");
  const fil = document.getElementById("fil");
  const data2 = document.querySelector(".row-data2");
  const item1_2 = data2.querySelector("#item1");
  const etiq_2 = item1_2.querySelector("h3");
  const col_top = document.querySelector(".column-top");

  const name_artist = document.getElementById("name-artist");
  const ide = localStorage.getItem("id_cancion");
  const TOP_ARTIST = "https://api.spotify.com/v1/me/top/artists";

  const ARTIST_BY_ID = "https://api.spotify.com/v1/artists/";
  const methe = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + data_art_acc_token,
    },
  };

  const arti_data = await fetch(ARTIST_BY_ID + ide, methe);
  const info_art = await arti_data.json();
  /**================================================== */
  const art_album = await fetch(ARTIST_BY_ID + `${ide}/albums?limit=50`, methe);
  const info_alb = await art_album.json();
  /**====================================================== */
  /**IMPRESION DE CONSOLA */
  console.log("Informacion del Artista" + info_art);
  console.log(info_art.genres);
  console.log(info_alb);
  /**======================================================= */
  name_artist.innerHTML = "";
  name_artist.innerHTML = info_art.name;
  imagen.style.display = "block";
  imagen.src = info_art.images[0].url;
  etiq_d1.innerHTML = info_art.followers.total.toLocaleString();
  etiq_d2.innerHTML = info_art.popularity + "%";

  imagen.onload = function () {
    let canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = imagen.width;
    canvas.height = imagen.height;

    ctx.drawImage(imagen, 0, 0);

    let x = 100;
    let y = 100;

    let pixel = ctx.getImageData(x, y, 1, 1).data;
    let color = "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
    let colorOpuesto =
      "#" +
      (
        (255 - pixel[0]).toString(16).padStart(2, "0") +
        (255 - pixel[1]).toString(16).padStart(2, "0") +
        (255 - pixel[2]).toString(16).padStart(2, "0")
      ).toUpperCase();
    title_name.style.background = `linear-gradient(90deg,${color},${colorOpuesto})`;
  };

  const L = '<i class="fas fa-star"></i>';
  const M = '<i class="fas fa-star-half-alt"></i>';
  const V = '<i class="far fa-star"></i>';

  if (info_art.popularity <= 10) {
    rated.innerHTML = `${L}${V}${V}${V}${V}`;
  } else if (info_art.popularity <= 20) {
    rated.innerHTML = `${L}${V}${V}${V}${V}`;
  } else if (info_art.popularity <= 30) {
    rated.innerHTML = `${L}${M}${V}${V}${V}`;
  } else if (info_art.popularity <= 40) {
    rated.innerHTML = `${L}${L}${V}${V}${V}`;
  } else if (info_art.popularity <= 50) {
    rated.innerHTML = `${L}${L}${M}${V}${V}`;
  } else if (info_art.popularity <= 60) {
    rated.innerHTML = `${L}${L}${L}${V}${V}`;
  } else if (info_art.popularity <= 70) {
    rated.innerHTML = `${L}${L}${L}${M}${V}`;
  } else if (info_art.popularity <= 80) {
    rated.innerHTML = `${L}${L}${L}${L}${V}`;
  } else if (info_art.popularity <= 90) {
    rated.innerHTML = `${L}${L}${L}${L}${M}`;
  } else if (info_art.popularity === 100) {
    rated.innerHTML = `${L}${L}${L}${L}${L}`;
  }

  if (info_art.genres[0] != undefined) {
    etiq_2.innerHTML +=
      info_art.genres[0].charAt(0).toUpperCase() +
      info_art.genres[0].slice(1).toLowerCase();
  } else {
    etiq_2.innerHTML = "Unknown";
  }

  /**IMPRESION DE OPCIONES EN EL FILTRO */
  const lanza = [];
  for (let y = 0; y < info_alb.items.length; y++) {
    let anoDato = info_alb.items[y].release_date.toString();
    let ano = anoDato.slice(0, 4);
    if (!lanza.includes(ano)) {
      lanza.push(ano);
    }
  }

  let anosOrd = lanza.map(Number).sort(function (a, b) {
    return b - a;
  });

  for (let z = 0; z < anosOrd.length; z++) {
    fil.innerHTML += `<option value="${anosOrd[z]}">${anosOrd[z]}</option>`;
  }

  /**IMPRESION DE ALBUMES */

  const arreglo_alb = [];
  const alb_id = [];

  for (let x = 0; x < info_alb.items.length; x++) {
    let anoDato = info_alb.items[x].release_date.toString();
    let ano = anoDato.slice(0, 4);
    discografia.innerHTML += `<div class="album">
                                <img src="${info_alb.items[x].images[1].url}" alt="" crossorigin >
                                <a href="albums.html" class="albumLnk">${info_alb.items[x].name}</a>
                                <span id="date_launch" style="display:none;">${ano}</span>
                                <span id="launch_ide" style="display:none;">${info_alb.items[x].id}</span>
                                </div>`;
  }

  /**MUESTRA FILTRO ALBUMES */
  fil.addEventListener("change", function () {
    let opt = this.value;
    discografia.innerHTML = "";
    for (let x = 0; x < info_alb.items.length; x++) {
      let anoDato = info_alb.items[x].release_date.toString();
      let ano = anoDato.slice(0, 4);
      if (fil.value === "all") {
        discografia.innerHTML += `<div class="album">
                                    <img src="${info_alb.items[x].images[1].url}" alt="" crossorigin >
                                    <a href="albums.html" class="albumLnk">${info_alb.items[x].name}</a>
                                    <span id="date_launch" style="display:none;">${ano}</span>
                                    <span id="launch_ide" style="display:none;">${info_alb.items[x].id}</span>
                                    </div>`;
      } else {
        if (fil.value === ano) {
          discografia.innerHTML += `<div class="album">
                                    <img src="${info_alb.items[x].images[1].url}" alt="" crossorigin >
                                    <a href="albums.html" class="albumLnk">${info_alb.items[x].name}</a>
                                    <span id="date_launch" style="display:none;">${ano}</span>
                                    <span id="launch_ide" style="display:none;">${info_alb.items[x].id}</span>
                                    </div>`;
        }
      }
    }
    linkIde();
  });

  linkIde();
  /**=============================== */
  function linkIde() {
    const albm = document.querySelectorAll(".album");
    albm.forEach(function (al) {
      const anchor_lnk = al.querySelector(".albumLnk");
      anchor_lnk.addEventListener("click", (e) => {
        e.preventDefault();
        const spn_ide = al.querySelector("#launch_ide");
        localStorage.removeItem("IdeAlbum");
        localStorage.setItem("IdeAlbum", spn_ide.textContent);
        window.location.href = "albums.html";
      });
    });
  }

  /**=============================== */
  const top_art = await fetch(
    TOP_ARTIST + "?time_range=long_term&limit=50",
    methe
  );
  const data_art = await top_art.json();

  for (let i = 0; i < data_art.items.length; i++) {
    if (data_art.items[i].images.length === 0) {
      break;
    } else {
      col_top.innerHTML += `
        <div class="next-top">
                    <img src="${data_art.items[i].images[2].url}" alt="foto-art">
                    <a href="artists_data.html" id="top-links" title="artista">${data_art.items[i].name}<span style="display:none;" id="ide">${data_art.items[i].id}</span>
                    </a>
                </div>`;
    }
  }

  const topLinks = document.querySelectorAll("#top-links");

  topLinks.forEach((tpLn) =>
    tpLn.addEventListener("click", (e) => {
      let spanContent = tpLn.querySelector("span").textContent;
      localStorage.removeItem("id_cancion");
      localStorage.setItem("id_cancion", spanContent);
    })
  );

  document.querySelector(".container-load").style.display = "none";
  menu_data_artist.style.display = "block";
};

const obtenerAlbum = async () => {
  tiempoAcceso();
  const alb_acc = localStorage.getItem("access_token");
  const alb_aidi = localStorage.getItem("IdeAlbum");
  const album_tracks = document.querySelector(".album-tracks");
  const header_alb = document.querySelector(".header-album");
  const ALBUM = `https://api.spotify.com/v1/albums/${alb_aidi}`;

  const methe = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + alb_acc,
    },
  };

  const album_data = await fetch(ALBUM, methe);
  const res_alb = await album_data.json();

  const ARTIST = `https://api.spotify.com/v1/artists/${res_alb.artists[0].id}`;
  const art_img = await fetch(ARTIST, methe);
  const res_art = await art_img.json();

  const alb_contenedor = document.querySelector(".album-contenedor");
  let anoDato = res_alb.release_date.toString();
  let ano = anoDato.slice(0, 4);

  console.log(res_alb);
  console.log(res_art.images[2].url);
  let sum_tiempo = 0;
  let sum_h = 0,
    sum_min = 0;
  for (const ite in res_alb.tracks.items) {
    let conteo = parseInt(ite);
    conteo++;
    sum_tiempo += res_alb.tracks.items[ite].duration_ms;
    let tempo = res_alb.tracks.items[ite].duration_ms;
    let segu = Math.floor(tempo / 1000);
    let minu = segu / 60;
    let res_seg = Math.floor((minu % 1) * 100);
    let cadena = Math.floor(res_seg);
    sum_min += cadena;
    let cadena_conv = cadena.toString();
    if (cadena_conv.length === 1) {
      cadena = "0" + cadena;
    }
    album_tracks.innerHTML += `<a href="${
      res_alb.tracks.items[ite].external_urls.spotify
    }" target="_blank" class="track">
  <div class="track-pt1">
      <span>${conteo}</span>
      <div class="canc-artista">
          <h5>${res_alb.tracks.items[ite].name}</h5>
          <span id="cantante"> ${
            res_alb.tracks.items[ite].artists[0].name
          }</span>
      </div>
  </div>
  <span class="track-pt2">${Math.floor(minu)}:${cadena}</span>
</a>`;
    sum_h += Math.floor(minu);
  }

  let seg = sum_tiempo / 1000000;
  let hor = Math.floor(seg / 3600);
  let min = Math.floor((sum_tiempo % 3600) / 60);
  alb_contenedor.innerHTML = `<div class="album-item">
  <img id="img-header" src="${res_alb.images[1].url}" alt="" crossorigin >
</div>
<div class="album-item-info">
  <span>Album</span>
  <h1 id="album-name">${res_alb.name}</h1>
  <div id="album-art-tracks">
      <img src="${res_art.images[2].url}">
      <span id="art">${res_alb.artists[0].name} • ${ano} • ${
    res_alb.total_tracks
  } Tracks • ${sum_h + Math.floor(min / 60)} min</span>
  </div>
</div>`;
  const volv = document.getElementById("volver");
  volv.addEventListener("click", function () {
    localStorage.setItem("id_cancion", res_alb.artists[0].id);
  });

  const img_header = document.getElementById("img-header");

  img_header.onload = function () {
    let canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img_header.width;
    canvas.height = img_header.height;
    ctx.drawImage(img_header, 0, 0);

    let x = 100;
    let y = 100;

    let pixel = ctx.getImageData(x, y, 1, 1).data;
    let color = "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
    let colorOpuesto =
      "#" +
      (
        (255 - pixel[0]).toString(16).padStart(2, "0") +
        (255 - pixel[1]).toString(16).padStart(2, "0") +
        (255 - pixel[2]).toString(16).padStart(2, "0")
      ).toUpperCase();
    header_alb.style.background = `linear-gradient(90deg,${color},${colorOpuesto})`;
  };

  document.querySelector(".container-load").style.display = "none";
};

const chronoTopArtist = async () => {
  tiempoAcceso();
  const chronoacc = localStorage.getItem("access_token");
  const tracks_ano = document.querySelector(".tracks-ano");
  const art_chrono = document.querySelector(".art-chrono");
  const TOP_ARTIST =
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50";
  const methe = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + chronoacc,
    },
  };

  const data_chrono_art = await fetch(TOP_ARTIST, methe);
  const res_ch_art = await data_chrono_art.json();

  console.log(res_ch_art);
  console.log(res_ch_art.items[0].images[2].url);

  for (let i = 0; i < res_ch_art.items.length; i++) {
    if (res_ch_art.items[i].images.length === 0) {
      break;
    } else {
      art_chrono.innerHTML += `<div class="top-art">
     <div class="img-art">
      <img src="${res_ch_art.items[i].images[2].url}" alt="">
     </div>
  <span>${res_ch_art.items[i].name}</span>
  <span id="chrono-id" style="display:none;">${res_ch_art.items[i].id}</span>
</div>`;
    }
  }

  async function getCountry() {
    try {
      // Hacer una solicitud GET a la API de geolocalización
      const response = await axios.get("https://ipapi.co/json/");

      // Obtener el código de país desde la respuesta
      const country = response.data.country;

      // Retornar el código de país
      return country;
    } catch (error) {
      // Manejar errores
      console.error(
        "Error al obtener la información de geolocalización:",
        error.message
      );
      return null;
    }
  }

  const tp_ar = document.querySelectorAll(".top-art");
  const tip_hit = document.querySelector(".tit-hit");
  const tip_art = document.querySelector("tit-art");
  verfVentana();
  window.addEventListener("resize", function () {
    verfVentana();
  });
  tp_ar.forEach((tp) =>
    tp.addEventListener("click", async (e) => {
      e.preventDefault();
      if (tip_hit.style.display === "none") {
        tip_hit.style.display = "flex";
      }
      tracks_ano.innerHTML = "";
      const spChrId = tp.querySelector("#chrono-id").textContent;
      const pais = await getCountry().then((country) => {
        if (country) {
          return country;
        }
      });
      const data_hit = await fetch(
        `https://api.spotify.com/v1/artists/${spChrId}/top-tracks?market=${pais}`,
        methe
      );
      const arreglo = [];
      const res_ch_hit = await data_hit.json();
      for (let i in res_ch_hit.tracks) {
        arreglo.push(res_ch_hit.tracks[i]);
      }
      const hitPopular = arreglo.sort((a, b) => b.popularity - a.popularity);
      console.log(hitPopular);
      for (let x in hitPopular) {
        if (x <= 2) {
          tracks_ano.innerHTML += `<a href="albums.html" class="bst-hit active${x} animate__animated animate__fadeIn">
          <span id="tk">HIT</span>
          <div class="img-hit">
              <img src="${hitPopular[x].album.images[2].url}" alt="">
          </div>
          <span>${hitPopular[x].name}</span>
          <span id="spnh-id" style="display:none;">${hitPopular[x].album.id}</span>
      </a>`;
        } else {
          tracks_ano.innerHTML += `<a href="albums.html" class="bst-hit animate__animated animate__fadeIn">
        <div class="img-hit">
            <img src="${hitPopular[x].album.images[2].url}" alt="">
        </div>
        <span>${hitPopular[x].name}</span>
        <span id="spnh-id" style="display:none;">${hitPopular[x].album.id}</span>
    </a>`;
        }
      }
      const bst_hit = document.querySelectorAll(".bst-hit");

      bst_hit.forEach((hit) =>
        hit.addEventListener("click", (e) => {
          const spn_hit_id = hit.querySelector("#spnh-id").textContent;
          localStorage.setItem("IdeAlbum", spn_hit_id);
        })
      );
    })
  );

  function verfVentana() {
    let anchoVentana =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    if (anchoVentana >= 768) {
      tip_hit.style.display = "flex";
      tip_hit.style.position = "static";
    } else {
      tip_hit.style.display = "none";
      tip_hit.style.position = "absolute";
    }
  }

  const btn_exit = document.getElementById("btn-exit");
  btn_exit.addEventListener("click", function () {
    if (tip_hit.style.display === "flex") {
      tip_hit.style.display = "none";
    }
  });
  document.querySelector(".container-load").style.display = "none";
};

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname === "/artists_data.html") {
    connect(obtenerArtista);
  } else if (window.location.pathname === "/albums.html") {
    connect(obtenerAlbum);
  } else {
    connect(chronoTopArtist);
  }
});
