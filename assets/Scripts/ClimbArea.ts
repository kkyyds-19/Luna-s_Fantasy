import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { TagGroup } from './TagGroup';
import { LunaController } from './LunaController';
const { ccclass, property } = _decorator;
@ccclass('ClimbArexport')
export class ClimbArea extends Component {
    
    collider:Collider2D | null = null;
    protected start(): void {
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
       if(otherCollider.tag===TagGroup.Luna){
            otherCollider.getComponent(LunaController).climb(true);
       }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(otherCollider.tag===TagGroup.Luna){
            otherCollider.getComponent(LunaController).climb(false);
       }
    }
    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
}


