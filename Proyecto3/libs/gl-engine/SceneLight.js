export class SceneLight {
    constructor(position = [2, 2, 2, 1], color = [1, 1, 1], spot_direction = [0,-1,0], spot_cutoff = -1.0) {
        this.position = position
        this.color = color
        this.spot_direction = spot_direction
        this.spot_cutoff = spot_cutoff
    }
}
