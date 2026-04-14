import { _decorator, Button, Component, Label, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('SingletonExmaple')
export class SingletonExmaple extends Component {
    @property(Button)
    private addButton: Button = null;
    @property(Button)
    private reduceButton: Button = null;
    @property(Label)
    private countLabel: Label = null;

    protected onLoad(): void {
        this.addButton.node.on("click",this.Onclick_AddButton,this);
        this.reduceButton.node.on("click",this.Onclick_reduceButton,this);
    }
    private Onclick_AddButton(){
        GameManager.Instance.count++;
        this.RefreshcountLabel();
    }
    private Onclick_reduceButton(){
        GameManager.Instance.count--;
        this.RefreshcountLabel();
    }

    private RefreshcountLabel(): void {
        this.countLabel.string = GameManager.Instance.count.toString();
    }
}


