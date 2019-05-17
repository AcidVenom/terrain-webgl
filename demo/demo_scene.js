import * as Snuff from "../snuffbox-webgl/snuff-webgl.js"
import { Terrain } from "./terrain.js";

export function DemoScene(renderer)
{
    Snuff.Scene.call(this, renderer);
    var _terrain = null;
    var _skybox = null;
    var _skyboxRenderer = null;
    var _camera = new Snuff.Camera(Snuff.CameraTypes.Perspective, 90.0);
    var _skyboxTarget = null;
    var _skyboxMesh = null;
    var _skyboxMaterial = null;

    this.init = function(renderer)
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

        _skyboxTarget = renderer.createRenderTarget(512, 512, Snuff.TextureTypes.Tex3D, Snuff.TextureFormats.RGBA, 1);

        _terrain = new Terrain(this, 1024, 1024);
        _camera.setLocalTranslation(0.0, 200.0, 0.0);
        _camera.setFarPlane(2000);
        _camera.setRotationEuler(0.0, 0.0, 0.0);

        _skyboxMesh = renderer.createMesh();

        var position = 
        [
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0
        ];

        var indices = [0, 1, 2, 2, 1, 3];

        _skyboxMesh.setVertexAttribute("inPosition", new Float32Array(position), 2);
        _skyboxMesh.setIndices(indices);

        _skyboxMaterial = new Snuff.Material(renderer.getEffect("Skybox"), "Default", [_skyboxTarget.getTexture(0)]);

        _skybox = new Snuff.Entity(this);
        _skyboxRenderer = _skybox.addComponent(new Snuff.RendererComponent(_skyboxMesh, _skyboxMaterial));
    }

    this.update = function(dt)
    {
        this.updateEntities(dt);
        var lerp = function(a, b, t)
        {
            return a * (1.0 - t) + (b * t);
        }

        var timeOfDay = new Number(document.querySelector("#timeOfDaySlider").value);

        var t = Math.min(timeOfDay, 1.0);
        
        var vecA = Snuff.math.Vector3.fromValues(0.5, 0.0, -1.0);
        var vecB = Snuff.math.Vector3.fromValues(0.5, 1.0, 0.0);
        var vecC = Snuff.math.Vector3.fromValues(0.5, 0.0, 1.0);

        var vecFirst = Snuff.math.Vector3.create();
        var vecSecond = Snuff.math.Vector3.create();

        vecFirst = Snuff.math.Vector3.lerp(vecFirst, vecA, vecB, Math.min(1.0, t * 2.0));
        vecSecond = Snuff.math.Vector3.lerp(vecSecond, vecB, vecC, Math.max(0.0, t - 0.5) * 2.0);

        var vecFinal = Snuff.math.Vector3.create();
        vecFinal = Snuff.math.Vector3.lerp(vecFinal, vecFirst, vecSecond, t);

        _camera.setRotationEuler(0.0, ((vecFinal[2] + 1.0) * 0.5) * 180.0, 0.0);
        
        vecFinal = Snuff.math.Vector3.scale(vecFinal, vecFinal, 1.0 - Math.abs(t * 2.0 - 1.0));
        _skyboxRenderer.setUniformFloat3("SunPosition", vecFinal);

        _terrain.getComponent(Snuff.RendererComponent).setUniformFloat3("SunPosition", vecFinal);
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