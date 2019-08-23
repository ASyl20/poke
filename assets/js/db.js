class DB {
    constructor(name) {
        this.db = new PouchDB(name)
    }
    // Retourne tous les personnages
    async getAllCharacters() {
        let allCharacters = await this.db.allDocs({
            include_docs: true
        })
        let characters = []
        allCharacters.rows.forEach(c => characters.push(c.doc))
        return characters
    }
    // Retourne un personnage 
    async getAllId() {
        let allCharacters = await this.db.allDocs({
            include_docs: true
        })
        let characters = []
        allCharacters.rows.forEach(c => {
            characters.push(c.doc.id)
        })
        return characters
    }

    async getById(id) {

        let characters = []
        let res = await this.db.find({
            selector: {
                id: id
            },
            fields: ['id','_id', 'name','_rev'],
        }).then(function (result) {
            // handle result
            if (result.docs.length > 0) {
                characters.push(result.docs[0])
            }
        }).catch(function (err) {
            console.log(err);
        });
        return characters
    }
    // Insert un personnage
    async createCharacter(character) {
        console.log(character)
        character.createdAt = new Date()
        character.updatedAt = new Date()

        const res = await this.db.post({
            ...character
        })
        console.log(res)
        return res
    }
    // Supprime un personnage
    async removeCharacter(id, rev) {
        console.log(id)
        console.log(rev)
        return this.db.remove(id, rev).then(result => {
            console.log(`${result} a été supprimé`)
        }).catch(err => {
            console.log(err.message)
        })
    }
}