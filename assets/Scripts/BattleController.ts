import { _decorator, Animation, animation, AudioClip, Color, Component, instantiate, Node, Prefab, Sprite, tween, Vec3 } from 'cc';
import { UIManager } from './UIManager';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BattleController')
export class BattleController extends Component {
    @property(animation.AnimationController)
    lunaAnimator: animation.AnimationController;
    @property(Node)
    lunaNode: Node = null;
    private lunaInitPos: Vec3 = null;
    @property(Node)
    monsterNode: Node = null;
    private monsterInitPos: Vec3 = null;
    @property(Sprite)
    monsterSprite: Sprite;
    @property(Sprite)
    lunaSprite: Sprite;
    @property(Prefab)
    skillEffect: Prefab;
    @property(Prefab)
    healEffect: Prefab;

    @property(AudioClip)
    attackSound: AudioClip;
    @property(AudioClip)
    lunaAttackSound: AudioClip;
    @property(AudioClip)
    monsterAttackSound: AudioClip;
    @property(AudioClip)
    skillSound: AudioClip;
    @property(AudioClip)
    recoverSound: AudioClip;
    @property(AudioClip)
    hitSound: AudioClip;
    @property(AudioClip)
    dieSound: AudioClip;
    @property(AudioClip)
    monsterDieSound: AudioClip;

    protected onLoad(): void {
        this.monsterInitPos = this.monsterNode.position.clone();
        this.lunaInitPos = this.lunaNode.position.clone();
    }
    protected onEnable(): void {
        
        this.monsterSprite.color=new Color(255, 255, 255,255);
        this.monsterNode.position = this.monsterInitPos;
        
        this.lunaSprite.color=new Color(255, 255, 255,255);
        this.lunaNode.position = this.lunaInitPos;
        this.lunaAnimator.setValue("MoveState", false);
        this.lunaAnimator.setValue("MoveValue", 0);
    }
    start() {

    }

    update(deltaTime: number) {
    }

    lunaAttack() {
        this.performAttackLogic();
    }
    lunaDefend() {
        this.performDefendLogic();
    }
    lunaUseSkill() {
        if (!GameManager.Instance.canUsePlayerMP(30)) return;
        this.performSkillLogic();
    }

    lunaRecoverHP() {
        if (!GameManager.Instance.canUsePlayerMP(50)) return;
        this.performRecoverHPLogic();
    }

