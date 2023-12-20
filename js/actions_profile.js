const top_artist_view = document.querySelector(".top-artist-view");
const art_accs_token = localStorage.getItem("access_token");
/**MENU SIDEBAR INTERACICON DEL BOTON */

/**======================================= */
import { connect, tiempoAcceso } from "./connection.mjs";
const obtenerTop = async () => {
  tiempoAcceso();
  const artists = await fetch(
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + art_accs_token,
      },
    }
  );
  const top_art = await artists.json();
  console.log(top_art.items);
  console.log(top_art.items[0].images[1].url);
  console.log(top_art.items[0].name);

  for (let i = 0; i < top_art.items.length; i++) {
    if (top_art.items[i].images.length === 0) {
      break;
    } else {
      top_artist_view.innerHTML += `<div id="artist-img-name">
    <img src="${top_art.items[i].images[1].url}" alt="">
    <a href="artists_data.html" id="artist-name">${top_art.items[i].name}<span style="display:none;">${top_art.items[i].id}</span></a>
</div>`;
    }
  }

  const artist_name = document.querySelectorAll("#artist-name");

  artist_name.forEach((tpLn) =>
    tpLn.addEventListener("click", (e) => {
      let spanContent = tpLn.querySelector("span").textContent;
      localStorage.removeItem("id_cancion");
      localStorage.setItem("id_cancion", spanContent);
    })
  );

  document.querySelector(".container-load").style.display = "none";
};

connect(obtenerTop);
