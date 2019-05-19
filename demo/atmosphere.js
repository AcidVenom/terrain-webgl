import * as Snuff from "../snuffbox-webgl/snuff-webgl.js"

export function Atmosphere(scene, skyboxTarget)
{
    var _skyboxMesh = null;
    var _skyboxMaterial = null;
    var _skybox = null;
    var _skyboxRenderer = null;
    var _timeOfDay = 1.0;
    var _day = 0.0;
    var _sunPosition = Snuff.math.Vector3.fromValues(0.0, 1.0, 0.0);
    var _moonPosition = Snuff.math.Vector3.fromValues(0.0, -1.0, 0.0);
    var _skyboxTarget = skyboxTarget;
    var _paused = false;

    this.onInit = function()
    {
        var renderer = this.getScene().getRenderer();

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

        _skybox = new Snuff.Entity(scene);
        _skyboxRenderer = _skybox.addComponent(new Snuff.RendererComponent(_skyboxMesh, _skyboxMaterial));
    }

    var _updateTimeOfDay = function(dt)
    {
        var lerp = function(a, b, t)
        {
            return a * (1.0 - t) + b * t;
        }

        _paused = document.querySelector("#checkboxPause").checked;
        var slider = document.querySelector("#timeOfDaySlider");
        if (_paused == true)
        {
            _timeOfDay = new Number(slider.value);
        }
        else
        {
            _timeOfDay += dt * 0.05;
            slider.value = _timeOfDay;
        }

        while (_timeOfDay > 1.0)
        {
            _timeOfDay -= 1.0;
            _day += 1.0;
        }

        var angle = _timeOfDay * Math.PI * 2.0 - Math.PI * 0.5;

        var z = Math.sin(angle);
        var y = Math.cos(angle);

        _sunPosition = Snuff.math.Vector3.fromValues(0.5, y, z);
        _moonPosition = Snuff.math.Vector3.negate(_moonPosition, _sunPosition);

        _skyboxRenderer.setUniformFloat3("SunPosition", _sunPosition);
        _skyboxRenderer.setUniformFloat3("MoonPosition", _moonPosition);
        _skyboxRenderer.setUniformFloat("TimeOfDay", _timeOfDay);
        _skyboxRenderer.setUniformFloat("Day", _day);
    }

    this.onUpdate = function(dt)
    {
        _updateTimeOfDay(dt);
    }

    this.getSunPosition = function()
    {
        return _sunPosition;
    }

    this.getMoonPosition = function()
    {
        return _moonPosition;
    }

    this.getTimeOfDay = function()
    {
        return _timeOfDay;
    }

    Snuff.Entity.call(this, scene);
}

Atmosphere.prototype = Object.create(Snuff.Entity);
Atmosphere.prototype.constructor = Atmosphere;