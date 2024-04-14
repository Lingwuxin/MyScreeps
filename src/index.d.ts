interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string
    /**
     * 工作状态
     */
    working?:string,
    building?:boolean,
    hasTarget?:boolean
}
interface Creep{
    isCanCloset(source:Source):boolean
}