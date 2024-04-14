
const extendCreep ={
    extend:function(creep:Creep){
        creep.isCanCloset=this.isCanCloset
    },
    isCanCloset:function(source: Source): boolean{
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
                    for(const object of objects){
                        if(object.name==this.name){
                            return true
                        }
                    }
                }else{
                    return true
                }
            }
        }

        return false; // 如果资源周围没有空地，则返回 false
    }
    // 这里可以添加 MCreep 特有的方法或者属性
}
export default extendCreep