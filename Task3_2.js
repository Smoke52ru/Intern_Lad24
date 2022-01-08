// RPG battle
// Алгоритм боя:
//  * Игроки выбирают действие (первый - соперник, затем сообщает о своем выборе)
//  * Первым наносит урон соперник
//  * Затем, если у игрока достаточно здоровья, он наносит ответный урон, иначе проигрывает бой
//  * Проверка здоровья соперника. Если <=0, то бой заканчивается победой игрока
//

const readline = require('readline-sync')

// Противник
const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ]
}

// Игрок
const hero = {
    maxHealth: 10,
    name: "Евстафий",
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4
        },
    ]
}

//Функция показывающая все характеристики действия
function showAction(obj, prefix = '') {
    for (let key in obj) {
        console.log(`${prefix}${key}: ${obj[key]}`)
    }
    console.log()
}

//Функция выводящая в консоль выделенный символами текст (заголовок)
function logHeader(text, prefix = '', postfix = prefix) {
    console.log(`${prefix}${text}${postfix}`)
}

function startBattle(player = hero, enemy = monster) {
    logHeader(`\nFIGHT!!!\n`, '~~~~~~~~~~~~~~~~~~~')
    //Инициализируем переменные отвечающие за текущее здоровье и перезарядку умений
    player.HP = player.maxHealth
    enemy.HP = enemy.maxHealth
    player.cooldowns = []
    for (let i=0;i<player.moves.length;i++) {
        player.cooldowns[i]=0
    }
    enemy.cooldowns = []
    for (let i=0;i<enemy.moves.length;i++) {
        enemy.cooldowns[i]=0
    }

    //Основной цикл
    for (let turn = 1; ; turn++) {
        //Противник выбирает действие и сообщает о нем. Можно выбрать только готовое к использованию
        let enemyActionNumber
        let enemyAction
        while (true) {
            enemyActionNumber = Math.floor(Math.random() * enemy.moves.length)
            if (enemy.cooldowns[enemyActionNumber] <= 0) {
                break
            }
        }
        enemyAction = enemy.moves[enemyActionNumber]
        logHeader(`\nEnemy action:`)
        showAction(enemyAction, '\t')

        //Игрок выбирает действие. Можно выбрать только готовое к использованию
        logHeader(`Your moves:`)
        let counter = 1
        for (let action of player.moves) {
            console.log(`\t#${counter++}. #####`)
            showAction(action, '\t\t')
        }
        let playerActionNumber
        let playerAction
        while (true) {
            playerActionNumber = readline.question(`\nEnter number of action: `) - 1
            playerAction = player.moves[playerActionNumber]
            if (player.cooldowns[playerActionNumber] <= 0) {
                break
            } else {
                console.log(`* This skill on cooldown\n* ${player.cooldowns[playerActionNumber]} turns remaining`)
            }
        }

        //После выбора действий уменьшаем кулдаун каждого, кроме выбранного
        for (let i = 0; i < player.cooldowns.length; i++) {
            player.cooldowns[i] = (player.cooldowns[i] > 0) ? player.cooldowns[i] - 1 : 0
        }

        //Далее взаимный обмен уроном.
        // Первым ходит соперник
        enemy.cooldowns[enemyActionNumber] = enemyAction.cooldown
        let calculatedDmgToPlayer =
            (
                enemyAction.physicalDmg * (1 - playerAction.physicArmorPercents / 100) +
                enemyAction.magicDmg * (1 - playerAction.magicArmorPercents / 100)
            )
        player.HP -= calculatedDmgToPlayer

        console.log(
            `${enemy.name} attacked you with ${enemyAction.name} and dealt ${calculatedDmgToPlayer} damage.\n`+
            `You have ${(player.HP<=0)? 0 : player.HP}HP`
        )

        //Если у игрока кончилось здоровье, то его соперник победил
        if (player.HP <= 0) {
            console.log(`\n~~~Вы проиграли!~~~\n`)
            break
        }

        //Ответный урон сопернику
        player.cooldowns[playerActionNumber] = playerAction.cooldown
        let calculatedDmgToEnemy =
            (
                playerAction.physicalDmg * (1 - enemyAction.physicArmorPercents / 100) +
                playerAction.magicDmg * (1 - enemyAction.magicArmorPercents / 100)
            )
        enemy.HP -= calculatedDmgToEnemy

        console.log(
            `You attacked ${enemy.name} with ${playerAction.name} and dealt ${calculatedDmgToEnemy} damage.\n`+
            `He have ${(enemy.HP<=0)? 0 : enemy.HP}HP`
        )

        //Если у соперника кончилось здоровье, то его игрок победил
        if (enemy.HP <= 0) {
            console.log(`+++Вы выиграли!+++`)
            break
        }

    }
}

startBattle()