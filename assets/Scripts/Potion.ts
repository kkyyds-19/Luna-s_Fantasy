import { _decorator, AudioClip, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Node, Prefab } from 'cc';
import { LunaController } from './LunaController';
import { GameManager } from './GameManager';
import { TagGroup } from './TagGroup';
const { ccclass, property } = _decorator;

@ccclass('Potion')
export class Potion extends Component {
    
    
    

    
    
    
    @property(Prefab)
    starEffectPrefab: Prefab = null;
    @property(AudioClip)
    pickSound: AudioClip = null;
    protected start(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            
        }
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
        
        
        


        
        
        
        
        
        
        
        
        
        
        
        
        if (otherCollider.group == 2) {
            if (GameManager.Instance.lunaCurrentHP < GameManager.Instance.lunaHP) {
                GameManager.Instance.addOrDecreaseHP(40);
                let starEffectNode = instantiate(this.starEffectPrefab);
                starEffectNode.setParent(this.node.parent);
                starEffectNode.setPosition(this.node.position);
                this.scheduleOnce(() => {
                    this.node.destroy();
                }, 0)
                GameManager.Instance.playSound(this.pickSound);
            }
        }
    }

    
    
    
    
    
    
    
    
    protected update(dt: number): void {
        
        
        

    }
    protected onDestroy(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    
    
    
}
