import * as Snuff from "../snuffbox-webgl/snuff-webgl.js"

export function Terrain(scene, width, height)
{
    var _heightMap = null;
    
    var _rocksAlbedo = null;
    var _rocksNormal = null;
    var _rocksMetallic = null;

    var _mesh = null;
    var _material = null;
    var _renderer = null;

    var _width = width;
    var _height = height;

    var _createTerrainMesh = function(scene)
    {
        var positions = [];
        var indices = [];

        for (var y = 0; y <= _height; ++y)
        {
            for (var x = 0; x <= _width; ++x)
            {
                positions.push(x - _width * 0.5);
                positions.push(_height * 0.5 - y);
            }
        }

        for (var i = 0; i < (_width + 1) * _height; ++i)
        {
            if (i % (_width + 1) == _width)
            {
                continue;
            }

            indices.push(i);
            indices.push(i + 1);
            indices.push(i + _width + 1);
            indices.push(i + _width + 1);
            indices.push(i + 1);
            indices.push(i + _width + 2);
        }

        var renderer = scene.getRenderer();
        _mesh = renderer.createMesh();

        _mesh.setVertexAttribute("inPosition", new Float32Array(positions), 2);
        _mesh.setIndices(indices, Snuff.IndexTypes.UInt32);
    }

    this.onInit = function(scene)
    {
        var renderer = scene.getRenderer();

        _heightMap = renderer.createTexture(Snuff.TextureTypes.Tex2D, Snuff.TextureFormats.RGBA);
        _heightMap.loadFromImage("./assets/textures/terrain_height.png");

        _rocksAlbedo = renderer.createTexture(Snuff.TextureTypes.Tex2D, Snuff.TextureFormats.RGBA);
        _rocksAlbedo.loadFromImage("./assets/textures/splats/rocks_albedo.png");

        _rocksNormal = renderer.createTexture(Snuff.TextureTypes.Tex2D, Snuff.TextureFormats.RGBA);
        _rocksNormal.loadFromImage("./assets/textures/splats/rocks_normal.png");

        _rocksMetallic = renderer.createTexture(Snuff.TextureTypes.Tex2D, Snuff.TextureFormats.RGBA);
        _rocksMetallic.loadFromImage("./assets/textures/splats/rocks_metallic.png");

        var effect = renderer.getEffect("Terrain");
        
        _material = new Snuff.Material(effect, "Default", [_heightMap, _rocksAlbedo, _rocksNormal, _rocksMetallic]);
        
        _createTerrainMesh(scene);
        _renderer = this.addComponent(new Snuff.RendererComponent(_mesh, _material));

        _renderer.setUniformFloat2("MapSize", Snuff.math.Vector2.fromValues(_width, _height));

        _renderer.setUniformFloat("Metallic", 1.0);
        _renderer.setUniformFloat("Roughness", 0.95);
        _renderer.setUniformFloat("Specular", 0.75);
    }

    Snuff.Entity.call(this, scene);
}

Terrain.prototype = Object.create(Snuff.Entity.prototype);
Terrain.prototype.constructor = Terrain;