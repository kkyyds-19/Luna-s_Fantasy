import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Fixedupdate')
export class Fixedupdate {  
    private static _instance:Fixedupdate;
    private nowTime:number=0;//跟踪上一次调用update方法以来累计的时间
    private fixedDeltaTime:number=0.02;//设定一个固定的更新(delta)时间,例如0.02秒

    private constructor() {
    }
    public static  getInstance():Fixedupdate {
        if (!Fixedupdate._instance) {
            Fixedupdate._instance = new Fixedupdate();
        }
        return Fixedupdate._instance;
    }

     update(dt:number,fiexdUpdateCallback:(FixedDeltaTime:number)=>void){
        // 更新当前时间
        this.nowTime+=dt;
        // 当当前时间大于固定时间间隔时
        while(this.nowTime>this.fixedDeltaTime){
            // 调用传入的回调函数，传入固定时间间隔作为参数
            fiexdUpdateCallback(this.fixedDeltaTime);
            // 当前时间减去固定时间间隔
            this.nowTime-=this.fixedDeltaTime;
        }
    }
}


