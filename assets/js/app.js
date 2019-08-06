const input = document.querySelector('input');
const charactersCenter = document.querySelector('.characters-center');
const characters = [];
const db = 'db.json'
const superheroes = () => {
     return new Promise((resolve,reject)=>{
        fetch("db.json")
        .then(blob=>{ 
            blob.json().then(data=>{
                    // ... Tu prends toutes les données tu les met les unes apres les autres mais sans array
                    console.log(data)
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
        console.log(typeof characters);
        Object.entries(characters).map(character=>{
            createCardCharacter(character[1])
        });
    }
}).catch(err=>console.log(err.message));

function createCardCharacter(character){
    console.log(character.name)
    let character__card = document.createElement('div')
    let character__card__header = document.createElement('div')
    let image__card= document.createElement('img');
    let character__card__body = document.createElement('div')
    let character__card_text = document.createElement('span')
    image__card.src= character.image.url
    image__card.alt = character.name
    character__card_text.textContent = character.name;
    charactersCenter.appendChild(character__card__header)
    charactersCenter.appendChild(character__card__body)
    charactersCenter.appendChild(image__card)
    charactersCenter.appendChild(character__card)
}