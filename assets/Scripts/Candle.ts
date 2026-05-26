import { _decorator, AudioClip, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Node, Prefab } from 'cc';
import { LunaController } from './LunaController';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Candle')
export class Candle extends Component {
    @property(Prefab)
    starEffectPrefab: Prefab = null;
    @property(AudioClip)
    pickClip: AudioClip = null;
    protected start(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            
        }
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let lunaController: LunaController = otherCollider.getComponent(LunaController);
        if (lunaController != null) {
            GameManager.Instance.candleNum++;
            let starEffectNode = instantiate(this.starEffectPrefab);
            starEffectNode.setParent(this.node.parent);
            starEffectNode.setPosition(this.node.position);
            if(GameManager.Instance.candleNum>=5){
                GameManager.Instance.setContentIndex();;
            }
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0)
            GameManager.Instance.playSound(this.pickClip);
        }
    }
    protected onDestroy(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
}


