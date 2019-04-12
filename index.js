const searchBox = document.getElementById('search');
const pokeID = document.getElementById('pokeID');
const pokePic = document.getElementById('pokePic');
const pokeMoves = document.getElementById('pokeMoves');
const pokeEvo = document.getElementById('pokeEvo');
const rawData = document.getElementById('rawData');


searchBox.addEventListener('keyup', doSearch);

function doSearch(e) {
    if (e.which === 13 && e.target.value.length > 0) {
        let xhr = new XMLHttpRequest();
        let target = 'https://pokeapi.co/api/v2/pokemon/' + e.target.value;
        xhr.open('GET', target);
        xhr.responseType = "json";
        window.scrollTo({ top: 0, behavior: 'smooth' });
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) {
                console.log('xhr to ' + target);
            }
            if (xhr.readyState == 4) {
                // setTimeout only to make the loading step visible in the exercise
                if (xhr.status !== 200) {
                    rawData.innerText = xhr.status;
                    return;
                }
                rawData.innerText = JSON.stringify(xhr.response, null, 5);
            }
        }
    }
}


