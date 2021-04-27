	// Our Javascript will go here.
    import { OrbitControls } from "./OrbitControls.js";
    var obj = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth /window.innerHeight, 0.1, 1000 );
    camera.position.z = 1.5;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    const color = 0xffffff;
    var lightBack = new THREE.AmbientLight(color);
    lightBack.position.set(-1, 2, 10);
    scene.add(lightBack);

    var light = new THREE.DirectionalLight( 0xcccccc, 0.5);
    light.position.set(-3, 10, 0);
    scene.add(light);

    const geometry = new THREE.SphereGeometry(20, 50, 50);
    THREE.crossOrigin = "grey";
    const loader = new THREE.TextureLoader();
    const colorSpec = new THREE.Color('grey');
    const material = new THREE.MeshPhongMaterial({
        bumpMap: loader.load("../images/earthbump1k.jpg"),
        map: loader.load('../images/earthmap1k.jpg'),
        bumpScale : 3.5,
        specularMap : loader.load("../images/earthspec1k.jpg"),
        specular : colorSpec,
    });
    const sphere = new THREE.Mesh( geometry, material );

    
    const earthOrbit = new THREE.Object3D();
    const labelsOrbit = new THREE.Object3D();

    const labelGeometry = new THREE.SphereGeometry(0.5, 25, 25);
    const labelMaterial = new THREE.MeshLambertMaterial({color : 'red'});
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

    labelMesh.position.y = 15;
    labelMesh.position.z = 15;
    labelMesh.position.x = -5;

    obj.push(sphere);
    obj.push(labelMesh);

    scene.add(earthOrbit);
    earthOrbit.add(sphere);
    labelsOrbit.add(labelMesh);
    earthOrbit.add(labelsOrbit);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // create the geometry sphere
    var geometryBackground  = new THREE.SphereGeometry(90, 32, 32);
    // create the material, using a texture of startfield
    var materialBackground  = new THREE.MeshBasicMaterial();
    materialBackground.map   = THREE.ImageUtils.loadTexture('../images/galaxy_starfield.png');
    materialBackground.side  = THREE.BackSide;
    // create the mesh based on geometry and material
    var Background  = new THREE.Mesh(geometryBackground, materialBackground);
    scene.add(Background);

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.11;
    controls.enableZoom = false;

    camera.position.set( 5, 5, 50 );
    camera.position.z = 60;
    controls.update();
    
    obj.forEach((node) => {
        const axes = new THREE.AxesHelper(5);
        axes.material.depthTest = false;
        axes.renderOrder = 1;
        axes
        node.add(axes);
    })

    document.body.appendChild( renderer.domElement );

    function render() {

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, camera );
    
        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects( labelsOrbit.children );
        
        for ( let i = 0; i < labelsOrbit.children.length; i ++ ) {
            if(labelsOrbit.children[i].material.color != 'green')
            labelsOrbit.children[i].material.color.set( 'red' );
    
        }
        for ( let i = 0; i < intersects.length; i ++ ) {
    
            intersects[i].object.material.color.set( 'green' );
    
        }
        renderer.render( scene, camera );
    }

    function onMouseMove( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        render();
    }

    window.addEventListener( 'mousemove', onMouseMove, false );
    const animate = function () {
        requestAnimationFrame( animate );
       // sphere.rotation.y += 0.001;
        controls.update();
        renderer.render( scene, camera );
        onMouseMove();
    };
    
    animate();
    window.requestAnimationFrame(render);