const input = document.querySelector('input');

// const ul = document.querySelector('ul');
const characters = [];
var db = null;
const database = 'ComicsPedia-v1.0.0'
input.addEventListener('keyup', showCharacter);


const superheroes = async () => {
    db = new DB(database)
    let response = await fetch("https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json")
        .catch((err) => {
            // alert(err)
            console.error(`Impossible de charger l'url ${err.message}`)
            if ('serviceWorker' in navigator) {
                console.log('Prb hors ligne')
                navigator.serviceWorker.ready.then(registration => {
                    console.log(`Enregistrement du sw ${registration}`)
                    // Vérifier que la bd existe
                    db.db.info().then((dbase) => {
                        if (dbase.db_name == database && dbase.doc_count != 0) {
                            db.getAllCharacters().then((character) => {
                                characters.push(...character)
                            }).then(() => {
                                createCharacter(characters)
                            }).catch((err) => {
                                console.log('Une erreur est survenue : ', err.message)
                            })
                        } else {
                            console.warn('Base de données vide')
                        }
                    })
                })
            } else {
                console.log('Votre navigateur n\'est pas supporter')
            }
        })
    let result = await response.json().then(data => {
        // console.log(data)
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
}).catch(err => {
    console.log(err.message)
});

function createCharacter(people) {
    const results = people.map(async (character) => {
        createCardCharacter(character);
    });
    Promise.all(results).then((completed) => {
        console.log(`Affichage terminé ${completed}`);
        imgLoad();
    }).then(() => {
        // console.log(...c)
        const offline = document.querySelectorAll('.offline')
        btnOffline(offline)
    });
}


if (navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js')
        .then((registration) => {
            console.log(`Sw est enregistré ${registration}`)
        }).catch(err => {
            console.log(err.message)
        });
}

// On vérifie si le navigateur à bien un ystème de cache
// if (window.caches) {
//     caches.open('comics-cache-1.0').then(cache => {
//         // Une fois le cache crée on va utiliser addAll
//         // elle va permettre de stocker des fichiers
//         cache.addAll([
//             './index.html',
//             './assets/js/app.js',
//             './assets/js/main.js',
//             './assets/js/lib.js',
//             './assets/css/all.min.css',
//             './assets/css/app.css',
//             './assets/css/reset.css',
//             './assets/webfonts/fa-brands-400.eot',
//             './assets/webfonts/fa-brands-400.svg',
//             './assets/webfonts/fa-brands-400.ttf',
//             './assets/webfonts/fa-brands-400.woff',
//             './assets/webfonts/fa-brands-400.woff2',
//             './assets/webfonts/fa-regular-400.eot',
//             './assets/webfonts/fa-regular-400.svg',
//             './assets/webfonts/fa-regular-400.ttf',
//             './assets/webfonts/fa-regular-400.woff',
//             './assets/webfonts/fa-regular-400.woff2',
//             './assets/webfonts/fa-solid-900.eot',
//             './assets/webfonts/fa-solid-900.svg',
//             './assets/webfonts/fa-solid-900.ttf',
//             './assets/webfonts/fa-solid-900.woff',
//             './assets/webfonts/fa-solid-900.woff2',
//         ]);
//     });

// }