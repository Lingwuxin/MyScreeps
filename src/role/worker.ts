import { filter } from "lodash";
import autoRole from "@/controller/autoRole";
const worker = {
    run: function (creep: Creep) {
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
            autoRole.toHarvester(creep)

        } else if (creep.memory.working == "transfer") { // 如果当前是转移资源的状态
            var controller = Game.rooms["W34N7"].controller;
            if (controller) {//如果即将掉级，进入升级状态，维护等级
                var ticksToDowngrade = controller.ticksToDowngrade;
                if (ticksToDowngrade < 1000) {
                    console.log("房间控制器 downgrade 剩余时间：" + ticksToDowngrade + " ticks");
                    autoRole.toUpgrader(creep)
                    return
                }
            }
            else {
                console.log("未找到房间控制器");
            }
            autoRole.toTransfer(creep)
        }
    }
};

export default worker;