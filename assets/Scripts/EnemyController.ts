import { _decorator, Animation, CCBoolean, CCFloat, CCInteger, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D, Vec2 } from 'cc';
import { Fixedupdate } from './FixedUpdate';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    
    @property(CCBoolean)
    vertical: boolean = false;
    @property(CCInteger)
    speed: number = 5;
    
    private rb: RigidBody2D
    
    @property(CCInteger)
    direction: number = 1;
    
    @property(CCFloat)
    changeTime: number = 5;
    
    private timer: number = 0;
    
    private animation: Animation;
    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.rb = this.getComponent(RigidBody2D);
        this.animation = this.getComponent(Animation)
        this.timer = this.changeTime;
    }

    update(deltaTime: number) {
        if(GameManager.Instance.enterBattle){
            return;
        }
        Fixedupdate.getInstance().update(deltaTime, this.fixedUpdate.bind(this));
        this.timer -= deltaTime;
        if (this.timer < 0) {
            this.direction = -this.direction;
            this.timer = this.changeTime;
        }
    }
    fixedUpdate(FixedDeltaTime: number) {
        if (this.vertical) {
            if (this.direction > 0) this.animation.play("MoveUp");
            else this.animation.play("MoveDown");
            this.rb.linearVelocity = new Vec2(0, this.direction * this.speed * FixedDeltaTime);
        } else {
            if (this.direction > 0) this.animation.play("MoveRight");
            else this.animation.play("MoveLeft");
            this.rb.linearVelocity = new Vec2(this.direction * this.speed * FixedDeltaTime, 0);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 1) {
            GameManager.Instance.enterOrExitBattle();
            GameManager.Instance.setMonster(this.node);
        }
    }
    protected onDestroy(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
}
