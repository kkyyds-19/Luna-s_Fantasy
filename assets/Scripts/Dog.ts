import { _decorator, Animation, animation, AudioClip, Component, game, Node, Prefab } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Dog')
export class Dog extends Component {
    private dogAnimation:Animation;
    @property(Node)
    starEffect:Node=null;
    @property(AudioClip)
    petSound:AudioClip=null;
    start() {
        this.dogAnimation=this.getComponent(Animation);
    }

    beHappy(){
        this.dogAnimation.play("BeHappy");
        GameManager.Instance.hasPetTheDog=true;
        GameManager.Instance.setContentIndex();
        this.starEffect.destroy();
        //TODO:播放音效
        GameManager.Instance.playSound(this.petSound);
        this.scheduleOnce(()=>{
            GameManager.Instance.canControlLuna=true;
            this.dogAnimation.play("Comfortable");
        },2);
    }
}


