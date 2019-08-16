

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
    async getAllId(){
        let allCharacters = await this.db.allDocs({include_docs:true})
        let characters = []
        allCharacters.rows.forEach(c=>{
            characters.push(c.doc.id)
        })
        return characters
    }
    async createCharacter(character){
        console.log(character)
        character.createdAt = new Date()
        character.updatedAt = new Date()

        const res = await this.db.post({...character})
        console.log(res)
        return res
    }
    async removeCharacter(id,rev){
        console.log(id)
        console.log(rev)
        return this.db.remove(id, rev).then(result=>{
            console.log(`${result} a été supprimé`)
        }).catch(err=>{
            console.log(err.message)
        })
    }
}

