import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Fixedupdate')
export class Fixedupdate {  
    private static _instance:Fixedupdate;
    private nowTime:number=0;
    private fixedDeltaTime:number=0.02;

    private constructor() {
    }
    public static  getInstance():Fixedupdate {
        if (!Fixedupdate._instance) {
            Fixedupdate._instance = new Fixedupdate();
        }
        return Fixedupdate._instance;
    }

     update(dt:number,fiexdUpdateCallback:(FixedDeltaTime:number)=>void){
        
        this.nowTime+=dt;
        
        while(this.nowTime>this.fixedDeltaTime){
            
            fiexdUpdateCallback(this.fixedDeltaTime);
            
            this.nowTime-=this.fixedDeltaTime;
        }
    }
}


