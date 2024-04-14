'use strict';

const autoRole = {
    createRole: function () {
        var totalEnergy = 0;
        var totalStructureExtension = 0;
        for (var roomName in Game.rooms) {
            totalEnergy += Game.rooms[roomName].energyAvailable;
            totalStructureExtension = Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION);
                }
            }).length;
        }
        var numberOfCreeps = Object.keys(Game.creeps).length;
        var numberOfAttackers = _.filter(Memory.creeps, (creep) => creep.role === 'attacker').length;
        if (totalEnergy < 300) {
            return -1;
        }
        if (numberOfAttackers < 2) {
            var newName = 'attacker' + Game.time;
            const state = Game.spawns['Spawn1'].spawnCreep([ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], newName, {
                memory: {
                    role: 'attacker',
                }
            });
            if (state == OK) {
                console.log('Spawning new attacker: ' + newName);
            }
            else {
                console.log("fail " + state);
            }
        }
        if (numberOfCreeps < 6) {
            if (totalEnergy >= 550 && totalStructureExtension == 5) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
                    memory: {
                        role: 'harvester',
                    }
                });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                }
                else {
                    console.log("fail " + state);
                }
            }
            if (totalEnergy >= 500 && totalStructureExtension == 4) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName, {
                    memory: {
                        role: 'harvester',
                    }
                });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                }
                else {
                    console.log("fail " + state);
                }
            }
            if (totalEnergy >= 450 && totalStructureExtension == 3) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], newName, {
                    memory: {
                        role: 'harvester',
                    }
                });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                }
                else {
                    console.log("3fail " + state);
                }
            }
            else if (totalEnergy >= 400 && totalStructureExtension == 2) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName, {
                    memory: {
                        role: 'harvester',
                    }
                });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                }
                else {
                    console.log("fail " + state);
                }
            }
            else if (totalEnergy >= 350 && totalStructureExtension == 1) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName, {
                    memory: {
                        role: 'harvester',
                    }
                });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                }
                else {
                    console.log("fail " + state);
                }
            }
            else if (totalStructureExtension == 0 && totalEnergy >= 300) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], newName, {
                    memory: {
                        role: 'harvester',
                    }
                });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                }
                else {
                    console.log("fail " + state);
                }
            }
        }
    },
    toHarvester: function (creep) {
        // 寻找最近的资源
        const closestSource = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (source) => {
                if (creep.isCanCloset(source)) {
                    return source;
                }
            }
        });
        if (closestSource) {
            // 如果距离资源太远，则移动到资源附近
            if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },
    toTransfer: function (creep) {
        console.log(2);
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            this.toRepairer(creep);
        }
    },
    toBuilder: function (creep) {
        if (creep.store[RESOURCE_ENERGY] > 0) {
            const site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                filter: (site) => {
                    return site;
                }
            });
            if (site) {
                if (creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site, { visualizePathStyle: { stroke: '#ffffff' } });
                    creep.say('🚧 build');
                }
            }
            else {
                this.toUpgrader(creep);
            }
        }
    },
    /**
     *
     * @param creep 执行升级任务
     */
    toUpgrader: function (creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            creep.say("upgrading");
        }
    },
    toRepairer: function (creep) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax);
            }
        });
        if (target) {
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            this.toBuilder(creep);
        }
    }
};

const worker = {
    run: function (creep) {
        // 如果 creep 正在采集资源，并且当前的能量已经满了，则切换状态
        if (creep.memory.working == "harvester" && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = "transfer";
            creep.say('🔄 Transfer');
        }
        // 如果 creep 不在采集资源，并且当前的能量已经用完了，则切换状态
        if (creep.memory.working != "harvester" && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = "harvester";
            creep.say('⚡ Harvest');
        }
        // 如果当前是工作状态，即需要采集资源
        if (creep.memory.working == "harvester") {
            autoRole.toHarvester(creep);
        }
        else if (creep.memory.working == "transfer") { // 如果当前是转移资源的状态
            var controller = Game.rooms["W34N7"].controller;
            if (controller) { //如果即将掉级，进入升级状态，维护等级
                var ticksToDowngrade = controller.ticksToDowngrade;
                if (ticksToDowngrade < 1000) {
                    console.log("房间控制器 downgrade 剩余时间：" + ticksToDowngrade + " ticks");
                    autoRole.toUpgrader(creep);
                    return;
                }
            }
            else {
                console.log("未找到房间控制器");
            }
            autoRole.toTransfer(creep);
        }
    }
};

const extendCreep = {
    extend: function (creep) {
        creep.isCanCloset = this.isCanCloset;
    },
    isCanCloset: function (source) {
        const room = Game.rooms[source.room.name];
        const range = 1; // 检查范围
        // 获取资源的位置
        const { x, y } = source.pos;
        // 使用 Room.lookForAtArea() 方法获取指定区域内的地形信息
        const terrain = room.lookForAtArea('terrain', y - range, x - range, y + range, x + range, true);
        // 遍历获取的地形信息
        for (const tile of terrain) {
            if (tile.terrain === 'plain' || tile.terrain === 'swamp') {
                // 使用 Room.lookForAt() 方法检查该位置是否有单位
                const objects = room.lookForAt(LOOK_CREEPS, tile.x, tile.y);
                if (objects.length > 0) {
                    for (const object of objects) {
                        if (object.name == this.name) {
                            return true;
                        }
                    }
                }
                else {
                    return true;
                }
            }
        }
        return false; // 如果资源周围没有空地，则返回 false
    }
    // 这里可以添加 MCreep 特有的方法或者属性
};

const attacker = {
    run: function (creep) {
        if (creep.memory.role === 'attacker') {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                // 如果找到敌人，则向其移动并攻击
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else { //没找到敌人前往集合点
                var flag = Game.flags["Flag1"];
                if (flag) {
                    if (creep.moveTo(flag) === ERR_NO_PATH) {
                        console.log("无法到达目标位置");
                    }
                }
                else {
                    console.log("未找到名为 Flag1 的旗帜");
                }
            }
        }
    }
};

const loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    autoRole.createRole();
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        extendCreep.extend(creep);
        if (creep.memory.role === "harvester") {
            worker.run(creep);
        }
        if (creep.memory.role === "attacker") {
            attacker.run(creep);
        }
    }
};

exports.loop = loop;
//# sourceMappingURL=main.js.map
