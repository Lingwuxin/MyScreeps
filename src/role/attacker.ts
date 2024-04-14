

const attacker = {
    run: function (creep: Creep) {
        if (creep.memory.role === 'attacker') {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                // 如果找到敌人，则向其移动并攻击
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {//没找到敌人前往集合点
                var flag = Game.flags["Flag1"];
                if (flag) {
                    if (creep.moveTo(flag) === ERR_NO_PATH) {
                        console.log("无法到达目标位置");
                    }
                } else {
                    console.log("未找到名为 Flag1 的旗帜");
                }
            }
        }
    }
}
export default attacker