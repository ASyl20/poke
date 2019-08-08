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
    spanReadMore.textContent = "Read More";
    spanOffline.textContent = "Save";
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
};

export {
    imgLoad,
    createCardCharacter
};
