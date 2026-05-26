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
    
    
    
    
    protected lateUpdate(dt: number): void {
        if(this.player){
        
        let desiredPos = this.player.worldPosition.clone().add(this.cameraOffset);
        
        let smoothedPos=this.node.worldPosition.clone().lerp(desiredPos,this.smoothFactor);
        
        this.node.setWorldPosition(smoothedPos);
        this.limitCameraToBounds();
        }
    }


    limitCameraToBounds() {
        let halfWidth = this.mapWidth / 2;
        let halfHeight = this.mapHeight / 2;
        
        let leftBound =- this.mapWidth / 2;
        let rightBound = this.mapWidth / 2;
        let topBound = this.mapHeight / 2;
        let bottomBound = -this.mapHeight / 2;

        
        let cameraPos = this.node.worldPosition.clone();
        

        
        cameraPos.x = Math.min(Math.max(cameraPos.x, leftBound+view.getDesignResolutionSize().width), rightBound);
        
        cameraPos.y = Math.min(Math.max(cameraPos.y, bottomBound+view.getDesignResolutionSize().height), topBound);
        
        this.node.setWorldPosition(cameraPos);
    }

}