    async performAttackLogic() {
        
        UIManager.Instance.showOrHideBattlePanel(false);
        
        this.lunaAnimator.setValue("MoveState", true);
        
        this.lunaAnimator.setValue("MoveValue", -1);
        tween(this.lunaNode)
            .to(0.5, { position: this.monsterInitPos.clone().add(new Vec3(200, 0, 0)) }) 
            .call(() => {
                
                this.lunaAnimator.setValue("MoveState", false);
                
                this.lunaAnimator.setValue("MoveValue", 0);
                
                this.lunaAnimator.setValue("ClickAttack", true);
                
                GameManager.Instance.playSound(this.attackSound);
                GameManager.Instance.playSound(this.lunaAttackSound);
                
                let fadeTween = tween(this.monsterSprite.color.clone())
                    .to(0.2, { a: 80 }, {
                        
                        onUpdate: (target: Color) => {
                            this.monsterSprite.color = target;
                        }
                    }
                    )
                    .to(0.2, { a: 255 }, {
                        
                        onUpdate: (target: Color) => {
                            this.monsterSprite.color = target;
                        }
                    })
                    .union() 
                    .repeat(3) 
                
                let hitTween = tween(this.monsterNode)
                    .to(0.2, {}) 
                    .to(0.1, { position: this.monsterInitPos.clone().add(new Vec3(-100, 0, 0)) }) 
                    .to(0.1, { position: this.monsterInitPos.clone() }) 
                    .call(() => {
                        
                        this.judgeMonsterHP(-20)
                    })
                
                fadeTween.start();
                
                hitTween.start();
            })
            .start();

        await new Promise(resolve => setTimeout(resolve, 1180));

        this.lunaAnimator.setValue("MoveState", true);
        this.lunaAnimator.setValue("MoveValue", 1);
        tween(this.lunaNode)
            .to(0.5, { position: this.lunaInitPos.clone() })
            .call(() => { this.lunaAnimator.setValue("MoveState", false) })
            .start();

        await new Promise(resolve => setTimeout(resolve, 500));
        this.monsterAttack();
    }
    async performDefendLogic() {
        
        UIManager.Instance.showOrHideBattlePanel(false);

        
        this.lunaAnimator.setValue("Defend", true);

        
        tween(this.monsterNode)
            
            .to(0.5, { position: this.lunaInitPos.clone().add(new Vec3(-250, 0, 0)) })
            .to(0.2,{})
            .call(()=>{GameManager.Instance.playSound(this.monsterAttackSound);})
            .to(1,{})
            
            .to(0.1, { position: this.lunaInitPos.clone() })
            
            .call(() => {
                tween(this.lunaNode)
                    
                    .to(0.1, { position: this.lunaInitPos.clone().add(new Vec3(100, 0, 0)) })
                    
                    .to(0.1, { position: this.lunaInitPos.clone() })
                    .start();
            })
            
            .to(0.1, { position: this.lunaInitPos.clone().add(new Vec3(-250, 0, 0)) })
            .start();

        
        await new Promise(resolve => setTimeout(resolve, 2000));

        
        tween(this.monsterNode)
            
            .to(0.5, { position: this.monsterInitPos.clone() })
            
            .call(() => {
                
                UIManager.Instance.showOrHideBattlePanel(true);
                
                this.lunaAnimator.setValue("Defend", false);
            })
            .start();
    }
    async performSkillLogic() {
        
        UIManager.Instance.showOrHideBattlePanel(false);
        
        this.lunaAnimator.setValue("ClickSkill", true);
        
        GameManager.Instance.addOrDecreaseMP(-30);

        
        await new Promise(resolve => setTimeout(resolve, 350));

        
        let skillEffectNode = instantiate(this.skillEffect);
        
        skillEffectNode.setParent(this.node);
        
        skillEffectNode.setPosition(this.monsterInitPos.clone().add(new Vec3(15, -35, 0)));
        GameManager.Instance.playSound(this.skillSound); 
        GameManager.Instance.playSound(this.lunaAttackSound); 
        
        await new Promise(resolve => setTimeout(resolve, 300));

        
        let fadeTween = tween(this.monsterSprite.color.clone())
            .to(0.2, { a: 80 }, {
                
                onUpdate: (target: Color) => {
                    this.monsterSprite.color = target;
                }
            }
            )
            .to(0.2, { a: 255 }, {
                
                onUpdate: (target: Color) => {
                    this.monsterSprite.color = target;
                }
            })
            .union() 
            .repeat(3) 
            .start(); 

        
        let hitTween = tween(this.monsterNode)
            .to(0.2, {}) 
            .to(0.1, { position: this.monsterInitPos.clone().add(new Vec3(-100, 0, 0)) }) 
            .to(0.1, { position: this.monsterInitPos.clone() }) 
            .call(() => {
                
                this.judgeMonsterHP(-40)
            })
            .start(); 

        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.monsterAttack();
    }
    async performRecoverHPLogic() {
        
        UIManager.Instance.showOrHideBattlePanel(false);
        this.lunaAnimator.setValue("RecoverHP", true);
        GameManager.Instance.addOrDecreaseMP(-50);
        GameManager.Instance.playSound(this.lunaAttackSound);
        GameManager.Instance.playSound(this.recoverSound);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let healEffectNode = instantiate(this.healEffect);
        
        healEffectNode.setParent(this.node);
        
        healEffectNode.setPosition(this.lunaInitPos.clone().add(new Vec3(-75, -90, 0)));
        GameManager.Instance.addOrDecreaseHP(40);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.monsterAttack();

    }
    async monsterAttack() {
        if (GameManager.Instance.battleNode.activeInHierarchy == false) return;

        
        tween(this.monsterNode)
            
            .to(0.5, { position: this.lunaInitPos.clone().add(new Vec3(-250, 0, 0)) })
            
            .to(0.2,{})
            .call(()=>{GameManager.Instance.playSound(this.monsterAttackSound);})
            .to(1,{})
            
            .to(0.1, { position: this.lunaInitPos.clone() })
            
            .call(() => {
                
                this.lunaAnimator.setValue("Hit", true);
                GameManager.Instance.playSound(this.hitSound);
                
                let fadeTween = tween(this.lunaSprite.color.clone())
                    
                    .to(0.2, { a: 80 }, {
                        
                        onUpdate: (target: Color) => {
                            this.lunaSprite.color = target;
                        }
                    }
                    )
                    
                    .to(0.2, { a: 255 }, {
                        
                        onUpdate: (target: Color) => {
                            this.lunaSprite.color = target;
                        }
                    })
                    
                    .union()
                    
                    .repeat(3)
                    
                    .start();
            })
            
            .to(0.1, { position: this.lunaInitPos.clone().add(new Vec3(-250, 0, 0)) })
            
            .call(() => {
                this.judgeLunaHP(-20);
            })
            
            .start();

        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        
        tween(this.monsterNode)
            
            .to(0.5, { position: this.monsterInitPos.clone() })
            
            .call(() => {
                if(GameManager.Instance.battleNode.active == true)
                UIManager.Instance.showOrHideBattlePanel(true);
            })
            
            .start();
    }

    
    judgeLunaHP(value: number) {
        
        GameManager.Instance.addOrDecreaseHP(value);
        console.log("luna血量变化后为" + GameManager.Instance.lunaCurrentHP);
        if (GameManager.Instance.lunaCurrentHP <= 0) {
            this.lunaAnimator.setValue("Die", true);
            GameManager.Instance.playSound(this.dieSound);
            tween(this.lunaSprite.color.clone())
                
                .to(0.8, { a: 0 }, {
                    
                    onUpdate: (target: Color) => {
                        this.lunaSprite.color = target;
                    }
                }
                )
                .call(() => {
                    
                    GameManager.Instance.enterOrExitBattle(false);
                })
                .start();
        }
    }
    
