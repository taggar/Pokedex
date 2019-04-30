/* Create handles to manipulate parts of the interface
=====================================================*/
const searchBox = document.getElementById('search');
const pokeID = document.getElementById('pokeID');
const pokePic = document.getElementById('pokePic');
const pokeMoves = document.getElementById('pokeMoves');
const pokeEvo = document.getElementById('pokeEvo');
const rawData = document.getElementById('rawData');
const datalist = document.getElementById('allPokemons');

window.addEventListener('load', getAllPokemons);
searchBox.addEventListener('keyup', doSearch);

function doSearch(e) {
  if (e.which === 13 && e.target.value.length > 0) {
    let target = 'https://pokeapi.co/api/v2/pokemon/' + e.target.value;
    console.log('xhr to ' + target);
    doXhrGetJson(target)
      .then(function (result) {
        // console.log('Result: ' + JSON.stringify(result, null, 5));
        rawData.innerHTML = '<pre>' + JSON.stringify(result, null, 5) + '</pre>';

        /* Show ID and name
        ===================*/
        pokeID.innerText = result.id + ', ' + result.name;

        /* Show picture
        ===============*/
        // console.log('pic: ' + JSON.stringify(result.sprites.front_shiny, null, 5));
        pokePic.innerHTML = getPictures(result.sprites);

        // pokePic.innerHTML =
        //   '<img src=' + result.sprites.front_shiny + '>';

        /* Show moves
        ==============*/
        //Console.log('moves: ' + JSON.stringify(result.moves, null, 5));
        let moves = [];
        for (move of result.moves) {
          moves.push(move.move.name);
        }
        pokeMoves.innerHTML = moves.join(', ');

        /* Show previous evolution(s)
        =============================*/
        // Implemented with a Promise as we don't wait for the next ajax call to get back
        getEvolutions(result);

      })
      .catch(function () {
        pokeID.innerText = 'Not found ...'
        pokePic.innerHTML = '...';
        pokeMoves.innerText = '...';
        pokeEvo.innerText = '...';

      });
  }

}

function getPictures(sprites) {
  let pictures = '';
  Object.keys(sprites).forEach(function (k) {
    if (sprites[k] != null) {
      pictures += `<img src=${sprites[k]}>`;
    }
  });
  if (pictures != '') {
    return pictures;
  }
  return 'None found';
}

function getEvolutions(result) {
  doXhrGetJson(result.species.url)
    .then(function (result) {
      let evo = result.evolves_from_species.name;
      pokeEvo.innerText = evo;
      getEvolutionImage(evo);
    })
    .catch(function () {
      pokeEvo.innerText = 'None found.';
    });
}

function getEvolutionImage(evo) {
  doXhrGetJson('https://pokeapi.co/api/v2/pokemon/' + evo)
    .then(function (result) {
      if (result.sprites.front_shiny != null) {
        pokeEvo.innerHTML += getPictures(result.sprites);
      }
    })
    .catch(function () {
      return;
    });
}

function getAllPokemons() {
  doXhrGetJson('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1')
    .then(
      function (result) {
        let count = result.count;
        doXhrGetJson('https://pokeapi.co/api/v2/pokemon?offset=0&limit=' + count)
          .then(function (result) {
            result.results.forEach(function (r) {
              let option = document.createElement('option');
              option.value = r.name;
              datalist.appendChild(option);
            })
          })
          .catch(function () {
            console.log('No result ... ');
          });
      }
    )

}

/* Function to get an ajax json response
=======================================*/
function doXhrGetJson(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(this.response);
    };
    xhr.onerror = reject;
    xhr.responseType = 'json';
    xhr.open('GET', url);
    xhr.send();
  });
}
