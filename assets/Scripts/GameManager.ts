import { _decorator, AudioClip, AudioSource, CCInteger, Component, director, math, Node, Vec3 } from 'cc';
import { UIManager } from './UIManager';
import { NPCDialog } from './NPCDialog';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager = null;

    
    public lunaHP: number;
    public lunaCurrentHP: number;

    public lunaMP: number;
    public lunaCurrentMP: number;
    
    
    monsterCurrentHP: number;
    
    
    @property(Node)
    battleNode: Node;

    public dialogInfoIndex: number = 0;
    public canControlLuna: boolean;
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
    
    public static get Instance() {
        return this._instance;
    }
    
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

    
    
    
    

    protected onDestroy(): void {
        if (GameManager.Instance == this) {
            GameManager._instance = null;
            this.node.destroy();
        }
    }
    enterOrExitBattle(enter: boolean = true, addkillNum: number = 0): void {
        
        this.battleNode.active = enter;
        
        UIManager.Instance.showOrHideBattlePanel(enter);
        
        if (!enter) {
            
            
            this.killNum += addkillNum;
            
            if (addkillNum > 0) {
                
                this.destoryMonster();
            }
            
            this.monsterCurrentHP = 50;
            this.playMusic(this.normalClip);
            
            if (this.lunaCurrentHP <= 0) {
                
                this.lunaCurrentHP = 100;
                this.lunaCurrentMP = 0;
                
                this.battleMonsterNode.setPosition(new Vec3(this.battleMonsterNode.position.x, this.battleMonsterNode.position.y + 200, this.battleMonsterNode.position.z))
            }
        } else {
            this.playMusic(this.battleClip);
        }
        
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


    
    addOrDecreaseHP(value: number): void {
        
        this.lunaCurrentHP += value;
        
        if (this.lunaCurrentHP >= this.lunaHP) {
            
            this.lunaCurrentHP = this.lunaHP;
        }
        
        if (this.lunaCurrentHP <= 0) {
            
            this.lunaCurrentHP = 0;
        }
        
        UIManager.Instance.SetHPValue(this.lunaCurrentHP / this.lunaHP);
    }
    
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
    
    canUsePlayerMP(value: number): boolean {
        return this.lunaCurrentMP >= value;
    }
    
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
        
        if (audioClip) {
            
            
            
            this.audioSource.playOneShot(audioClip);
        }
    }
}


