(() => {

let renderer, scene, camera, iframe, mouse, container, avatarMesh, engineMesh, meteorMesher;

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localCoord = new THREE.Vector2();
const localPlane = new THREE.Plane();
const localLine = new THREE.Line3();
const localLine2 = new THREE.Line3();
const localRaycaster = new THREE.Raycaster();

function init() {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('hero-canvas'),
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // window.browser.magicleap.RequestDepthPopulation(true);
  // renderer.autoClear = false;

  scene = new THREE.Scene();
  scene.matrixAutoUpdate = false;
  // scene.background = new THREE.Color(0xFFFFFF);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  // camera.lookAt(new THREE.Vector3());
  scene.add(camera);

  const SCENES = {
    desktop: {
      camera: new THREE.Vector3(-1.5, 1, 2),
    },
    mobile: {
      camera: new THREE.Vector3(0, 1.8, 2),
    },
  };
  const _setCamera = () => {
    const SCENE = SCENES[window.innerWidth >= 800 ? 'desktop' : 'mobile'];
    camera.position.copy(SCENE.camera);

    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  };
  _setCamera();

  container = new THREE.Object3D();

  const ambientLight = new THREE.AmbientLight(0x808080);
  scene.add(ambientLight);

  {
    const SHADOW_MAP_WIDTH = 1024;
    const SHADOW_MAP_HEIGHT = 1024;

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(-3, 3, 1);
    directionalLight.target.position.set(0, 0, 0);

    directionalLight.castShadow = true;

    directionalLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 ) );
    // directionalLight.shadow.bias = 0.0001;

    directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    directionalLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    container.add(directionalLight);
  }

  const groundMesh = (() => {
    const geometry = new THREE.PlaneBufferGeometry(100, 100);
    const material = new THREE.MeshPhongMaterial({
      color: 0xCCCCCC,
    });
    const mesh = new THREE.Mesh(geometry, material);

    // mesh.position.set(0, 0, 0);
    mesh.rotation.x = -Math.PI/2;
    // mesh.scale.set( 100, 100, 100 );

    // mesh.castShadow = false;
    mesh.receiveShadow = true;

    return mesh;
  })();
  container.add(groundMesh);

  avatarMesh = (() => {
    const DEFAULT_SKIN_URL = 'img/skin.png';

    const mesh = skin({
      limbs: true,
    });
    mesh.castShadow = true;
    /* {
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1).normalize(),
        new THREE.Vector3(0, -1, -2).normalize()
      );
      mesh.material.uniforms.headRotation.value.x = quaternion.x;
      mesh.material.uniforms.headRotation.value.y = quaternion.y;
      mesh.material.uniforms.headRotation.value.z = quaternion.z;
      mesh.material.uniforms.headRotation.value.w = quaternion.w;
    }
    {
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, -1, 0).normalize(),
        new THREE.Vector3(0.5, 1, 2).normalize()
      );
      mesh.material.uniforms.leftArmRotation.value.x = quaternion.x;
      mesh.material.uniforms.leftArmRotation.value.y = quaternion.y;
      mesh.material.uniforms.leftArmRotation.value.z = quaternion.z;
      mesh.material.uniforms.leftArmRotation.value.w = quaternion.w;
    }
    {
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, -1, 0).normalize(),
        new THREE.Vector3(0, -0.9, 1).normalize()
      );
      mesh.material.uniforms.rightArmRotation.value.x = quaternion.x;
      mesh.material.uniforms.rightArmRotation.value.y = quaternion.y;
      mesh.material.uniforms.rightArmRotation.value.z = quaternion.z;
      mesh.material.uniforms.rightArmRotation.value.w = quaternion.w;
    } */

    // const uniforms = THREE.UniformsUtils.clone(skin.SKIN_SHADER.uniforms);

    new Promise((accept, reject) => {
      const skinImg = new Image();
      skinImg.crossOrigin = 'Anonymous';
      skinImg.src = DEFAULT_SKIN_URL;
      skinImg.onload = () => {
        accept(skinImg);
      };
      skinImg.onerror = err => {
        reject(err);
      };
    })
      .then(skinImg => {
        mesh.setImage(skinImg);
      });

    return mesh;
  })();
  container.add(avatarMesh);

  mloMesh = (() => {
    const object = new THREE.Object3D();
    object.lightwear = null;
    object.control = null;
    object.lightpack = null;

    const loader = new THREE.GLTFLoader().setPath( 'models/' );
    loader.load( 'mlo.glb', function ( o ) {

      o = o.scene;
      o.traverse(e => {
        e.castShadow = true;
      });

      const scale = 1 / 18;
      const offsetY = (22 + 13.5/2 - 8/2)*scale;

      for (let i = 0; i < o.children.length; i++) {
        const child = o.children[i];
        if (/^lightwear$/i.test(child.name)) {
          object.lightwear = child;
          child.position.y = 1.6 - offsetY;

          /* const frustumMesh = (() => {
            const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
            positions = geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
              if (positions[i+2] < 0) {
                positions[i+0] *= 0.5;
                positions[i+1] *= 0.5;
              }
              positions[i+2] += 1/2 + 0.3;
              positions[i+1] *= 2/3;
            }

            const material = new THREE.MeshPhongMaterial({
              // color: 0x7e57c2,
              color: 0xec407a,
              opacity: 0.5,
              transparent: true,
            });
            const mesh = new THREE.Mesh(geometry, material);
            return mesh;
          })();
          child.add(frustumMesh); */
        } else if (/^control$/i.test(child.name)) {
          object.control = child;
          child.visible = false;
        } else if (/^lightpack$/i.test(child.name)) {
          object.lightpack = child;
          child.position.set(-0.28, -0.7, 0);
          // child.rotation.x = -Math.PI/2;
          child.rotation.x = -Math.PI/2;
          child.rotation.z = Math.PI/2;
          child.rotation.order = 'YXZ';
          // child.visible = false;
        }
      }

      o.position.set(0, offsetY, 0);
      // o.scale.set(0.15, 0.15, 0.15);
      // o.updateMatrixWorld();
      object.add(o);

    }, undefined, function ( e ) {

      console.error( e );

    } );

    return object;
  })();
  container.add(mloMesh);

  engineMesh = (() => {
    const object = new THREE.Object3D();
    object.basePosition = new THREE.Vector3(-1, 0, -1);
    object.nextUpdateTime = 0;
    object.exobotMeshes = [];

    const loader = new THREE.GLTFLoader().setPath( 'models/' );
    loader.load( 'engine.glb', function ( o ) {

      o = o.scene;
      o.traverse(e => {
        e.castShadow = true;
      });

      o.position.set(0, 0.15, 0);
      o.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0, 0, 1)
      );
      o.scale.set(0.15, 0.15, 0.15);
      o.updateMatrixWorld();
      object.add(o);

    }, undefined, function ( e ) {

      console.error( e );

    } );

    return object;
  })();
  container.add(engineMesh);

  exobotMesh = (() => {
    const object = new THREE.Object3D();
    object.rotation.order = 'YXZ';
    object.basePosition = new THREE.Vector3(-1, 1.5, -1);
    object.scale.set(0.2, 0.2, 0.2);

    const loader = new THREE.GLTFLoader().setPath( 'models/' );
    loader.load( 'exobot.glb', function ( o ) {

      o = o.scene;
      o.traverse(e => {
        e.castShadow = true;
      });

      /* o.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0, 0, 1)
      ); */
      o.updateMatrixWorld();
      object.add(o);

    }, undefined, function ( e ) {

      console.error( e );

    } );

    return object;
  })();
  container.add(exobotMesh);

  mouse = {
    x: 0.5,
    y: 0.5,
  };
  const _applyUniformRotation = (r, t) => {
    t.x = r.x;
    t.y = r.y;
    t.z = r.z;
    t.w = r.w;
  };
  const _updateSkin = () => {
    const headQuaternion = new THREE.Quaternion()
      .setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-(mouse.x-0.5)*2, (mouse.y-0.5)*2, -1).normalize()
      );
    _applyUniformRotation(
      headQuaternion,
      avatarMesh.material.uniforms.headRotation.value
    );
    _applyUniformRotation(
      new THREE.Quaternion()
        .setFromUnitVectors(
          new THREE.Vector3(0, -1, 0),
          new THREE.Vector3(0.5 - (mouse.x-0.5)*2, 1 - (mouse.y-0.5)*2, 2).normalize()
        ).premultiply(
          new THREE.Quaternion()
            .setFromUnitVectors(
              new THREE.Vector3(0, 0, -1),
              new THREE.Vector3(1, 0, 0)
            )
        ),
        avatarMesh.material.uniforms.leftArmRotation.value
    );
    _applyUniformRotation(
      new THREE.Quaternion()
        .setFromUnitVectors(
          new THREE.Vector3(-1, 0, 0),
          new THREE.Vector3((mouse.x-0.5)*2, 0.5-(mouse.y-0.5)*2, -2).normalize()
        ).premultiply(
          new THREE.Quaternion()
            .setFromUnitVectors(
              new THREE.Vector3(0, 0, -1),
              new THREE.Vector3(-1, 0, 0)
            )
        ),
        avatarMesh.material.uniforms.rightArmRotation.value
    );
    avatarMesh.material.uniforms.theta.value = (mouse.y-0.5)*0.1*Math.PI;

    mloMesh.lightwear &&  mloMesh.lightwear.quaternion
      .copy(headQuaternion.inverse())
      .multiply(
        new THREE.Quaternion()
          .setFromUnitVectors(
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(0, 0, 1)
          )
      );
  };
  _updateSkin();

  /* const boxMesh = (() => {
    // const geometry = new THREE.BoxBufferGeometry(0.3, 0.3, 0.3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      // wireframe: true,
    });
    const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3)), material);

    const glassesMesh = (() => {
      // const geometry = new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(0.35, 0.15, 0.05));
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        // wireframe: true,
      });
      const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.35, 0.15, 0.05)), material);
      mesh.position.set(0, 0.07, -0.3/2 - 0.05/2);

      const eyeMesh = (() => {
        const geometry = new THREE.PlaneBufferGeometry(0.3, 0.1);
        const material = new THREE.MeshBasicMaterial({
          color: 0xec407a,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        // mesh.position.set(0.09, 0, -0.05/2);
        mesh.position.set(0, 0, -0.05/2);
        return mesh;
      })();
      mesh.add(eyeMesh);

      const leftFrameMesh = (() => {
        const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.05, 0.05, 0.3)), material);
        mesh.position.set(-0.18, 0.07, 0.3/2 + 0.05/2);
        mesh.rotation.x = -0.1 * Math.PI;
        mesh.rotation.order = 'YXZ';
        return mesh;
      })();
      mesh.add(leftFrameMesh);
      const rightFrameMesh = (() => {
        const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.05, 0.05, 0.3)), material);
        mesh.position.set(0.18, 0.07, 0.3/2 + 0.05/2);
        mesh.rotation.x = -0.1 * Math.PI;
        mesh.rotation.order = 'YXZ';
        return mesh;
      })();
      mesh.add(rightFrameMesh);
      const backFrameMesh = (() => {
        const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.3, 0.05, 0.05)), material);
        mesh.position.set(0, 0.13, 0.34);
        mesh.rotation.x = -0.1 * Math.PI;
        mesh.rotation.order = 'YXZ';
        return mesh;
      })();
      mesh.add(backFrameMesh);

      return mesh;
    })();
    mesh.add(glassesMesh);

    return mesh;
  })();
  container.add(boxMesh); */

  const tabMesh1 = (() => {
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      // wireframe: true,
    });
    const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0)), material);
    mesh.position.set(-1, 1.5, -1.5);

    const labelMesh = (() => {
      const geometry = new THREE.PlaneBufferGeometry(1, 0.2);
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024 * 0.2;
      // canvas.style.backgroundColor = 'red';
      const ctx = canvas.getContext('2d');
      ctx.font = '140px -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
      ctx.fillText('http://A-Frame', 0, 150);
      // window.document.body.appendChild(canvas);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 0.7;
      return mesh;
    })();
    mesh.add(labelMesh);

    return mesh;
  })();
  container.add(tabMesh1);

  const innerMesh = (() => {
    const geometry = new THREE.PlaneBufferGeometry(1, 1);
    const mesh = new THREE.Reflector(geometry, {
      clipBias: 0.003,
      textureWidth: 1024 * window.devicePixelRatio,
      textureHeight: 1024 * window.devicePixelRatio,
      color: 0x889999,
      addColor: 0x300000,
      recursion: 1
    });
    // mesh.position.set(-1, 1.5, -2.1);
    mesh.position.set(-1, 1.5, -1.5);
    /* mesh.rotation.order = 'YXZ';
    mesh.rotation.y = Math.PI; */
    /* const material = new THREE.MeshBasicMaterial({
      color: 0xFF0000,
    });
    const mesh = new THREE.Mesh(geometry, material); */
    return mesh;
  })();
  container.add(innerMesh);

  const tabMesh2 = (() => {
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      // wireframe: true,
    });
    const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.4)), material);
    mesh.position.set(0.5, 1.5, -1);
    mesh.rotation.y = -0.25*Math.PI;
    mesh.rotation.order = 'YXZ';

    const labelMesh = (() => {
      const geometry = new THREE.PlaneBufferGeometry(1, 0.2);
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024 * 0.2;
      // canvas.style.backgroundColor = 'red';
      const ctx = canvas.getContext('2d');
      ctx.font = '140px -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
      ctx.fillText('http://Babylon.js', 0, 150);
      // window.document.body.appendChild(canvas);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 0.7;
      return mesh;
    })();
    mesh.add(labelMesh);

    return mesh;
  })();
  container.add(tabMesh2);

  const assetsMesh = (() => {
    const object = new THREE.Object3D();

    [
      {size: new THREE.Vector2(3, 3), position: new THREE.Vector3(0, 1, -2), src: 'assets/Group 57@2x.png'},
      {size: new THREE.Vector2(5, 5), position: new THREE.Vector3(0, 1, -3), src: 'assets/Group 19@2x.png'},
      // {size: new THREE.Vector2(0.5, 0.5), position: new THREE.Vector3(0, 2, -1), src: 'assets/Group 17@2x.png'},
      // {size: new THREE.Vector2(0.5, 0.5), position: new THREE.Vector3(-0.5, 2, -1), src: 'assets/Group 31@2x.png'},
      // {size: new THREE.Vector2(0.5, 0.5), position: new THREE.Vector3(-0.5, 0.5, -1), src: 'assets/Group 31@2x.png'},
      // {size: new THREE.Vector2(0.5, 0.5), position: new THREE.Vector3(-1, 1.5, -1), src: 'assets/Group 17@2x.png'},
      // {size: new THREE.Vector2(1, 1), position: new THREE.Vector3(1, 2, -2.5), src: 'assets/Group 174@2x.png'},
      {size: new THREE.Vector2(1, 1), position: new THREE.Vector3(1, 2, -2.5), src: 'assets/Section 1@2x.png'},
    ].forEach(({size, position, src}) => {
      const geometry = new THREE.PlaneBufferGeometry(size.x, size.y);
      const texture = new THREE.Texture();
      new Promise((accept, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;
        img.onload = () => {
          accept(img);
        };
        img.onerror = err => {
          reject(err);
        };
      })
        .then(img => {
          texture.image = img;
          texture.needsUpdate = true;
        });
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      // mesh.castShadow = true;
      object.add(mesh);
    });

    return object;
  })();
  container.add(assetsMesh);

  meteorMesher = new THREE.Object3D();
  meteorMesher.nextUpdateTime = 0;
  meteorMesher.meteorMeshes = [];
  container.add(meteorMesher);

  scene.add(container);

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;

    container.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(-(mouse.x-0.5)*0.5, (mouse.y-0.5)*0.5, -1).normalize()
    );
    _updateSkin();
  });
  window.addEventListener('resize', e => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    _setCamera();
  });

  focused = true;
}