    judgeMonsterHP(value: number) {
        
        if (GameManager.Instance.addOrDecreaseMonsterHP(value) <= 0) {
            GameManager.Instance.playSound(this.monsterDieSound);
            tween(this.monsterSprite.color.clone())
                
                .to(0.4, { a: 0 }, {
                    
                    onUpdate: (target: Color) => {
                        this.monsterSprite.color = target;
                    }
                }
                )
                .call(() => {
                    
                    GameManager.Instance.enterOrExitBattle(false,1);
                })
                .start();
        } else {
            tween(this.monsterSprite.color.clone())
                
                .to(0.2, { a: 255 }, {
                    
                    onUpdate: (target: Color) => {
                        this.monsterSprite.color = target;
                    }
                }
                ).start();
        }
    }

    
    lunaEscape() {
        UIManager.Instance.showOrHideBattlePanel(false);
        tween(this.lunaNode)
        .to(0.5, { position: this.lunaInitPos.clone().add(new Vec3(400, 0, 0)) })
        .call(() => {GameManager.Instance.enterOrExitBattle(false);})
        .start();

        let battleMonsterNode=GameManager.Instance.battleMonsterNode;
        battleMonsterNode.setPosition(new Vec3(battleMonsterNode.position.x, battleMonsterNode.position.y + 200, battleMonsterNode.position.z))
        
        
        this.lunaAnimator.setValue("MoveState", true);
        
        this.lunaAnimator.setValue("MoveValue", 1);
    }
}
