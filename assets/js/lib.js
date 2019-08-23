

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// const ul = document.querySelector('ul');

// Effets de transitions



const appearOptions = {
    threshold:0,
    rootMargin:"0px 0px -50px 0px"
};

const apperOnScroll = new IntersectionObserver(function(entries,appearOnScrool){
    entries.forEach(entry=>{
        if(!entry.isIntersecting){
            return;
        }else{
            // console.log(entry.target)
            entry.target.classList.add('appear')
            appearOnScrool.unobserve(entry.target)
        }
    });
},appearOptions);

const imgLoad = () => {
    const images = document.querySelectorAll("[data-src]");
    const faders = document.querySelectorAll('.fade-in')
    
    //  Ajout 
    images.forEach(image => {
        imgObserver.observe(image);
    });
    // Ajout d'effets fade-in
    faders.forEach(fader=>{
        apperOnScroll.observe(fader)
    })
};

function preloadImage(img) {
    const src = img.getAttribute("data-src");
    if (!src) {
        return;
    }
    img.src = src;
    img.onerror = function () {
        this.onerror = null;
        this.src = "./assets/images/no-portrait.jpg";
    };
}
const imgOptions = {
    threshold:0,
    rootMargin:"0px 0px 300px 0px"
};

const imgObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach(entry => {
        if(entry.intersectionRatio !=1){
            entry.target.src = "./assets/images/no-portrait.jpg";
        }
        if (!entry.isIntersecting) {
            return;
        } else {
            preloadImage(entry.target);
            // imgObserver.unobserve(entry.target);
        }
    });
}, imgOptions);

// Sauvegarde dans la base de données pouchdb offline
const btnOffline = (offline) => {
    Object.entries(offline).map(off => {
        off[1].addEventListener('click', function (e) {
            if (e.target.classList.contains('far')) {
                e.target.className = "fas fa-heart fa-2x"
                let c = characters.filter((character) => {
                    if (character.id === parseInt(this.getAttribute("data-id"))) {
                        return character;
                    }
                });
                db.createCharacter(...c).then(obj => {
                    e.target.setAttribute('doc-id', obj.id)
                    e.target.setAttribute('doc-rev', obj.rev)
                }).catch(e => {
                    console.log(e.message);
                });
            } else {
                e.target.className = "far fa-heart fa-2x"
                let id = e.target.getAttribute("doc-id")
                let rev = e.target.getAttribute("doc-rev")
                db.removeCharacter(id, rev).then((success) => {
                    console.log(success);
                }).catch((e) => {
                    console.error(e.message);
                });
            }
        });
    });
}

// Fonction de recherche
function findPersonnage(recherche, characters) {
    return characters.filter(character => {
        // gi g pour global et i majuscule ou pas
        const regex = new RegExp(recherche, 'gi');
        return character.name.match(regex);
    })
}
// Creer un personnage
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
// Affiche un personnage apres recherche
function showCharacter() {
    let tabResult = findPersonnage(this.value, characters);
    ul.innerHTML = "";
    createCharacter(tabResult);
}


//  Création d'une card
const createCardCharacter = (character) => {
    let listItem = document.createElement('li');
    let a = document.createElement('a');
    let divAvatar = document.createElement('div');
    let image = document.createElement('img');
    let divButton = document.createElement('div');
    let spanTitle = document.createElement('span');
    let spanReadMore = document.createElement('span');
    let spanOffline = document.createElement('span');

    image.setAttribute('data-src', (character.images.sm ? character.images.sm : "https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/xs/no-portrait.jpg"))
    image.src = "./assets/images/no-portrait.jpg";
    // image.style.backgroundImage = "url(./assets/images/no-portrait.jpg)";
    image.alt = character.name;
    spanTitle.textContent = character.name;
    spanReadMore.innerHTML = '<i class="fab fa-readme fa-2x"></i>';
    spanReadMore.className = "readmore";
    spanOffline.setAttribute('data-id', character.id);
    spanReadMore.setAttribute('data-id', character.id);
    spanOffline.className = "offline";
    spanOffline.innerHTML = '<i id="character-' + character.id + '" class="far fa-heart fa-2x"></i>';
    divAvatar.className = "avatar fade-in";
    divButton.className = "buttons fade-in";
    spanTitle.className = "title fade-in";
    divAvatar.appendChild(image);
    divButton.appendChild(spanReadMore);
    divButton.appendChild(spanOffline);
    a.appendChild(divAvatar);
    a.appendChild(spanTitle);
    a.appendChild(divButton);
    listItem.appendChild(a);
    ul.appendChild(listItem);
    db.getById(character.id).then(result => {
            if (result.length > 0) {
                // console.log(result)
                document.querySelector('#character-' + character.id).className = "fas fa-heart fa-2x"
                document.querySelector('#character-' + character.id).setAttribute('doc-id',result[0]._id)
                document.querySelector('#character-' + character.id).setAttribute('doc-rev',result[0]._rev)
            }
        })
        .catch(err => {
            console.error(err)
        })
    // db.getAllId().then(c => {
    //     if (c.includes(character.id)) {
    //         document.querySelector('#character-' + character.id).className = "fas fa-heart fa-2x"
    //     }
    // })
};

const description = (character) =>{
    

}