init();

const _makeExobotMesh = (() => {
  const geometry = new THREE.PlaneBufferGeometry(0.3, 0.3);
  const texture = new THREE.Texture();
  new Promise((accept, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = 'media/logo.png';
    img.onload = () => {
      accept(img);
    };
    img.onerror = err => {
      reject(err);
    };
  })
    .then(img => {
      texture.image = img;
      texture.needsUpdate = true;
    });
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.9,
  });
  return () => new THREE.Mesh(geometry, material);
})();
const _makeMeteorMaterial = src => {
  const texture = new THREE.Texture();
  new Promise((accept, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      accept(img);
    };
    img.onerror = err => {
      reject(err);
    };
  })
    .then(img => {
      texture.image = img;
      texture.needsUpdate = true;
    });
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    alphaTest: 0.5,
  });
  return material;
};
const METEORS = [
  {geometry: new THREE.PlaneBufferGeometry(0.6, 0.6), material: _makeMeteorMaterial('assets/Group 17@2x.png')},
  {geometry: new THREE.PlaneBufferGeometry(0.6, 0.6), material: _makeMeteorMaterial('assets/Group 31@2x.png')},
];
const _makeMeteorMesh = () => {
  const {geometry, material} = METEORS[Math.floor(Math.random() * METEORS.length)];

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(10 - 1, 10 + (Math.random()-0.5)*3, -1 + (Math.random()-0.5)*1);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3((Math.random()-0.5)*0.2, 1, 0).normalize()
  );
  const scale = 0.5 + Math.random();
  mesh.scale.set(scale, scale, scale);
  mesh.speed = 0.3 + Math.random()*0.3;
  // mesh.castShadow = true;

  return mesh;
};
let lastUpdateTime = Date.now();
let lastRattleTime = Date.now();
let lastRattleDirection = false;
function animate() {
  const now = Date.now();
  const timeDiff = now - lastUpdateTime;

  {
    const rattleTimeDiff = now - lastRattleTime;
    if (rattleTimeDiff > 40) {
      engineMesh.position
        .copy(engineMesh.basePosition)
        .add(localVector.set(
          0.004 * (lastRattleDirection ? 1 : -1),
          0,//Math.random() * 0.015,
          0//Math.random() * 0.01,
        ));
      lastRattleTime = now;
      lastRattleDirection = !lastRattleDirection;
    }
  }

  if (now > engineMesh.nextUpdateTime) {
    const exobotMesh = _makeExobotMesh();
    exobotMesh.quaternion.setFromUnitVectors(
      localVector.set(0, 1, 0),
      localVector2.set((Math.random()-0.5), 1, (Math.random()-0.5)*2).normalize()
    );
    const baseScale = 0.5 + Math.random();
    exobotMesh.baseScale = baseScale;
    exobotMesh.scale.set(baseScale, baseScale, baseScale);
    exobotMesh.startTime = now;
    exobotMesh.endTime = exobotMesh.startTime + 3000;
    engineMesh.add(exobotMesh);
    engineMesh.exobotMeshes.push(exobotMesh);

    engineMesh.nextUpdateTime = now + (0.2 + Math.random()*0.5)*1000;
  }
  engineMesh.exobotMeshes = engineMesh.exobotMeshes.filter(exobotMesh => {
    if (now < exobotMesh.endTime) {
      exobotMesh.position.add(localVector.set(
        0,
        0.0008 * timeDiff,
        0
      ).applyQuaternion(exobotMesh.quaternion));
      const scale = exobotMesh.baseScale * (1 - (now - exobotMesh.startTime) / (exobotMesh.endTime - exobotMesh.startTime));
      exobotMesh.scale.set(scale, scale, scale);
      return true;
    } else {
      engineMesh.remove(exobotMesh);
      return false;
    }
  });

  const timeBase = 2000;
  const factor = (now / timeBase) % timeBase;
  exobotMesh.position
    .copy(exobotMesh.basePosition)
    .add(localVector.set(0, Math.sin(factor * Math.PI*2)*0.1, 0))
    .add(localVector.set((mouse.x - 0.5)*2*2, -(mouse.y - 0.5)*2*2, 0));
  exobotMesh.rotation.z = Math.sin(factor * Math.PI*2/2)*0.2;

  if (now > meteorMesher.nextUpdateTime) {
    const meteorMesh = _makeMeteorMesh();
    meteorMesher.add(meteorMesh);
    meteorMesher.meteorMeshes.push(meteorMesh);

    meteorMesher.nextUpdateTime = now + 0.3*1000;
  }
  meteorMesher.meteorMeshes = meteorMesher.meteorMeshes.filter(meteorMesh => {
    meteorMesh.position.add(localVector.set(
      1,
      1,
      0
    ).multiplyScalar(-0.005 * timeDiff * meteorMesh.speed).applyQuaternion(meteorMesh.quaternion));
    if (meteorMesh.position.y > -1/2) {
      return true;
    } else {
      meteorMesher.remove(meteorMesh);
      return false;
    }
  });

  renderer.render(scene, camera);
  lastUpdateTime = now;
}

