import { _decorator, Component, Node, quat, Quat, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property(Vec3)
    public targetPosition: Vec3 = null;
    start() {
        let q1=new Quat();
        
        tween(this.node)
        .to(3,{position:this.targetPosition,angle:180,scale:new Vec3(2,2,0)},{easing:"bounceOut"})
        .call(()=>{this.debug()})
        .start();
    }

    update(deltaTime: number) {
        
    }
    debug() {
        console.log('debug');
    }
}


