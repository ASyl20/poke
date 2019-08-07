const input = document.querySelector('input');
const ul = document.querySelector('ul')
const charactersCenter = document.querySelector('.character-center');
const characters = [];

input.addEventListener('change',showCharacter)

const superheroes = async () => {
    let response = await fetch("https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json")
    let result = await response.json().then(data => {
        characters.push(data)
        return data
    }).catch(err => {
        return err
    })
    return result
};
superheroes().then(result => {
    if (!result || result instanceof Error) {
        console.log(`Pb de connexion : ${result.message}`);
    } else {
        createCharacter(characters[0])
    }
}).then((result) => {
    const images = document.querySelectorAll("[data-src]")
    images.forEach(image => {
        imgObserver.observe(image)
    })
}).catch(err => console.log(err.message));

function createCharacter(people){
    console.log(people)
    Object.entries(people).map((character) => {
        createCardCharacter(character[1])
    });
}

function findPersonnage(recherche,characters){
    console.log(characters[0])
    return Object.entries(characters[0]).filter(character =>{
        // gi g pour global et i majuscule ou pas
        const regex = new RegExp(recherche,'gi')
        return character[1].name.match(regex)
    }).reduce((obj)=>{
        return {
            ...obj
        }
    })
}
function showCharacter(){
    const tabResult = findPersonnage(this.value,characters)
    console.log(tabResult)
    // console.log([tabResult][0])
    // console.log(characters)
    // createCharacter([tabResult][1])
}


function createCardCharacter(character) {
    // console.log(character)
    let listItem = document.createElement('li')
    let a = document.createElement('a')
    let divAvatar = document.createElement('div')
    let image = document.createElement('img')
    let divButton = document.createElement('div')
    let spanTitle = document.createElement('span')
    let spanReadMore = document.createElement('span')
    let spanOffline = document.createElement('span')

    image.setAttribute('data-src', (character.images.sm ? character.images.sm : "https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/no-portrait.jpg"))
    image.alt = character.name
    spanTitle.textContent = character.name
    spanReadMore.textContent = "Read More"
    spanOffline.textContent = "Save"
    divAvatar.className = "avatar"
    divButton.className = "buttons"
    spanTitle.className = "title"
    divAvatar.appendChild(image)
    divButton.appendChild(spanReadMore)
    divButton.appendChild(spanOffline)
    a.appendChild(divAvatar)
    a.appendChild(spanTitle)
    a.appendChild(divButton)
    listItem.appendChild(a)
    ul.appendChild(listItem)
}

function preloadImage(img) {
    const src = img.getAttribute("data-src")
    if (!src) {
        return;
    }
    img.src = src
    img.removeAttribute('data-src')
    img.onerror = function(){
        this.onerror = null;
        this.src="https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/no-portrait.jpg"
    }
}

const imgOptions = {};

const imgObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            preloadImage(entry.target)
            imgObserver.unobserve(entry.target)
        }
    })
}, imgOptions)
