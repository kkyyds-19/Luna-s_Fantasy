import { _decorator, AudioClip, AudioSource, CCInteger, Component, director, math, Node, Vec3 } from 'cc';
import { UIManager } from './UIManager';
import { NPCDialog } from './NPCDialog';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager = null;

    // #region luna属性
    public lunaHP: number;//最大生命值
    public lunaCurrentHP: number;//当前生命值

    public lunaMP: number;//最大魔法值
    public lunaCurrentMP: number;//当前魔法值
    //#endregion
    //#region monster属性
    monsterCurrentHP: number;//当前怪物生命值
    //#endregion
    //#endregion
    @property(Node)
    battleNode: Node;//战斗场景

    public dialogInfoIndex: number = 0;//当前对话(大段)索引
    public canControlLuna: boolean;//是否可以控制luna
    @property(Boolean)
    hasPetTheDog: boolean = false;
    @property(Number)
    candleNum: number = 0;
    @property(Number)
    killNum: number = 0;
    @property(Node)
    monstersNode: Node;
    @property(NPCDialog)
    npcDialog: NPCDialog = null;
    enterBattle: boolean = false;
    battleMonsterNode: Node = null;
    @property(AudioSource)
    audioSource: AudioSource = null;
    @property(AudioClip)
    normalClip: AudioClip = null;
    @property(AudioClip)
    battleClip: AudioClip = null;
    // 只能通过自身进行初始化
    public static get Instance() {
        return this._instance;
    }
    // 类的初始化改为私有
    private constructor() {
        super();
    }

    protected onLoad(): void {
        if (!GameManager.Instance) {
            GameManager._instance = this;
            director.addPersistRootNode(this.node);
        }
    }
    protected start(): void {
        this.lunaCurrentHP = this.lunaHP = 100;
        this.lunaCurrentMP = this.lunaMP = 100;
        this.monsterCurrentHP = 50;
    }
    protected update(dt: number): void {
        if (!this.enterBattle) {
            if (this.lunaCurrentHP <= 100) {
                this.addOrDecreaseHP(dt);
            }
            if (this.lunaCurrentMP <= 100) {
                this.addOrDecreaseMP(dt);
            }
        }
    }

    // public changeHealth(amount: number): void {
    //     this.lunaCurrentHP = math.clamp(this.lunaCurrentHP + amount, 0, this.lunaHP);
    //     console.log("当前血量:" + this.lunaCurrentHP + ",最大血量:" + this.lunaHP);
    // }

    protected onDestroy(): void {
        if (GameManager.Instance == this) {
            GameManager._instance = null;
            this.node.destroy();
        }
    }
    enterOrExitBattle(enter: boolean = true, addkillNum: number = 0): void {
        // 根据enter参数设置战斗节点是否激活
        this.battleNode.active = enter;
        // 显示或隐藏战斗面板
        UIManager.Instance.showOrHideBattlePanel(enter);
        // 如果不是进入战斗状态
        if (!enter) {
            // 非战斗状态，或者战斗结束
            // 更新杀敌数
            this.killNum += addkillNum;
            // 如果杀敌数大于0
            if (addkillNum > 0) {
                // 销毁怪物
                this.destoryMonster();
            }
            // 重置怪物当前血量
            this.monsterCurrentHP = 50;
            this.playMusic(this.normalClip);
            // 如果露娜当前血量小于等于0
            if (this.lunaCurrentHP <= 0) {
                // 重置露娜当前血量和蓝量
                this.lunaCurrentHP = 100;
                this.lunaCurrentMP = 0;
                // 调整怪物位置
                this.battleMonsterNode.setPosition(new Vec3(this.battleMonsterNode.position.x, this.battleMonsterNode.position.y + 200, this.battleMonsterNode.position.z))
            }
        } else {
            this.playMusic(this.battleClip);
        }
        // 更新进入战斗状态标志
        this.enterBattle = enter;
    }
    destoryMonster() {
        if (this.battleMonsterNode) {
            this.battleMonsterNode.destroy();
        }
    }
    setMonster(node: Node) {
        this.battleMonsterNode = node;
    }


    /**
     * Luna血量改变
     * @param value 血量变化
     */
    addOrDecreaseHP(value: number): void {
        // 将传入的值加到当前生命值上
        this.lunaCurrentHP += value;
        // 如果当前生命值超过了最大生命值，则将当前生命值设置为最大生命值
        if (this.lunaCurrentHP >= this.lunaHP) {
            // 设置当前生命值为最大生命值
            this.lunaCurrentHP = this.lunaHP;
        }
        // 如果当前生命值小于等于0，则将当前生命值设置为0
        if (this.lunaCurrentHP <= 0) {
            // 设置当前生命值为0
            this.lunaCurrentHP = 0;
        }
        // 调用UI管理器实例的SetHPValue方法，传入当前生命值与最大生命值的比值，以更新UI显示的生命值
        UIManager.Instance.SetHPValue(this.lunaCurrentHP / this.lunaHP);
    }
    /**
     * Luna魔法值改变
     * @param value 魔法值变化
     */
    addOrDecreaseMP(value: number): void {
        this.lunaCurrentMP += value;
        if (this.lunaCurrentMP >= this.lunaMP) {
            this.lunaCurrentMP = this.lunaMP;
        }
        if (this.lunaCurrentMP <= 0) {
            this.lunaCurrentMP = 0;
        }
        UIManager.Instance.SetMPValue(this.lunaCurrentMP / this.lunaMP);
    }
    /**
     * 是否可以使用相关技能
     * @param value 技能耗费的蓝量
     * @returns 
     */
    canUsePlayerMP(value: number): boolean {
        return this.lunaCurrentMP >= value;
    }
    /**
     * monster血量改变
     * @param value 血量变化
     */
    addOrDecreaseMonsterHP(value: number): number {
        this.monsterCurrentHP += value;
        return this.monsterCurrentHP;
    }
    showMonster() {
        if (!this.monstersNode.active) {
            this.monstersNode.active = true;
        }
    }

    setContentIndex() {
        this.npcDialog.setContentIndex();
    }

    playMusic(audioClip: AudioClip) {
        if (this.audioSource.clip != audioClip) {
            this.audioSource.stop();
            this.audioSource.clip = audioClip;
            this.audioSource.play();
        }


    }
    playSound(audioClip: AudioClip) {
        // 判断音频片段是否存在
        if (audioClip) {
            // 播放音频片段
            // this.audioSource 表示音频源对象
            // playOneShot 是 Cocos中 AudioSource 组件的一个方法，用于播放一次音频片段
            this.audioSource.playOneShot(audioClip);
        }
    }
}
/*优点：
1.在内存中只有一个实例对象，不会过多创建很多对象，保证数据统一
2.避免我们对资源的多重占用

缺点：
1.由于不能多态(进行继承),导致可拓展性很差，所有的功能都只能写在一个类里面统一管理
*/

