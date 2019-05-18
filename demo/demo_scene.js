import * as Snuff from "../snuffbox-webgl/snuff-webgl.js"
import { Terrain } from "./terrain.js"
import { Atmosphere } from "./atmosphere.js"

export function DemoScene(renderer)
{
    Snuff.Scene.call(this, renderer);
    var _terrain = null;
    var _atmosphere = null;
    var _camera = new Snuff.Camera(Snuff.CameraTypes.Perspective, 90.0);
    var _skyboxTarget = null;

    var _loadAssets = function(renderer)
    {
        renderer.loadShaderFromPath("./assets/shaders/terrain.vs", Snuff.ShaderTypes.Vertex, {
            include: ["./assets/shaders/default_uniforms.h"],
            name: "TerrainVS"
        });

        renderer.loadShaderFromPath("./assets/shaders/terrain.ps", Snuff.ShaderTypes.Pixel, {
            include: ["./assets/shaders/default_uniforms.h", "./assets/shaders/pbr.h"],
            name: "TerrainPS"
        });

        renderer.loadShaderFromPath("./assets/shaders/skybox.vs", Snuff.ShaderTypes.Vertex, {
            include: ["./assets/shaders/default_uniforms.h"],
            name: "SkyboxVS"
        });

        renderer.loadShaderFromPath("./assets/shaders/skybox.ps", Snuff.ShaderTypes.Pixel, {
            include: ["./assets/shaders/default_uniforms.h", "./assets/shaders/atmosphere.h"],
            name: "SkyboxPS"
        });

        renderer.loadShaderFromPath("./assets/shaders/skybox_filter.vs", Snuff.ShaderTypes.Vertex, {
            include: ["./assets/shaders/default_uniforms.h"],
            name: "SkyboxFilterVS"
        });

        renderer.loadShaderFromPath("./assets/shaders/skybox_filter.ps", Snuff.ShaderTypes.Pixel, {
            include: ["./assets/shaders/default_uniforms.h", "./assets/shaders/atmosphere.h"],
            name: "SkyboxFilterPS"
        });

        renderer.loadEffect("Terrain", "./assets/effects/terrain.effect");
        renderer.loadEffect("Skybox", "./assets/effects/skybox.effect");
    }

    this.init = function(renderer)
    {
        _loadAssets(renderer);

        _skyboxTarget = renderer.createRenderTarget(512, 512, Snuff.TextureTypes.Tex3D, Snuff.TextureFormats.RGBA, 1);

        _atmosphere = new Atmosphere(this, _skyboxTarget);
        _terrain = new Terrain(this, 1024, 1024, _atmosphere);
        
        _camera.setLocalTranslation(0.0, 200.0, 0.0);
        _camera.setFarPlane(2000);
        _camera.setRotationEuler(0.0, 0.0, 0.0);
    }

    this.update = function(dt)
    {
        this.updateEntities(dt);

        var sunPos = _atmosphere.getSunPosition();
        _camera.setRotationEuler(0.0, ((sunPos[2] + 1.0) * 0.5) * 180.0, 0.0);
    }

    this.draw = function(dt)
    {
        var renderer = this.getRenderer();

        if (renderer.getFrameCount() == 0)
        {
            _skyboxTarget.clear([1.0, 0.0, 1.0, 1.0]);
            renderer.setTarget(_skyboxTarget);
            renderer.renderPass(_camera, "SkyboxFilter");
        }

        renderer.setTarget(null);
        renderer.renderPass(_camera, "Skybox");
        renderer.renderPass(_camera, "Default");
    }

    this.init(renderer);
}

DemoScene.prototype = Object.create(Snuff.Scene.prototype);
DemoScene.prototype.constructor = DemoScene;