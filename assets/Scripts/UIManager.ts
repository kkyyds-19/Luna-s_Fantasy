import { _decorator, Component, director, Label, Node, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    private static _instance: UIManager = null;
    @property(UITransform)
    public hpMask: UITransform = null;
    @property(UITransform)
    public mpMask: UITransform = null;
    private originalwidth:number;
    @property(Node)
    public battlePanelNode:Node = null;
    @property(Node)
    TalkPanelNode:Node=null;
    @property(Sprite)
    characterSprite:Sprite=null;
    @property({type: [SpriteFrame]})
    characterSpriteFrame: SpriteFrame[] = [];
    @property(Label)
    nameLabel:Label=null;
    @property(Label)
    contentLabel:Label=null;
    
    public static get Instance() { 
        return this._instance;
    }

    protected onLoad(): void {
        if (!UIManager.Instance) {
            UIManager._instance=this;
            director.addPersistRootNode(this.node);
        }
        this.originalwidth=this.hpMask.contentSize.width;
    }
    protected onDestroy(): void {
        if(UIManager.Instance==this) {
            UIManager._instance=null;
            this.node.destroy();
        }
    }
    
    public SetHPValue(fillPercent:number){
      this.hpMask.width=this.originalwidth*fillPercent;
    }
    public SetMPValue(fillPercent:number){
        this.mpMask.width=this.originalwidth*fillPercent;
      }
    public showOrHideBattlePanel(show:boolean){
        this.battlePanelNode.active=show;
    }
    
    showDialog(name:string=null,content:string=null){
        
        if(content==null){
        this.TalkPanelNode.active=false;
        }else{
            this.TalkPanelNode.active=true;
            if(name!=null){
                if(name=="Luna"){
                    this.characterSprite.spriteFrame=this.characterSpriteFrame[0];
                }else{
                    this.characterSprite.spriteFrame=this.characterSpriteFrame[1];
                }
            }
            this.contentLabel.string=content;
            this.nameLabel.string=name;
        }

    }
    
    private constructor() {
    super();
    }
}


