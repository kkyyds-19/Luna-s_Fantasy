import { _decorator, Component, Node, UITransform } from 'cc';
import { Candle } from './Candle';
const { ccclass, property } = _decorator;

@ccclass('CustomRenderingOrder')
export class CustomRenderingOrder extends Component {
    start() {
        
    }

    update(deltaTime: number) {
        let EvnNodes=this.node.children;
        
        EvnNodes.sort((a,b)=>b.position.y-a.position.y);
        
        EvnNodes.forEach((EvnNode,index)=>{
            if(EvnNode){
                EvnNode.setSiblingIndex(index);
            }
        })
    }
}


