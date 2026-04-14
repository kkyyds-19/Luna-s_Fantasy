import { _decorator, Animation, CCBoolean, CCFloat, CCInteger, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D, Vec2 } from 'cc';
import { Fixedupdate } from './FixedUpdate';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    //轴向控制
    @property(CCBoolean)
    vertical: boolean = false;
    @property(CCInteger)
    speed: number = 5;
    //刚体组件引用，为了使用刚体进行移动
    private rb: RigidBody2D
    //方向控制
    @property(CCInteger)
    direction: number = 1;
    //方向改变的时间间隔
    @property(CCFloat)
    changeTime: number = 5;
    //计时器
    private timer: number = 0;
    //动画组件引用，为了播放动画
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
        if (this.timer < 0) {//当计时器小于0时，改变方向
            this.direction = -this.direction;
            this.timer = this.changeTime;
        }
    }
    fixedUpdate(FixedDeltaTime: number) {
        if (this.vertical) {//垂直轴向移动
            if (this.direction > 0) this.animation.play("MoveUp");//向上移动
            else this.animation.play("MoveDown");//向下移动
            this.rb.linearVelocity = new Vec2(0, this.direction * this.speed * FixedDeltaTime);
        } else {//水平轴向的移动
            if (this.direction > 0) this.animation.play("MoveRight");//向右移动
            else this.animation.play("MoveLeft");//向左移动
            this.rb.linearVelocity = new Vec2(this.direction * this.speed * FixedDeltaTime, 0);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 1) {//如果碰撞到了玩家
            GameManager.Instance.enterOrExitBattle();//进入战斗
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
