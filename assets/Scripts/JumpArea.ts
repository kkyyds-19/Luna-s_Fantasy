import { _decorator, Collider2D, Component, Contact2DType, ERigidBody2DType, IPhysics2DContact, LOD, Node, RigidBody2D, tween, UITransform, v3, Vec2, Vec3 } from 'cc';
import { TagGroup } from './TagGroup';
import { LunaController } from './LunaController';
const { ccclass, property } = _decorator;

@ccclass('JumpArea')
export class JumpArea extends Component {
    @property(Node)
    jumpA: Node = null;
    @property(Node)
    jumpB: Node = null;
    collider: Collider2D | null = null;
    protected start(): void {
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == TagGroup.Luna) {
            let lunaController = otherCollider.getComponent(LunaController)
            this.scheduleOnce(() => {
                lunaController.getComponent(RigidBody2D).type = ERigidBody2DType.Static;
            }, 0);
            lunaController.jump(true);
            let disA = Vec3.distance(lunaController.node.worldPosition, this.jumpA.worldPosition);
            let disB = Vec3.distance(lunaController.node.worldPosition, this.jumpB.worldPosition);
            let targetTrans: Vec3;
            if (disA > disB) {
                
                targetTrans = lunaController.node.parent.getComponent(UITransform).convertToNodeSpaceAR(this.jumpA.worldPosition);
            } else {
                
                targetTrans = lunaController.node.parent.getComponent(UITransform).convertToNodeSpaceAR(this.jumpB.worldPosition);
            }
            tween()
                .target(lunaController.node)
                .to(0.25,{position:v3(targetTrans.x,targetTrans.y+100,0)},{easing:'sineOut'})
                .to(0.25, { position: targetTrans }, { easing: 'sineIn' })
                .call(() => {
                    this.endJump(lunaController);
                    lunaController.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
                })
                .start();
        }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }
    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    private endJump(lunaController: LunaController) {
        lunaController.jump(false);
    }
}

