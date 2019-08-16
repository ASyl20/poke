const imgLoad = () => {
    const images = document.querySelectorAll("[data-src]");

    images.forEach(image => {
        imgObserver.observe(image);
    });
};

function preloadImage(img) {
    const src = img.getAttribute("data-src");
    if (!src) {
        return;
    }
    img.src = src;
    img.removeAttribute('data-src');
    img.onerror = function () {
        this.onerror = null;
        this.src = "https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/no-portrait.jpg";
    };
}
const imgOptions = {};

const imgObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            preloadImage(entry.target);
            imgObserver.unobserve(entry.target);
        }
    });
}, imgOptions);


btnOffline = (offline) => {
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


const ul = document.querySelector('ul');
const createCardCharacter = (character) => {
    let listItem = document.createElement('li');
    let a = document.createElement('a');
    let divAvatar = document.createElement('div');
    let image = document.createElement('img');
    let divButton = document.createElement('div');
    let spanTitle = document.createElement('span');
    let spanReadMore = document.createElement('span');
    let spanOffline = document.createElement('span');

    image.setAttribute('data-src', (character.images.sm ? character.images.sm : "https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/no-portrait.jpg"))
    image.alt = character.name;
    spanTitle.textContent = character.name;
    spanReadMore.innerHTML = '<i class="fab fa-readme fa-2x"></i>';
    spanReadMore.className = "readmore";
    spanOffline.setAttribute('data-id', character.id);
    spanOffline.className = "offline";
    spanOffline.innerHTML = '<i id="character-' + character.id + '" class="far fa-heart fa-2x"></i>';
    divAvatar.className = "avatar";
    divButton.className = "buttons";
    spanTitle.className = "title";
    divAvatar.appendChild(image);
    divButton.appendChild(spanReadMore);
    divButton.appendChild(spanOffline);
    a.appendChild(divAvatar);
    a.appendChild(spanTitle);
    a.appendChild(divButton);
    listItem.appendChild(a);
    ul.appendChild(listItem);

    db.getAllId().then(c => {
        if (c.includes(character.id)) {
            document.querySelector('#character-' + character.id).className = "fas fa-heart fa-2x"
        }
    })
};
