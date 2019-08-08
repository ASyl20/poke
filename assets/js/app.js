import {
    imgLoad,
    createCardCharacter
} from './lib.js';

const input = document.querySelector('input');
const ul = document.querySelector('ul');
const characters = [];

input.addEventListener('keyup', showCharacter);

const superheroes = async () => {
    let response = await fetch("https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json")
    let result = await response.json().then(data => {
        characters.push(...data);
        return data;
    }).catch(err => {
        return err;
    });
    return result;
};
superheroes().then(result => {
    if (!result || result instanceof Error) {
        console.error(`Pb de connexion : ${result.message}`);
    } else {
        createCharacter(characters)
    }
}).catch(err => console.log(err.message));

function createCharacter(people) {
    const results = people.map(async (character) => {
        createCardCharacter(character);
    });
    Promise.all(results).then((completed) => {
        console.log(`Affichage terminé ${completed}`);
        imgLoad();
    });
}

function findPersonnage(recherche, characters) {
    return characters.filter(character => {
        // gi g pour global et i majuscule ou pas
        const regex = new RegExp(recherche, 'gi');
        return character.name.match(regex);
    })
}

function showCharacter() {
    let tabResult = findPersonnage(this.value, characters);
    ul.innerHTML = "";
    createCharacter(tabResult);
}

if(navigator.serviceWorker){
    navigator.serviceWorker.register('sw.js')
        .then((registration)=>{
            console.log(`Sw est enregistré ${registration}`)
        }).catch(err => console.log(err.message));
}

// On vérifie si le navigateur à bien un ystème de cache
if (window.caches) {
    caches.open('comics-cache-1.0').then(cache => {
        // Une fois le cache crée on va utiliser addAll
        // elle va permettre de stocker des fichiers
        cache.addAll([
            './assets/js/app.js',
            './assets/js/lib.js',
            './assets/css/all.min.css',
            './assets/css/app.css',
            './assets/css/reset.css',
            './assets/webfonts/fa-brands-400.eot',
            './assets/webfonts/fa-brands-400.svg',
            './assets/webfonts/fa-brands-400.ttf',
            './assets/webfonts/fa-brands-400.woff',
            './assets/webfonts/fa-brands-400.woff2',
            './assets/webfonts/fa-regular-400.eot',
            './assets/webfonts/fa-regular-400.svg',
            './assets/webfonts/fa-regular-400.ttf',
            './assets/webfonts/fa-regular-400.woff',
            './assets/webfonts/fa-regular-400.woff2',
            './assets/webfonts/fa-solid-900.eot',
            './assets/webfonts/fa-solid-900.svg',
            './assets/webfonts/fa-solid-900.ttf',
            './assets/webfonts/fa-solid-900.woff',
            './assets/webfonts/fa-solid-900.woff2',
        ]);
    });

}