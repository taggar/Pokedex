/* Create handles to manipulate parts of the interface
=====================================================*/

const searchBox = document.getElementById('search');
const pokeID = document.getElementById('pokeID');
const pokePic = document.getElementById('pokePic');
const pokeMoves = document.getElementById('pokeMoves');
const pokeEvo = document.getElementById('pokeEvo');
const rawData = document.getElementById('rawData');
const datalist = document.getElementById('allPokemons');

/* Listeners
=====================================================*/

window.addEventListener('load', getAllPokemons);
searchBox.addEventListener('keyup', doSearch);

function doSearch(e) {
  if (e.which === 13 && e.target.value.length > 0) {
    let target = 'https://pokeapi.co/api/v2/pokemon/' + e.target.value;

    doXhrGetJson(target)
      .then(function(result) {
        /* Show the raw response
        =======================*/
        rawData.innerHTML =
          '<pre>' + JSON.stringify(result, null, 5) + '</pre>';

        /* Show ID and name
        ===================*/
        pokeID.innerText = result.id + ', ' + result.name;

        /* Show pictures
        ================*/
        pokePic.innerHTML = getSprites(result.sprites);

        /* Show moves
        ==============*/
        let moves = [];

        for (let move of result.moves) {
          moves.push(move.move.name);
        }

        pokeMoves.innerHTML = moves.join(', ');

        /* Show previous evolution(s)
        =============================*/
        // Implemented with a Promise as we don't wait for the next ajax call to get back
        getEvolutions(result);
      })
      .catch(function() {
        // if the ajax call gives no result ...
        pokeID.innerText = 'Not found ...';
        pokePic.innerHTML = '...';
        pokeMoves.innerText = '...';
        pokeEvo.innerText = '...';
      });
  }
}

function getSprites(sprites) {
  let pictures = '';
  Object.keys(sprites).forEach(function(k) {
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
    .then(function(result) {
      let evo = result.evolves_from_species.name;
      pokeEvo.innerText = evo;
      getEvolutionImage(evo);
    })
    .catch(function() {
      pokeEvo.innerText = 'None found.';
    });
}

function getEvolutionImage(evo) {
  doXhrGetJson('https://pokeapi.co/api/v2/pokemon/' + evo)
    .then(function(result) {
      if (result.sprites.front_shiny != null) {
        pokeEvo.innerHTML += getSprites(result.sprites);
      }
    })
    .catch(function() {
      return;
    });
}

/* Get a list of all pokemons to populate the datalist
=====================================================*/
function getAllPokemons() {
  doXhrGetJson('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1').then(
    function(result) {
      let count = result.count;
      doXhrGetJson('https://pokeapi.co/api/v2/pokemon?offset=0&limit=' + count)
        .then(function(result) {
          result.results.forEach(function(r) {
            let option = document.createElement('option');
            option.value = r.name;
            datalist.appendChild(option);
          });
        })
        .catch(function() {
          console.log('No result ... ');
        });
    }
  );
}

/* Generic function to get an ajax json response
===============================================*/
function doXhrGetJson(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(this.response);
    };
    xhr.onerror = reject;
    xhr.responseType = 'json';
    xhr.open('GET', url);
    xhr.send();
  });
}

/*
GraphqQL fetch call example:
https://graphql-pokemon.now.sh/?query=%7B%0A%20%20pokemon(name%3A%20%22Pikachu%22)%20%7B%0A%20%20%20%20id%0A%20%20%20%20number%0A%20%20%20%20name%7D%0A%7D

fetch('https://1jzxrj179.lp.gql.zone/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '{ posts { title } }' }),
})
  .then(res => res.json())
  .then(res => console.log(res.data));

*/
