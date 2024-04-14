
const autoRole = {
   
    createRole: function () {
        var totalEnergy = 0;
        var totalStructureExtension = 0
        for (var roomName in Game.rooms) {
            totalEnergy += Game.rooms[roomName].energyAvailable;
            totalStructureExtension = Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION)
                }
            }).length
        }
        var numberOfCreeps = Object.keys(Game.creeps).length;
        var numberOfAttackers = _.filter(Memory.creeps, (creep) => creep.role === 'attacker').length;
        if (totalEnergy < 300) {
            return -1;
        }
        if(numberOfAttackers<2){
            var newName = 'attacker' + Game.time;
            const state = Game.spawns['Spawn1'].spawnCreep([ ATTACK, ATTACK, ATTACK,MOVE,MOVE,MOVE], newName,
                {
                    memory: {
                        role: 'attacker',

                    }
                });
                if (state == OK) {
                    console.log('Spawning new attacker: ' + newName);
                } else {
                    console.log("fail " + state)
                } 
        }
        if (numberOfCreeps <6) {
            if (totalEnergy >= 550 && totalStructureExtension == 5) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
                    {
                        memory: {
                            role: 'harvester',

                        }
                    });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                } else {
                    console.log("fail " + state)
                }
            }
            if (totalEnergy >= 500 && totalStructureExtension == 4) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK,WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName,
                    {
                        memory: {
                            role: 'harvester',

                        }
                    });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                } else {
                    console.log("fail " + state)
                }
            }
            if (totalEnergy >= 450 && totalStructureExtension == 3) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK,WORK, CARRY,MOVE, MOVE], newName,
                    {
                        memory: {
                            role: 'harvester',

                        }
                    });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                } else {
                    console.log("3fail " + state)
                }
            }
            else if (totalEnergy >= 400 && totalStructureExtension == 2) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
                    {
                        memory: {
                            role: 'harvester',

                        }
                    });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                } else {
                    console.log("fail " + state)
                }
            }
            else if (totalEnergy >= 350 && totalStructureExtension == 1) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
                    {
                        memory: {
                            role: 'harvester',

                        }
                    });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                } else {
                    console.log("fail " + state)
                }
            }
            else if (totalStructureExtension == 0 && totalEnergy >= 300) {
                var newName = 'harvester' + Game.time;
                const state = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], newName,
                    {
                        memory: {
                            role: 'harvester',

                        }
                    });
                if (state == OK) {
                    console.log('Spawning new harvester: ' + newName);
                } else {
                    console.log("fail " + state)
                }
            }

        }



    },
    toHarvester: function (creep:Creep) {
        // 寻找最近的资源
        
        const closestSource = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (source) => {
                if (creep.isCanCloset(source)) {
                    return source
                }
            }
        })
        if (closestSource) {
            // 如果距离资源太远，则移动到资源附近
            if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },
    toTransfer:function(creep:Creep){
        console.log(2)
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        })
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            this.toRepairer(creep)
            
        }
    },
    toBuilder: function (creep:Creep) {
        if (creep.store[RESOURCE_ENERGY] > 0) {
            const site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                filter: (site) => {
                    return site
                }
            });
            if (site) {
                if (creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site, { visualizePathStyle: { stroke: '#ffffff' } });
                    creep.say('🚧 build');
                }
            } else {
                this.toUpgrader(creep)
            }
        }

    },
    /**
     * 
     * @param creep 执行升级任务
     */
    toUpgrader: function (creep:Creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            creep.say("upgrading")
        }

    },
    toRepairer:function(creep:Creep){
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax);
            }
        });
        if(target){
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else{
            this.toBuilder(creep)
        }
    }
}
export default autoRole;