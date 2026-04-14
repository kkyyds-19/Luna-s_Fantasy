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
        //怪物初始化
        this.monsterSprite.color=new Color(255, 255, 255,255);
        this.monsterNode.position = this.monsterInitPos;
        //luna初始化
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
        // 隐藏战斗面板
        UIManager.Instance.showOrHideBattlePanel(false);
        // 设置移动状态为移动中
        this.lunaAnimator.setValue("MoveState", true);
        // 设置移动值为-1，表示向相反方向移动
        this.lunaAnimator.setValue("MoveValue", -1);
        tween(this.lunaNode)
            .to(0.5, { position: this.monsterInitPos.clone().add(new Vec3(200, 0, 0)) }) // 移动到指定位置
            .call(() => {
                // 设置移动状态为静止
                this.lunaAnimator.setValue("MoveState", false);
                // 设置移动值为0，表示停止移动
                this.lunaAnimator.setValue("MoveValue", 0);
                // 设置点击攻击状态为真
                this.lunaAnimator.setValue("ClickAttack", true);
                // 播放攻击音效
                GameManager.Instance.playSound(this.attackSound);
                GameManager.Instance.playSound(this.lunaAttackSound);
                // 闪烁的动画
                let fadeTween = tween(this.monsterSprite.color.clone())
                    .to(0.2, { a: 80 }, {
                        // 更新怪物颜色
                        onUpdate: (target: Color) => {
                            this.monsterSprite.color = target;
                        }
                    }
                    )
                    .to(0.2, { a: 255 }, {
                        // 更新怪物颜色
                        onUpdate: (target: Color) => {
                            this.monsterSprite.color = target;
                        }
                    })
                    .union() // 将两个动画合并
                    .repeat(3) // 重复三次
                // 受击击退动画
                let hitTween = tween(this.monsterNode)
                    .to(0.2, {}) // 保留位置不变
                    .to(0.1, { position: this.monsterInitPos.clone().add(new Vec3(-100, 0, 0)) }) // 向左击退
                    .to(0.1, { position: this.monsterInitPos.clone() }) // 返回初始位置
                    .call(() => {
                        // 判断怪物生命值
                        this.judgeMonsterHP(-20)
                    })
                // 启动闪烁动画
                fadeTween.start();
                // 启动击退动画
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
        // 隐藏战斗面板
        UIManager.Instance.showOrHideBattlePanel(false);

        // 设置Luna动画状态为防守
        this.lunaAnimator.setValue("Defend", true);

        // 对monsterNode执行一系列动画
        tween(this.monsterNode)
            // 将怪物的位置移动到luna位置左移250个单位
            .to(0.5, { position: this.lunaInitPos.clone().add(new Vec3(-250, 0, 0)) })
            .to(0.2,{})
            .call(()=>{GameManager.Instance.playSound(this.monsterAttackSound);})
            .to(1,{})
            // 将monster的位置移到luna初始位置
            .to(0.1, { position: this.lunaInitPos.clone() })
            // 在动画结束后执行一个回调函数
            .call(() => {
                tween(this.lunaNode)
                    // 将luna的位置移动到初始位置右移100个单位
                    .to(0.1, { position: this.lunaInitPos.clone().add(new Vec3(100, 0, 0)) })
                    // 将luna的位置移回到初始位置
                    .to(0.1, { position: this.lunaInitPos.clone() })
                    .start();
            })
            // 将monster的位置再次移动到初始位置左移250个单位
            .to(0.1, { position: this.lunaInitPos.clone().add(new Vec3(-250, 0, 0)) })
            .start();

        // 等待2000毫秒
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 对monsterNode执行一系列动画
        tween(this.monsterNode)
            // 将monsterNode的位置移动到初始位置
            .to(0.5, { position: this.monsterInitPos.clone() })
            // 在动画结束后执行一个回调函数
            .call(() => {
                // 显示战斗面板
                UIManager.Instance.showOrHideBattlePanel(true);
                // 设置Luna动画状态为非防守
                this.lunaAnimator.setValue("Defend", false);
            })
            .start();
    }
    async performSkillLogic() {
        // 隐藏战斗面板
        UIManager.Instance.showOrHideBattlePanel(false);
        // 设置Luna动画器的值
        this.lunaAnimator.setValue("ClickSkill", true);
        // 消耗魔法值
        GameManager.Instance.addOrDecreaseMP(-30);

        // 等待350毫秒
        await new Promise(resolve => setTimeout(resolve, 350));

        // 实例化技能效果节点
        let skillEffectNode = instantiate(this.skillEffect);
        // 设置技能效果节点的父节点
        skillEffectNode.setParent(this.node);
        // 设置技能效果节点的位置
        skillEffectNode.setPosition(this.monsterInitPos.clone().add(new Vec3(15, -35, 0)));
        GameManager.Instance.playSound(this.skillSound); 
        GameManager.Instance.playSound(this.lunaAttackSound); 
        // 等待300毫秒
        await new Promise(resolve => setTimeout(resolve, 300));

        // 闪烁的动画
        let fadeTween = tween(this.monsterSprite.color.clone())
            .to(0.2, { a: 80 }, {
                // 更新颜色
                onUpdate: (target: Color) => {
                    this.monsterSprite.color = target;
                }
            }
            )
            .to(0.2, { a: 255 }, {
                // 更新颜色
                onUpdate: (target: Color) => {
                    this.monsterSprite.color = target;
                }
            })
            .union() // 将两个动画合并
            .repeat(3) // 重复三次
            .start(); // 开始动画

        // 受击击退动画
        let hitTween = tween(this.monsterNode)
            .to(0.2, {}) // 等待0.2秒
            .to(0.1, { position: this.monsterInitPos.clone().add(new Vec3(-100, 0, 0)) }) // 向左移动
            .to(0.1, { position: this.monsterInitPos.clone() }) // 移回原位
            .call(() => {
                // 调用判断怪物血量的函数
                this.judgeMonsterHP(-40)
            })
            .start(); // 开始动画

        // 等待1000毫秒
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 怪物攻击
        this.monsterAttack();
    }
    async performRecoverHPLogic() {
        // 隐藏战斗面板
        UIManager.Instance.showOrHideBattlePanel(false);
        this.lunaAnimator.setValue("RecoverHP", true);
        GameManager.Instance.addOrDecreaseMP(-50);
        GameManager.Instance.playSound(this.lunaAttackSound);
        GameManager.Instance.playSound(this.recoverSound);
        await new Promise(resolve => setTimeout(resolve, 100));
        // 实例化回血效果节点
        let healEffectNode = instantiate(this.healEffect);
        // 设置回血效果节点的父节点
        healEffectNode.setParent(this.node);
        // 设置回血效果节点的位置
        healEffectNode.setPosition(this.lunaInitPos.clone().add(new Vec3(-75, -90, 0)));
        GameManager.Instance.addOrDecreaseHP(40);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.monsterAttack();

    }
    async monsterAttack() {
        if (GameManager.Instance.battleNode.activeInHierarchy == false) return;

        // 移动怪物节点到指定的位置
        tween(this.monsterNode)
            // 将怪物节点移动到指定位置
            .to(0.5, { position: this.lunaInitPos.clone().add(new Vec3(-250, 0, 0)) })
            // 预留一个空的动画
            .to(0.2,{})
            .call(()=>{GameManager.Instance.playSound(this.monsterAttackSound);})
            .to(1,{})
            // 将怪物节点移回初始位置
            .to(0.1, { position: this.lunaInitPos.clone() })
            // 执行回调函数，播放角色被击中的动画，并改变角色颜色透明度
            .call(() => {
                // 触发角色被击中的动画
                this.lunaAnimator.setValue("Hit", true);
                GameManager.Instance.playSound(this.hitSound);
                // 改变角色颜色透明度，先变暗后变亮
                let fadeTween = tween(this.lunaSprite.color.clone())
                    // 透明度降低
                    .to(0.2, { a: 80 }, {
                        // 更新角色颜色
                        onUpdate: (target: Color) => {
                            this.lunaSprite.color = target;
                        }
                    }
                    )
                    // 透明度恢复
                    .to(0.2, { a: 255 }, {
                        // 更新角色颜色
                        onUpdate: (target: Color) => {
                            this.lunaSprite.color = target;
                        }
                    })
                    // 合并动画
                    .union()
                    // 重复播放动画3次
                    .repeat(3)
                    // 开始播放动画
                    .start();
            })
            // 再次将怪物节点移动到指定位置
            .to(0.1, { position: this.lunaInitPos.clone().add(new Vec3(-250, 0, 0)) })
            // 执行回调函数，判断角色生命值
            .call(() => {
                this.judgeLunaHP(-20);
            })
            // 开始播放动画
            .start();

        // 等待1200毫秒
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 将怪物节点移回初始位置
        tween(this.monsterNode)
            // 将怪物节点移回初始位置
            .to(0.5, { position: this.monsterInitPos.clone() })
            // 执行回调函数，显示战斗面板
            .call(() => {
                if(GameManager.Instance.battleNode.active == true)
                UIManager.Instance.showOrHideBattlePanel(true);
            })
            // 开始播放动画
            .start();
    }

    /**
     * 判断luna血量变化
     * @param value 血量变化值
     */
    judgeLunaHP(value: number) {
        //TODO: 判断角色血量，并处理战斗结果
        GameManager.Instance.addOrDecreaseHP(value);
        console.log("luna血量变化后为" + GameManager.Instance.lunaCurrentHP);
        if (GameManager.Instance.lunaCurrentHP <= 0) {
            this.lunaAnimator.setValue("Die", true);
            GameManager.Instance.playSound(this.dieSound);
            tween(this.lunaSprite.color.clone())
                // 透明度降低
                .to(0.8, { a: 0 }, {
                    // 更新角色颜色
                    onUpdate: (target: Color) => {
                        this.lunaSprite.color = target;
                    }
                }
                )
                .call(() => {
                    // 退出战斗
                    GameManager.Instance.enterOrExitBattle(false);
                })
                .start();
        }
    }
    /**
     * 判断monster血量变化
     * @param value 血量变化值
     */
    judgeMonsterHP(value: number) {
        //TODO: 判断怪物血量，并处理战斗结果
        if (GameManager.Instance.addOrDecreaseMonsterHP(value) <= 0) {
            GameManager.Instance.playSound(this.monsterDieSound);
            tween(this.monsterSprite.color.clone())
                // 透明度降低
                .to(0.4, { a: 0 }, {
                    // 更新角色颜色
                    onUpdate: (target: Color) => {
                        this.monsterSprite.color = target;
                    }
                }
                )
                .call(() => {
                    // 退出战斗
                    GameManager.Instance.enterOrExitBattle(false,1);
                })
                .start();
        } else {
            tween(this.monsterSprite.color.clone())
                // 透明度降低
                .to(0.2, { a: 255 }, {
                    // 更新角色颜色
                    onUpdate: (target: Color) => {
                        this.monsterSprite.color = target;
                    }
                }
                ).start();
        }
    }

    /**
     * luna逃跑
     */
    lunaEscape() {
        UIManager.Instance.showOrHideBattlePanel(false);
        tween(this.lunaNode)
        .to(0.5, { position: this.lunaInitPos.clone().add(new Vec3(400, 0, 0)) })
        .call(() => {GameManager.Instance.enterOrExitBattle(false);})
        .start();

        let battleMonsterNode=GameManager.Instance.battleMonsterNode;
        battleMonsterNode.setPosition(new Vec3(battleMonsterNode.position.x, battleMonsterNode.position.y + 200, battleMonsterNode.position.z))
        
        // 设置移动状态为移动中
        this.lunaAnimator.setValue("MoveState", true);
        // 设置移动值为-1，表示向相反方向移动
        this.lunaAnimator.setValue("MoveValue", 1);
    }
}
