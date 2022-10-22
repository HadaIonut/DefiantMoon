const bestiaryDir = Deno.readDir('./data/bestiary')
const allKeys = new Set()

for await (const file of bestiaryDir) {
    if (!file.isFile) continue

    const monsterList = JSON.parse(await Deno.readTextFile(`./data/bestiary/${file.name}`))

    if (!monsterList?.monster) continue

    monsterList.monster.forEach(element => {
        if (!element?.spellcasting) return

        // console.log(element.spellcasting?.daily)
        element.spellcasting.forEach(spellcasting => {
            if (spellcasting?.hidden) console.log(element.name)
        })
    });
}


console.log(allKeys)