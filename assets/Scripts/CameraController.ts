import { _decorator, Component, math, Node, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    player: Node = null;
    @property
    cameraOffset: Vec3 = new Vec3(0, 0, 0);
    @property
    smoothFactor: number = 0.1;

    mapWidth: number = 4722;
    mapHeight: number = 4506;
    protected start(): void {
        this.player = this.node.parent
    }
    //1.确保其他对象更新了位置后，再更新相机
    //2.保持视觉效果的连贯性
    //3.符合cocos的执行顺序
    //4.优化性能
    protected lateUpdate(dt: number): void {
        if(this.player){
        //计算期望摄像机调整到的位置：玩家位置加上摄像机偏移量
        let desiredPos = this.player.worldPosition.clone().add(this.cameraOffset);
        //使用插值计算平滑过渡摄像机的位置
        let smoothedPos=this.node.worldPosition.clone().lerp(desiredPos,this.smoothFactor);
        //设置摄像机的世界位置为平滑过渡后的位置
        this.node.setWorldPosition(smoothedPos);
        this.limitCameraToBounds();
        }
    }


    limitCameraToBounds() {
        let halfWidth = this.mapWidth / 2;
        let halfHeight = this.mapHeight / 2;
        
        let leftBound =- this.mapWidth / 2;//左边界
        let rightBound = this.mapWidth / 2;//右边界
        let topBound = this.mapHeight / 2;//上边界
        let bottomBound = -this.mapHeight / 2;//下边界

        // 获取相机的世界位置并复制
        let cameraPos = this.node.worldPosition.clone();
        // console.log("halfwidth:" + halfWidth + "  halfHeight:" + halfHeight + "cameraPos:" + cameraPos.toString());

        // 限制相机的 x 坐标在地图宽度的一半范围内
        cameraPos.x = Math.min(Math.max(cameraPos.x, leftBound+view.getDesignResolutionSize().width), rightBound);
        // 限制相机的 y 坐标在地图高度的一半范围内
        cameraPos.y = Math.min(Math.max(cameraPos.y, bottomBound+view.getDesignResolutionSize().height), topBound);
        // 设置相机的世界位置
        this.node.setWorldPosition(cameraPos);
    }

}
