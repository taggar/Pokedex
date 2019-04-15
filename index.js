/* Create handles to manipulate parts of the interface
=====================================================*/
const searchBox = document.getElementById("search");
const pokeID = document.getElementById("pokeID");
const pokePic = document.getElementById("pokePic");
const pokeMoves = document.getElementById("pokeMoves");
const pokeEvo = document.getElementById("pokeEvo");
const rawData = document.getElementById("rawData");

searchBox.addEventListener("keyup", doSearch);

function doSearch(e) {
  if (e.which === 13 && e.target.value.length > 0) {
    let xhr = new XMLHttpRequest();
    let target = "https://pokeapi.co/api/v2/pokemon/" + e.target.value;
    xhr.open("GET", target);
    xhr.responseType = "json";
    xhr.send();
    xhr.onreadystatechange = function() {
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) {
        console.log("xhr to " + target);
      }
      if (xhr.readyState == 4) {
        // SetTimeout only to make the loading step visible in the exercise
        if (xhr.status !== 200) {
          rawData.innerText = xhr.status;
          return;
        }
        rawData.innerText = JSON.stringify(xhr.response, null, 5);

        /* Show ID and name
        ===================*/
        pokeID.innerText = xhr.response.id + ", " + xhr.response.name;

        /* Show picture
        ===============*/
        pokePic.innerHTML =
          "<img src=" + xhr.response.sprites.front_shiny + ">";

        /* Show moves
        ==============*/
        pokeMoves.innerText = JSON.stringify(xhr.response.moves, null, 5);
        getEvolutions(xhr.response.species.url);
      }
    };
  }
}

var getEvolutions = function getEvolutions(url) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "json";
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) {
      console.log("xhr to " + url);
    }
    if (xhr.readyState == 4) {
      try {
        console.log(xhr.response.evolves_from_species.name);
        pokeEvo.innerText = xhr.response.evolves_from_species.name;
      } catch {
        pokeEvo.innerText = "";
      }
    }
    // Xhr.response.species.evolves_from_species.name;
  };
};
