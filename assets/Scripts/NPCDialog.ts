import { _decorator, Animation, animation, Component, Node } from 'cc';
import { GameManager } from './GameManager';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('NPCDialog')
export class NPCDialog extends Component {
    private dialogInfoList: DialogInfo[][];
    @property(Number)
    contentIndex: number = 0;
    @property(animation.AnimationController)
    animationController: animation.AnimationController = null;
    start() {
        
        this.dialogInfoList = [
            
            [{ name: "Luna", content: "(,,･∀･)ﾉ゛hello，我是Luna，你可以用上下左右控制我移动，空格键与NPC进行对话，战斗中需要简单点击按钮执行相应行为" }],
            
            [
                { name: "Nala", content: "好久不见了，小猫咪(*ΦωΦ*)，Luna~" },
                { name: "Luna", content: "好久不见，Nala,你还是那么有活力，哈哈" },
                { name: "Nala", content: "还好吧~" },
                { name: "Nala", content: "我的狗一直在叫，但是我这会忙不过来，你能帮我安抚一下它吗？" },
                { name: "Luna", content: "啊？" },
                { name: "Nala", content: "(,,´•ω•)ノ(´っω•｀。)摸摸他就行，摸摸说呦西呦西，真是个好孩子呐" },
                { name: "Nala", content: "别看他叫的这么凶，其实他就是想引起别人的注意" },
                { name: "Luna", content: "可是。。。。" },
                { name: "Luna", content: "我是猫女郎啊" },
                { name: "Nala", content: "安心啦，不会咬你哒，去吧去吧~" }
            ],
            
            [
                { name: "Nala", content: "他还在叫呢" }
            ],
            
            [
                { name: "Nala", content: "感谢你呐，Luna，你还是那么可靠！" },
                { name: "Nala", content: "我想请你帮个忙好吗" },
                { name: "Nala", content: "说起来这事怪我。。。" },
                { name: "Nala", content: "今天我睡过头了，出门比较匆忙" },
                { name: "Nala", content: "然后装蜡烛的袋子口子没封好!o(╥﹏╥)o" },
                { name: "Nala", content: "结果就。。。蜡烛基本丢完了" },
                { name: "Luna", content: "你还是老样子，哈哈。。" },
                { name: "Nala", content: "所以，所以喽，你帮帮忙，帮我把蜡烛找回来" },
                { name: "Nala", content: "如果你能帮我找回全部的5根蜡烛，我就送你一把神器" },
                { name: "Luna", content: "神器？(¯﹃¯)" },
                { name: "Nala", content: "是的，我感觉很适合你，加油呐~" },
            ],
            
            [
                { name: "Nala", content: "你还没帮我收集到所有的蜡烛，宝~" },
            ],
            
            [
                { name: "Nala", content: "可靠啊！竟然一个不差的全收集回来了" },
                { name: "Luna", content: "你知道多累吗？" },
                { name: "Luna", content: "你到处跑，真的很难收集" },
                { name: "Nala", content: "辛苦啦辛苦啦" },
                { name: "Nala", content: "这是给你的奖励" },
                { name: "Nala", content: "蓝纹火锤，传说中的神器" },
                { name: "Nala", content: "应该挺适合你的" },
                { name: "Luna", content: "~~获得蓝纹火锤~~（遇到怪物可触发战斗）" },
                { name: "Luna", content: "哇，谢谢你！Thanks♪(･ω･)ﾉ" },
                { name: "Nala", content: "嘿嘿(*^▽^*)，咱们的关系不用客气" },
                { name: "Nala", content: "正好，最近山里出现了一堆怪物，你也算为民除害，帮忙清理5只怪物" },
                { name: "Luna", content: "啊？" },
                { name: "Luna", content: "这才是你的真实目的吧？！" },
                { name: "Nala", content: "拜托拜托啦，否则真的很不方便我卖东西" },
                { name: "Luna", content: "无语中。。。" },
                { name: "Nala", content: "求求你了，啵啵~" },
                { name: "Luna", content: "哎，行吧，谁让你大呢~" },
                { name: "Nala", content: "嘻嘻，那辛苦宝子啦" }
            ],
            
            [
                { name: "Nala", content: "宝，你还没清理干净呢,这样我不方便嘛~" },
            ],
            
            [
                { name: "Nala", content: "真棒，luna，周围的居民都会十分感谢你的，有机会来我家喝一杯吧~" },
                { name: "Luna", content: "我觉得可行，哈哈~" }
            ],
            
            [
                { name: "Nala", content: "改天再见喽~" },
            ],
        ];
        GameManager.Instance.dialogInfoIndex = 0;
        this.contentIndex = 1;
    }
    displayDialog() {
        if (GameManager.Instance.dialogInfoIndex > 8) return;
        if (this.contentIndex >= this.dialogInfoList[GameManager.Instance.dialogInfoIndex].length) {
            
            if (GameManager.Instance.dialogInfoIndex == 2 && !GameManager.Instance.hasPetTheDog) { }
            else if (GameManager.Instance.dialogInfoIndex == 4 && GameManager.Instance.candleNum < 5) { }
            else if (GameManager.Instance.dialogInfoIndex == 6 && GameManager.Instance.killNum < 4) { }
            else if (GameManager.Instance.dialogInfoIndex == 8) { }
            else {
                GameManager.Instance.dialogInfoIndex++;
            }
            if (GameManager.Instance.dialogInfoIndex == 6) {
                
                GameManager.Instance.showMonster();
            }
            
            this.contentIndex = 0;
            UIManager.Instance.showDialog();
            GameManager.Instance.canControlLuna = true;
        } else {
            let dialogInfo = this.dialogInfoList[GameManager.Instance.dialogInfoIndex][this.contentIndex];
            UIManager.Instance.showDialog(dialogInfo.name, dialogInfo.content);
            this.contentIndex++;
            this.animationController.setValue("Talk", true);
        }
    }
    
    setContentIndex() {
        this.contentIndex =this.dialogInfoList[GameManager.Instance.dialogInfoIndex].length;
    }

}


interface DialogInfo {
    name: string;
    content: string;
}

