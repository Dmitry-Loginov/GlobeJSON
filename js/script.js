	// импорт библиотек
    import { OrbitControls } from "./OrbitControls.js";
    //массив объектов
    var obj = [];

    //настраиваем сцену, камеру, визуализатор, освещение
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth /window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    const color = 0xffffff;
    var lightBack = new THREE.AmbientLight(color);
    lightBack.position.set(-1, 2, 10);
    scene.add(lightBack);
     
      
    //создание земли
    const geometry = new THREE.SphereGeometry(20, 50, 50);
    const loader = new THREE.TextureLoader();
    const colorSpec = new THREE.Color(0.8, 0.7, 0.7);
    const material = new THREE.MeshPhongMaterial({
        bumpMap: loader.load("../images/earthbump1k.jpg"),
        map: loader.load('../images/earthmap1k.jpg'),
        bumpScale : 3.5,
        specularMap : loader.load("../images/earthspec1k.jpg"),
        specular : colorSpec,
    });
    const sphere = new THREE.Mesh( geometry, material );

    //коробка земли
    const earthOrbit = new THREE.Object3D();

    //коробка флагов
    const labelsOrbit = new THREE.Object3D();

    //флаг
    const labelGeometry = new THREE.PlaneGeometry(1, 1);
    const labelMaterial = new THREE.MeshLambertMaterial({color : 'red'});
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    labelMesh.material.side = THREE.DoubleSide;

    labelMesh.position.y = 20.5;//green
    labelMesh.position.z = 0;//blue
    labelMesh.position.x = 0;//red

    //заполняем массив объектов
    obj.push(sphere);
    obj.push(labelMesh);
    scene.add(earthOrbit);
    earthOrbit.add(sphere);
    labelsOrbit.add(labelMesh);
    earthOrbit.add(labelsOrbit);

    //добавляем напрввленный источника света
    var light = new THREE.DirectionalLight( 0xcccccc, 0.5);
    light.position.set(-3, 10, 0);
    scene.add(light);

    //распознаватель наведения мыши
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // создание звезд
    var geometryBackground  = new THREE.SphereGeometry(90, 32, 32);
   
    var materialBackground  = new THREE.MeshBasicMaterial();
    materialBackground.map   = THREE.ImageUtils.loadTexture('../images/galaxy_starfield.png');
    materialBackground.side  = THREE.BackSide;
    
    var Background  = new THREE.Mesh(geometryBackground, materialBackground);
    scene.add(Background);

    //возможность вращения
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.11;
    controls.enableZoom = false;

    //настраиваем камеру и вращение
    camera.position.set( 20, 40, 45 );
    controls.update();
    
    //добавляем помощников осей
    obj.forEach((node) => {
        const axes = new THREE.AxesHelper(5);
        axes.material.depthTest = false;
        axes.renderOrder = 1;
        node.add(axes);
    })

    //рендерим
    document.body.appendChild( renderer.domElement );

    function render() {

        raycaster.setFromCamera( mouse, camera );
    
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

    //для отображения наведения мыши
    function onMouseMove( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        render();
    }

    //анимация вращения мыши
    window.addEventListener( 'mousemove', onMouseMove, false );
    const animate = function () {
        requestAnimationFrame( animate );
        // sphere.rotation.y += 0.003;
        controls.update();
        renderer.render( scene, camera );

        //метка следит за камерой
        var vector = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( camera.quaternion ).add( camera.position );
        labelMesh.lookAt(vector);

        onMouseMove();
        
    };
    
    //итоговая анимация
    animate();
    window.requestAnimationFrame(render);