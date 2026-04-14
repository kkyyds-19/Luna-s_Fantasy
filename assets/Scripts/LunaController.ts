import { _decorator, animation, AudioClip, CCFloat, CircleCollider2D, Collider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, RigidBody2D, Vec2, Vec3, view } from 'cc';
import { Fixedupdate } from './FixedUpdate';
import { UIManager } from './UIManager';
import { GameManager } from './GameManager';
import { NPCDialog } from './NPCDialog';
import { Dog } from './Dog';
const { ccclass, property } = _decorator;

enum Direction {
    Left,
    Right,
    Up,
    Down
}
@ccclass('LunaController')
export class LunaController extends Component {

    @property(animation.AnimationController)
    public animationController: animation.AnimationController;
    //#region 关于移动的属性

    private _axisDirection: Vec3 = new Vec3(0, 0, 0);//玩家输入的轴方向
    private _lookDirection: Vec3 = new Vec3(0, 0, 0);//人物的朝向
    lookdirection: Vec3 = new Vec3(0, 0, 0);
    @property(CCFloat)
    public moveSpeed: number = 500;
    private rb: RigidBody2D = null;
    private moveScale: number;
    //分别记录方向键的按下状态
    private isLeftPressed: boolean = false;
    private isRightPressed: boolean = false;
    private isUpPressed: boolean = false;
    private isDownPressed: boolean = false;

    //记住最后按下的方向|
    private lastHorizontalInput: Direction.Left | Direction.Right = null;//记录最后按下的水平方向键位
    private lastverticalInput: Direction.Up | Direction.Down = null;//记录最后按下的垂直方向键位
    //#endregion
    private isSpacePressed: boolean = false;
    private currentNPC: Collider2D = null;
    @property(AudioClip)
    public lunaFootstep: AudioClip;

