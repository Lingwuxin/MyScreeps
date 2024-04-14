{"version":3,"file":"main.js","sources":["../src/controller/autoRole.ts","../src/role/worker.ts","../src/extend/MCreep.ts","../src/role/attacker.ts","../src/main.ts"],"sourcesContent":["\r\nconst autoRole = {\r\n   \r\n    createRole: function () {\r\n        var totalEnergy = 0;\r\n        var totalStructureExtension = 0\r\n        for (var roomName in Game.rooms) {\r\n            totalEnergy += Game.rooms[roomName].energyAvailable;\r\n            totalStructureExtension = Game.rooms[roomName].find(FIND_STRUCTURES, {\r\n                filter: (structure) => {\r\n                    return (structure.structureType == STRUCTURE_EXTENSION)\r\n                }\r\n            }).length\r\n        }\r\n        var numberOfCreeps = Object.keys(Game.creeps).length;\r\n        var numberOfAttackers = _.filter(Memory.creeps, (creep) => creep.role === 'attacker').length;\r\n        if (totalEnergy < 300) {\r\n            return -1;\r\n        }\r\n        if(numberOfAttackers<2){\r\n            var newName = 'attacker' + Game.time;\r\n            const state = Game.spawns['Spawn1'].spawnCreep([ ATTACK, ATTACK, ATTACK,MOVE,MOVE,MOVE], newName,\r\n                {\r\n                    memory: {\r\n                        role: 'attacker',\r\n\r\n                    }\r\n                });\r\n                if (state == OK) {\r\n                    console.log('Spawning new attacker: ' + newName);\r\n                } else {\r\n                    console.log(\"fail \" + state)\r\n                } \r\n        }\r\n        if (numberOfCreeps <6) {\r\n            if (totalEnergy >= 550 && totalStructureExtension == 5) {\r\n                var newName = 'harvester' + Game.time;\r\n                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,\r\n                    {\r\n                        memory: {\r\n                            role: 'harvester',\r\n\r\n                        }\r\n                    });\r\n                if (state == OK) {\r\n                    console.log('Spawning new harvester: ' + newName);\r\n                } else {\r\n                    console.log(\"fail \" + state)\r\n                }\r\n            }\r\n            if (totalEnergy >= 500 && totalStructureExtension == 4) {\r\n                var newName = 'harvester' + Game.time;\r\n                const state = Game.spawns['Spawn1'].spawnCreep([WORK,WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName,\r\n                    {\r\n                        memory: {\r\n                            role: 'harvester',\r\n\r\n                        }\r\n                    });\r\n                if (state == OK) {\r\n                    console.log('Spawning new harvester: ' + newName);\r\n                } else {\r\n                    console.log(\"fail \" + state)\r\n                }\r\n            }\r\n            if (totalEnergy >= 450 && totalStructureExtension == 3) {\r\n                var newName = 'harvester' + Game.time;\r\n                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK,WORK, CARRY,MOVE, MOVE], newName,\r\n                    {\r\n                        memory: {\r\n                            role: 'harvester',\r\n\r\n                        }\r\n                    });\r\n                if (state == OK) {\r\n                    console.log('Spawning new harvester: ' + newName);\r\n                } else {\r\n                    console.log(\"3fail \" + state)\r\n                }\r\n            }\r\n            else if (totalEnergy >= 400 && totalStructureExtension == 2) {\r\n                var newName = 'harvester' + Game.time;\r\n                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,\r\n                    {\r\n                        memory: {\r\n                            role: 'harvester',\r\n\r\n                        }\r\n                    });\r\n                if (state == OK) {\r\n                    console.log('Spawning new harvester: ' + newName);\r\n                } else {\r\n                    console.log(\"fail \" + state)\r\n                }\r\n            }\r\n            else if (totalEnergy >= 350 && totalStructureExtension == 1) {\r\n                var newName = 'harvester' + Game.time;\r\n                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,\r\n                    {\r\n                        memory: {\r\n                            role: 'harvester',\r\n\r\n                        }\r\n                    });\r\n                if (state == OK) {\r\n                    console.log('Spawning new harvester: ' + newName);\r\n                } else {\r\n                    console.log(\"fail \" + state)\r\n                }\r\n            }\r\n            else if (totalStructureExtension == 0 && totalEnergy >= 300) {\r\n                var newName = 'harvester' + Game.time;\r\n                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], newName,\r\n                    {\r\n                        memory: {\r\n                            role: 'harvester',\r\n\r\n                        }\r\n                    });\r\n                if (state == OK) {\r\n                    console.log('Spawning new harvester: ' + newName);\r\n                } else {\r\n                    console.log(\"fail \" + state)\r\n                }\r\n            }\r\n\r\n        }\r\n\r\n\r\n\r\n    },\r\n    toHarvester: function (creep:Creep) {\r\n        // 寻找最近的资源\r\n        \r\n        const closestSource = creep.pos.findClosestByPath(FIND_SOURCES, {\r\n            filter: (source) => {\r\n                if (creep.isCanCloset(source)) {\r\n                    return source\r\n                }\r\n            }\r\n        })\r\n        if (closestSource) {\r\n            // 如果距离资源太远，则移动到资源附近\r\n            if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {\r\n                creep.moveTo(closestSource, { visualizePathStyle: { stroke: '#ffaa00' } });\r\n            }\r\n        }\r\n    },\r\n    toTransfer:function(creep:Creep){\r\n        console.log(2)\r\n        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {\r\n            filter: (structure) => {\r\n                return (structure.structureType == STRUCTURE_EXTENSION ||\r\n                    structure.structureType == STRUCTURE_SPAWN ||\r\n                    structure.structureType == STRUCTURE_TOWER) &&\r\n                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;\r\n            }\r\n        })\r\n        if (target) {\r\n            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {\r\n                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });\r\n            }\r\n        } else {\r\n            this.toRepairer(creep)\r\n            \r\n        }\r\n    },\r\n    toBuilder: function (creep:Creep) {\r\n        if (creep.store[RESOURCE_ENERGY] > 0) {\r\n            const site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {\r\n                filter: (site) => {\r\n                    return site\r\n                }\r\n            });\r\n            if (site) {\r\n                if (creep.build(site) == ERR_NOT_IN_RANGE) {\r\n                    creep.moveTo(site, { visualizePathStyle: { stroke: '#ffffff' } });\r\n                    creep.say('🚧 build');\r\n                }\r\n            } else {\r\n                this.toUpgrader(creep)\r\n            }\r\n        }\r\n\r\n    },\r\n    /**\r\n     * \r\n     * @param creep 执行升级任务\r\n     */\r\n    toUpgrader: function (creep:Creep) {\r\n        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {\r\n            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });\r\n            creep.say(\"upgrading\")\r\n        }\r\n\r\n    },\r\n    toRepairer:function(creep:Creep){\r\n        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {\r\n            filter: (structure) => {\r\n                return (structure.hits < structure.hitsMax);\r\n            }\r\n        });\r\n        if(target){\r\n            if (creep.repair(target) == ERR_NOT_IN_RANGE) {\r\n                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});\r\n            }\r\n        }\r\n        else{\r\n            this.toBuilder(creep)\r\n        }\r\n    }\r\n}\r\nexport default autoRole;","import { filter } from \"lodash\";\nimport autoRole from \"@/controller/autoRole\";\nconst worker = {\n    run: function (creep: Creep) {\n        // 如果 creep 正在采集资源，并且当前的能量已经满了，则切换状态\n        if (creep.memory.working == \"harvester\" && creep.store.getFreeCapacity() == 0) {\n            creep.memory.working = \"transfer\";\n            creep.say('🔄 Transfer');\n        }\n        // 如果 creep 不在采集资源，并且当前的能量已经用完了，则切换状态\n        if (creep.memory.working != \"harvester\" && creep.store[RESOURCE_ENERGY] == 0) {\n            creep.memory.working = \"harvester\";\n            creep.say('⚡ Harvest');\n        }\n\n        // 如果当前是工作状态，即需要采集资源\n        if (creep.memory.working == \"harvester\") {\n            autoRole.toHarvester(creep)\n\n        } else if (creep.memory.working == \"transfer\") { // 如果当前是转移资源的状态\n            var controller = Game.rooms[\"W34N7\"].controller;\n            if (controller) {//如果即将掉级，进入升级状态，维护等级\n                var ticksToDowngrade = controller.ticksToDowngrade;\n                if (ticksToDowngrade < 1000) {\n                    console.log(\"房间控制器 downgrade 剩余时间：\" + ticksToDowngrade + \" ticks\");\n                    autoRole.toUpgrader(creep)\n                    return\n                }\n            }\n            else {\n                console.log(\"未找到房间控制器\");\n            }\n            autoRole.toTransfer(creep)\n        }\n    }\n};\n\nexport default worker;","\r\nconst extendCreep ={\r\n    extend:function(creep:Creep){\r\n        creep.isCanCloset=this.isCanCloset\r\n    },\r\n    isCanCloset:function(source: Source): boolean{\r\n        const room = Game.rooms[source.room.name];\r\n        const range = 1; // 检查范围\r\n\r\n        // 获取资源的位置\r\n        const { x, y } = source.pos;\r\n\r\n        // 使用 Room.lookForAtArea() 方法获取指定区域内的地形信息\r\n        const terrain = room.lookForAtArea('terrain', y - range, x - range, y + range, x + range, true);\r\n\r\n        // 遍历获取的地形信息\r\n        for (const tile of terrain) {\r\n\r\n            if (tile.terrain === 'plain' || tile.terrain === 'swamp') {\r\n                // 使用 Room.lookForAt() 方法检查该位置是否有单位\r\n                const objects = room.lookForAt(LOOK_CREEPS, tile.x, tile.y);\r\n                if (objects.length > 0) {\r\n                    for(const object of objects){\r\n                        if(object.name==this.name){\r\n                            return true\r\n                        }\r\n                    }\r\n                }else{\r\n                    return true\r\n                }\r\n            }\r\n        }\r\n\r\n        return false; // 如果资源周围没有空地，则返回 false\r\n    }\r\n    // 这里可以添加 MCreep 特有的方法或者属性\r\n}\r\nexport default extendCreep","\r\n\r\nconst attacker = {\r\n    run: function (creep: Creep) {\r\n        if (creep.memory.role === 'attacker') {\r\n            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);\r\n            if (target) {\r\n                // 如果找到敌人，则向其移动并攻击\r\n                if (creep.attack(target) === ERR_NOT_IN_RANGE) {\r\n                    creep.moveTo(target);\r\n                }\r\n            } else {//没找到敌人前往集合点\r\n                var flag = Game.flags[\"Flag1\"];\r\n                if (flag) {\r\n                    if (creep.moveTo(flag) === ERR_NO_PATH) {\r\n                        console.log(\"无法到达目标位置\");\r\n                    }\r\n                } else {\r\n                    console.log(\"未找到名为 Flag1 的旗帜\");\r\n                }\r\n            }\r\n        }\r\n    }\r\n}\r\nexport default attacker","import worker from './role/worker'\nimport autoRole from './controller/autoRole'\nimport extendCreep from './extend/MCreep'\nimport { errorMapper } from './modules/errorMapper'\nimport attacker from './role/attacker';\n\nexport const loop = function () {\n    for(var name in Memory.creeps) {\n        if(!Game.creeps[name]) {\n            delete Memory.creeps[name];\n            console.log('Clearing non-existing creep memory:', name);\n        }\n    }\n    autoRole.createRole()\n    for(var name in Game.creeps) {\n        var creep = Game.creeps[name];\n        extendCreep.extend(creep)\n        if(creep.memory.role===\"harvester\"){\n            worker.run(creep)\n        }\n        if(creep.memory.role===\"attacker\"){\n            attacker.run(creep)\n        }\n    }\n}"],"names":[],"mappings":"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"}