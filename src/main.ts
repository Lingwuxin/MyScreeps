import worker from './role/worker'
import autoRole from './controller/autoRole'
import extendCreep from './extend/MCreep'
import { errorMapper } from './modules/errorMapper'
import attacker from './role/attacker';

export const loop = errorMapper (function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    autoRole.createRole()
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        extendCreep.extend(creep)
        if(creep.memory.role==="harvester"){
            worker.run(creep)
        }
        if(creep.memory.role==="attacker"){
            attacker.run(creep)
        }
    }
})