    private footStepinterval:number;
    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
    protected start(): void {
        this.footStepinterval=0.2;
        this.moveScale = 1;
        this.rb = this.getComponent(RigidBody2D);
        this.animationController = this.getComponent(animation.AnimationController);
        // this.maxHealth=10;
        let circleCollider = this.getComponent(CircleCollider2D);
        if (circleCollider) {
            circleCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
            circleCollider.on(Contact2DType.END_CONTACT, this.onEndContact, this)
        }

    }
    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    /**
     * 键盘按下事件的处理函数
     * @param event 
     */
    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            // 向上箭头键
            case KeyCode.ARROW_UP:
                // 标记向上箭头键被按下
                this.isUpPressed = true;
                this.lastverticalInput = Direction.Up;
                break;
            // 向下箭头键
            case KeyCode.ARROW_DOWN:
                // 标记向下箭头键被按下
                this.isDownPressed = true;
                this.lastverticalInput = Direction.Down;
                break;
            // 向左箭头键
            case KeyCode.ARROW_LEFT:
                // 标记向左箭头键被按下
                this.isLeftPressed = true;
                this.lastHorizontalInput = Direction.Left;
                break;
            // 向右箭头键
            case KeyCode.ARROW_RIGHT:
                // 标记向右箭头键被按下
                this.isRightPressed = true;
                this.lastHorizontalInput = Direction.Right;
                break;
            case KeyCode.SHIFT_LEFT:
                this.moveScale = 2;
                break
            case KeyCode.SPACE:
                this.isSpacePressed = true;
                if (this.currentNPC != null)
                    this.Talk(this.currentNPC);
                break
        }
        this.updateMoveDirection();
    }
    /**
     * 键盘抬起事件的处理函数
     * @param event 
     */
    onKeyUp(event: EventKeyboard) {
        // 按键抬起事件的处理函数
        switch (event.keyCode) {
            // 按下上箭头键
            case KeyCode.ARROW_UP:
                // 将isUpPressed标志位设置为false
                this.isUpPressed = false;
                if (this.isDownPressed) {
                    this.lastverticalInput = Direction.Down;
                } else {
                    this.lastverticalInput = null;
                }
                break;
            // 按下下箭头键
            case KeyCode.ARROW_DOWN:
                // 将isDownPressed标志位设置为false
                this.isDownPressed = false;
                if (this.isUpPressed) {
                    this.lastverticalInput = Direction.Up;
                } else {
                    this.lastverticalInput = null;
                }
                break;
            // 按下左箭头键
            case KeyCode.ARROW_LEFT:
                // 将isLeftPressed标志位设置为false
                this.isLeftPressed = false;
                if (this.isRightPressed) {
                    this.lastHorizontalInput = Direction.Right;
                } else {
                    this.lastHorizontalInput = null;
                }
                break;
            // 按下右箭头键
            case KeyCode.ARROW_RIGHT:
                // 将isRightPressed标志位设置为false
                this.isRightPressed = false;
                if (this.isLeftPressed) {
                    this.lastHorizontalInput = Direction.Left;
                } else {
                    this.lastHorizontalInput = null;
                }
                break;
            case KeyCode.SHIFT_LEFT:
                this.moveScale = 1;
                break
            case KeyCode.SPACE:
                this.isSpacePressed = false;
                break
        }
        this.updateMoveDirection();
    }

    /**
     * 更新移动方向
     */
    updateMoveDirection() {
        //根据最后按下的方向进行水平移动的更新
        if (this.lastHorizontalInput == Direction.Left) {
            this._axisDirection.x = -1 * this.moveScale;
        } else if (this.lastHorizontalInput == Direction.Right) {
            this._axisDirection.x = 1 * this.moveScale;
        } else {
            this._axisDirection.x = 0;//如果没有水平输入，停止水平移动
        }
        //根据最后按下的方向进行垂直移动的更新
        if (this.lastverticalInput == Direction.Down) {
            this._axisDirection.y = -1 * this.moveScale;
        } else if (this.lastverticalInput == Direction.Up) {
            this._axisDirection.y = 1 * this.moveScale;
        } else {
            this._axisDirection.y = 0;//如果没有垂直输入，停止垂直移动
        }

    }
    protected update(dt: number): void {
        this.footStepinterval -= dt;
        // 设置动画控制器的"MoveValue"值为0
        // this.animationController.setValue("MoveValue",0);
        // 如果_axisDirection(玩家输入的轴向)的x或y值不为0
        if (this._axisDirection.x != 0 || this._axisDirection.y != 0) {
            //在我们键盘抬起前存储_axisDirection的x和y值，存到lookdirection中
            this.lookdirection.set(this._axisDirection);
            // 设置动画控制器的"MoveValue"值为1
            // this.animationController.setValue("MoveValue",1);
            if (this.footStepinterval <= 0 && this.moveScale==1) {
                console.log("播放脚步声音");
                GameManager.Instance.playSound(this.lunaFootstep);
                this.footStepinterval = 0.4;
            }
            if(this.footStepinterval <= 0&&this.moveScale==2){
                console.log("播放shift脚步声音");
                GameManager.Instance.playSound(this.lunaFootstep);
                this.footStepinterval = 0.2;
            }
        }
       
        this.animationController.setValue("MoveValue", this._axisDirection.length());
        // 设置动画控制器的"LookX"值为_axisDirection的x值
        this.animationController.setValue("LookX", this.lookdirection.x);
        // 设置动画控制器的"LookY"值为_axisDirection的y值
        this.animationController.setValue("LookY", this.lookdirection.y);
        // 调用Fixedupdate单例的update方法，并传入dt和当前类的fixedUpdate方法作为回调函数的上下文
        if (!GameManager.Instance.canControlLuna || GameManager.Instance.enterBattle) {
            this._axisDirection.set(0, 0);
            this.rb.linearVelocity = Vec2.ZERO;
            return;
        }
        Fixedupdate.getInstance().update(dt, this.fixedUpdate.bind(this));
    }
    fixedUpdate(FixedDeltaTime: number) {
        // 计算移动向量，根据移动方向和移动速度以及时间差
        let veclocity = new Vec2(this._axisDirection.x * this.moveSpeed * FixedDeltaTime, this._axisDirection.y * this.moveSpeed * FixedDeltaTime);
        // 设置节点的线性速度为移动向量
        this.rb.linearVelocity = veclocity;
    }
    public jump(start: boolean) {
        this.animationController.setValue("Jump", start);
    }
    public climb(start: boolean) {
        this.animationController.setValue("Climb", start);
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        if (otherCollider.group == 1 << 3) {
            this.currentNPC = otherCollider;
        }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.group == 1 << 3) {
            this.currentNPC = null;
        }
    }
    public Talk(currentNPC: Collider2D) {
        if (this.isSpacePressed) {
            if (currentNPC.node.name == "Nala") {
                GameManager.Instance.canControlLuna = false;
                currentNPC.getComponent(NPCDialog).displayDialog();
            }
            else if (currentNPC.node.name == "Dog" && !GameManager.Instance.hasPetTheDog && GameManager.Instance.dialogInfoIndex == 2) {
                // TODO
                this.petTheDog();
                GameManager.Instance.canControlLuna = false;
                currentNPC.getComponent(Dog).beHappy();
            }
        }
    }
    petTheDog() {
        this.animationController.setValue("Pet", true);
        this.node.setPosition(new Vec3(-63, -818, 0));
    }
}
