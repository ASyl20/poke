

class DB{
    constructor(name){
        this.db = new PouchDB(name)
    }
    async getAllCharacters(){
        let allCharacters = await this.db.allDocs({include_docs:true})
        let characters = []
        allCharacters.rows.forEach(c=>characters.push(c.doc))
        return characters
    }
    async createCharacter(character){
        console.log(character)
        character.createdAt = new Date()
        character.updatedAt = new Date()

        const res = await this.db.post({...character})
        return res
    }
}

