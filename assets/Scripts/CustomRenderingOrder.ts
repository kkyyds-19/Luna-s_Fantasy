import { _decorator, Component, Node, UITransform } from 'cc';
import { Candle } from './Candle';
const { ccclass, property } = _decorator;

@ccclass('CustomRenderingOrder')
export class CustomRenderingOrder extends Component {
    start() {
        
    }

    update(deltaTime: number) {
        let EvnNodes=this.node.children;
        //按照Y轴从大到小进行排序，Y值越低，显示越靠前
        EvnNodes.sort((a,b)=>b.position.y-a.position.y);
        //更新渲染(结点)顺序
        EvnNodes.forEach((EvnNode,index)=>{
            if(EvnNode){
                EvnNode.setSiblingIndex(index);
            }
        })
    }
}


