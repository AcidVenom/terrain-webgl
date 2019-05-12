import * as Snuff from "../snuffbox-webgl/snuff-webgl.js"

export function DemoScene(renderer)
{
    Snuff.Scene.call(this, renderer);

    this.update = function(dt)
    {
        
    }

    this.draw = function(dt)
    {
        
    }
}

DemoScene.prototype = Object.create(Snuff.Scene.prototype);
DemoScene.prototype.constructor = DemoScene;