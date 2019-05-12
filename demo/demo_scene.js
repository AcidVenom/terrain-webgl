import * as Snuff from "../snuffbox-webgl/snuff-webgl.js"
import { Terrain } from "./terrain.js";

export function DemoScene(renderer)
{
    Snuff.Scene.call(this, renderer);
    var _terrain = null;
    var _camera = new Snuff.Camera(Snuff.CameraTypes.Perspective, 90.0);

    this.init = function(renderer)
    {
        renderer.loadShaderFromPath("./assets/shaders/terrain.vs", Snuff.ShaderTypes.Vertex, {
            include: ["./assets/shaders/default_uniforms.h"],
            name: "TerrainVS"
        });

        renderer.loadShaderFromPath("./assets/shaders/terrain.ps", Snuff.ShaderTypes.Pixel, {
            include: ["./assets/shaders/default_uniforms.h"],
            name: "TerrainPS"
        });

        renderer.loadEffect("Terrain", "./assets/effects/terrain.effect");

        _terrain = new Terrain(this, 1024, 1024);
        _camera.setLocalTranslation(0.0, 300.0, 600.0);
        _camera.setFarPlane(10000);
        _camera.setRotationEuler(-30.0, 0.0, 0.0);
    }

    this.update = function(dt)
    {
        this.updateEntities(dt);
    }

    this.draw = function(dt)
    {
        var renderer = this.getRenderer();

        renderer.setTarget(null);
        renderer.renderPass(_camera, "Default");
    }

    this.init(renderer);
}

DemoScene.prototype = Object.create(Snuff.Scene.prototype);
DemoScene.prototype.constructor = DemoScene;