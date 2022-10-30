export type LimitedUsage = {
    cost: number,
        recharge: string,
        usages: number
}

export type multiRange = {
    low: number,
    heigh: number,
    unit: string
}

export type simpleRange = {
    value: number,
    unit: string,
}

export type Trait = {
    name: string,
    descriptions: string[],
    action: string,
    image: string | null,
    limitedUsage: LimitedUsage | null,
    range: simpleRange | multiRange | null,
    isLegendary: boolean,
    isAction: boolean,
}

export type Item = Trait & {
    quantity: number,
}

export type Spell = Item & {
    spellLevel: number,
}