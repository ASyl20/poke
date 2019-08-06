const input = document.querySelector('input');
const charactersCenter = document.querySelector('.character-center');
const characters = [];
const db = 'db.json'
const superheroes = () => {
     return new Promise((resolve,reject)=>{
        fetch("https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json")
        .then(blob=>{ 
            blob.json().then(data=>{
                    // console.log(...data)
                    // ... Tu prends toutes les données tu les met les unes apres les autres mais sans array
                    characters.push(data);
                    // console.log(...heroes[0]);
                    resolve(data)
                })
                .catch(err=>{
                    console.log(err.message);
                    reject(err.message)
                });
            });
    });
};
superheroes().then(result=>{
    if(!result){
        console.log('Pb de connexion');
    }else{
        console.log( characters);
        Object.entries(characters[0]).map((character,index)=>{
            // console.log(index)
            // console.log(character[1])
            createCardCharacter(character[1])
        });
    }
}).catch(err=>console.log(err.message));

function createCardCharacter(character){
    // console.log(character.image.url)
    let character__card = document.createElement('div')
    character__card.className="character"
    let character__card__header = document.createElement('div')
    character__card__header.className="character__header"
    let image__card= document.createElement('img');
    let character__card__body = document.createElement('div')
    character__card__body.className="character__body"
    let character__card_text = document.createElement('span')
    image__card.src= (character.images.lg ? character.images.lg  :"https://dummyimage.com/600x400/000/fff.png&text=No+image")
    image__card.alt = character.name
    character__card_text.textContent = character.name;
    character__card__header.appendChild(image__card)
    character__card.appendChild(character__card__header)
    character__card__body.appendChild(character__card_text)
    character__card.appendChild(character__card__body)
    charactersCenter.appendChild(character__card)
}