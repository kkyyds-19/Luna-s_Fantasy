import { _decorator, AudioClip, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Node, Prefab } from 'cc';
import { LunaController } from './LunaController';
import { GameManager } from './GameManager';
import { TagGroup } from './TagGroup';
const { ccclass, property } = _decorator;

@ccclass('Potion')
export class Potion extends Component {
    //truthy（如非零数字、非空字符串、对象等）
    //falsy（如 0、空字符串 ""、null、undefined、NaN 等）
    // private isTriggering: boolean = !!0;

    // savedSelfCollider:Collider2D|null = null;
    // saveOtherCollider:Collider2D|null = null;
    // saveContant:IPhysics2DContact|null = null;
    @property(Prefab)
    starEffectPrefab: Prefab = null;
    @property(AudioClip)
    pickSound: AudioClip = null;
    protected start(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            // collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // this.isTriggering = true;
        // this.savedSelfCollider = selfCollider;
        // this.saveOtherCollider = otherCollider;
        // this.saveContant = contact;'


        // let lunaController: LunaController = otherCollider.getComponent(LunaController);
        // if (lunaController != null) {
        //     if (lunaController.currentHealth < lunaController.maxHealth) {
        //         lunaController.changeHealth(1);
        //         let starEffectNode = instantiate(this.starEffectPrefab);
        //         starEffectNode.setParent(this.node.parent);
        //         starEffectNode.setPosition(this.node.position);
        //         this.scheduleOnce(() => {
        //             this.node.destroy();
        //         }, 0)
        //     }
        // }
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

    // onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     this.isTriggering = false;
    //     this.savedSelfCollider = null;
    //     this.saveOtherCollider = null;
    //     this.saveContant = null;
    //     // 只在两个碰撞体结束接触时被调用一次
    //     console.log(otherCollider.node.name+'离开了血瓶!');
    // }
    protected update(dt: number): void {
        // if(this.isTriggering ){
        //     this.onStayContact(this.savedSelfCollider, this.saveOtherCollider, this.saveContant);
        // }

    }
    protected onDestroy(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    // onStayContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
    //     console.log(otherCollider.node.name+"正在一直拿血瓶！");
    // }
}