renderer.setAnimationLoop(animate);

window.addEventListener("scroll", e =>{
  if(window.scrollY > window.innerHeight){
    renderer.setAnimationLoop(null);
  }
  else{
    renderer.setAnimationLoop(animate);
  }
})

window.addEventListener("load", () =>{
  const featuresWrap = document.getElementById('featureMain-wrap');
  const gradient = featuresWrap.querySelector('.gradient');
  const rgba_JSON = [
    { // blue
      startFactor: 0/5,
      endFactor: 1/5,
      color1: "rgb(47, 134, 222)",
      color2: "rgb(142, 76, 170)",
    },
    { // purple
      startFactor: 1/5,
      endFactor: 2/5,
      color1: "rgb(142, 76, 170)",
      color2: "rgb(222, 122, 20)",
    },
    { //orange
      startFactor: 2/5,
      endFactor: 3/5,
      color1: "rgb(222, 122, 20)",
      color2: "rgb(240, 5, 5)",
    },
    { //bright green
      startFactor: 3/5,
      endFactor: 4/5,
      color1: "rgb(240, 5, 5)",
      color2: "rgb(142, 76, 170)",
    }, 
    { //bright green
      startFactor: 4/5,
      endFactor: 5/5,
      color1: "rgb(142, 76, 170)",
      color2: "#2196f3",
    },
  ];

  const _tick = () =>{
    const bodyBox = document.body.getBoundingClientRect();
    const parentBox = featuresWrap.getBoundingClientRect();
    const parentBoxAbs = {
      top: parentBox.top - bodyBox.top,
      height: parentBox.height,
    };
    const parentFactor = Math.min(Math.max((window.pageYOffset - parentBoxAbs.top) / (parentBoxAbs.height - window.innerHeight), 0), 1);

    if (parentFactor > 0) {
      if (parentFactor < 1) {
        for (let i = 0; i < rgba_JSON.length-1; i++) {
          const j = rgba_JSON[i];
          const j2 = rgba_JSON[i+1];

          if (parentFactor >= j.startFactor && parentFactor <= j.endFactor) {
            const lerpFactor = (parentFactor - j.startFactor) / (j.endFactor - j.startFactor);
            const topColor = new THREE.Color(j.color1).lerp(new THREE.Color(j.color2), lerpFactor).getHexString();
            const bottomColor = new THREE.Color(j2.color1).lerp(new THREE.Color(j2.color2), lerpFactor).getHexString();

            gradient.style.background = `linear-gradient(to bottom, #${topColor} 0%, #${bottomColor} 100%)`;
            break;
          }
        }
        gradient.style.position = 'fixed';
        gradient.style.top = 0;
        gradient.style.bottom = '';
      } else {
        gradient.style.position = 'absolute';
        gradient.style.top = '';
        gradient.style.bottom = 0;
        gradient.style.background = `linear-gradient(${rgba_JSON[rgba_JSON.length-1].color1} 0%, ${rgba_JSON[rgba_JSON.length-1].color2} 100%)`;
      }
    } else {
      gradient.style.position = 'absolute';
      gradient.style.top = 0;
      gradient.style.bottom = '';
      gradient.style.background = `linear-gradient(to bottom, #2f86de 0%, #8e4caa 100%)`;
    }
  };
  _tick();
  window.addEventListener("scroll", _tick);
});

})();
