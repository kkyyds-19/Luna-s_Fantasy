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
    

    private _axisDirection: Vec3 = new Vec3(0, 0, 0);
    private _lookDirection: Vec3 = new Vec3(0, 0, 0);
    lookdirection: Vec3 = new Vec3(0, 0, 0);
    @property(CCFloat)
    public moveSpeed: number = 500;
    private rb: RigidBody2D = null;
    private moveScale: number;
    
    private isLeftPressed: boolean = false;
    private isRightPressed: boolean = false;
    private isUpPressed: boolean = false;
    private isDownPressed: boolean = false;

    
    private lastHorizontalInput: Direction.Left | Direction.Right = null;
    private lastverticalInput: Direction.Up | Direction.Down = null;
    
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

    
    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            
            case KeyCode.ARROW_UP:
                
                this.isUpPressed = true;
                this.lastverticalInput = Direction.Up;
                break;
            
            case KeyCode.ARROW_DOWN:
                
                this.isDownPressed = true;
                this.lastverticalInput = Direction.Down;
                break;
            
            case KeyCode.ARROW_LEFT:
                
                this.isLeftPressed = true;
                this.lastHorizontalInput = Direction.Left;
                break;
            
            case KeyCode.ARROW_RIGHT:
                
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
    
    onKeyUp(event: EventKeyboard) {
        
        switch (event.keyCode) {
            
            case KeyCode.ARROW_UP:
                
                this.isUpPressed = false;
                if (this.isDownPressed) {
                    this.lastverticalInput = Direction.Down;
                } else {
                    this.lastverticalInput = null;
                }
                break;
            
            case KeyCode.ARROW_DOWN:
                
                this.isDownPressed = false;
                if (this.isUpPressed) {
                    this.lastverticalInput = Direction.Up;
                } else {
                    this.lastverticalInput = null;
                }
                break;
            
            case KeyCode.ARROW_LEFT:
                
                this.isLeftPressed = false;
                if (this.isRightPressed) {
                    this.lastHorizontalInput = Direction.Right;
                } else {
                    this.lastHorizontalInput = null;
                }
                break;
            
            case KeyCode.ARROW_RIGHT:
                
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

    
    updateMoveDirection() {
        
        if (this.lastHorizontalInput == Direction.Left) {
            this._axisDirection.x = -1 * this.moveScale;
        } else if (this.lastHorizontalInput == Direction.Right) {
            this._axisDirection.x = 1 * this.moveScale;
        } else {
            this._axisDirection.x = 0;
        }
        
        if (this.lastverticalInput == Direction.Down) {
            this._axisDirection.y = -1 * this.moveScale;
        } else if (this.lastverticalInput == Direction.Up) {
            this._axisDirection.y = 1 * this.moveScale;
        } else {
            this._axisDirection.y = 0;
        }

    }
    protected update(dt: number): void {
        this.footStepinterval -= dt;
        
        
        
        if (this._axisDirection.x != 0 || this._axisDirection.y != 0) {
            
            this.lookdirection.set(this._axisDirection);
            
            
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
        
        this.animationController.setValue("LookX", this.lookdirection.x);
        
        this.animationController.setValue("LookY", this.lookdirection.y);
        
        if (!GameManager.Instance.canControlLuna || GameManager.Instance.enterBattle) {
            this._axisDirection.set(0, 0);
            this.rb.linearVelocity = Vec2.ZERO;
            return;
        }
        Fixedupdate.getInstance().update(dt, this.fixedUpdate.bind(this));
    }
    fixedUpdate(FixedDeltaTime: number) {
        
        let veclocity = new Vec2(this._axisDirection.x * this.moveSpeed * FixedDeltaTime, this._axisDirection.y * this.moveSpeed * FixedDeltaTime);
        
        this.rb.linearVelocity = veclocity;
    }
    public jump(start: boolean) {
        this.animationController.setValue("Jump", start);
    }
    public climb(start: boolean) {
        this.animationController.setValue("Climb", start);
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
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
