import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Effect')
export class Effect extends Component {
    @property
    public destoryTime:number = 0;
    start() {
         this.scheduleOnce(() => {
             this.node.destroy();
         }, this.destoryTime);
    }

    update(deltaTime: number) {
        
    }
}


