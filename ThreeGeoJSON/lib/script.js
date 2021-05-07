import * as THREE from "./three.module.js"
import { OrbitControls } from "./OrbitControls.js";
import { drawThreeGeo } from "./threeGeoJSON.js";
            //New scene and camera
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
            
            //New Renderer
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            var planet = new THREE.Object3D();
  
            //Create a sphere to make visualization easier.
            const loader = new THREE.TextureLoader();
            var geometry = new THREE.SphereGeometry(30, 45, 45);
            var material = new THREE.MeshPhongMaterial({
                map:         loader.load("images/earthmap1k.jpg"),
                bumpMap:     loader.load('images/earthbump1k.jpg'),
                bumpScale:   3.5,
                specularMap: loader.load('images/earthspec1k.jpg'),
                specular:    new THREE.Color('grey'),
            });
            var sphere = new THREE.Mesh(geometry, material);
            sphere.rotation.x += 1.58;
            planet.add(sphere);

            scene.add(planet);
            var light = new THREE.DirectionalLight( 0xcccccc, 0.5);
            light.position.set(10, 20, 10);
            scene.add(light);

            const color = 0xffffff;
            var lightBack = new THREE.AmbientLight(color);
            lightBack.position.set(-2, 2, 10);
            scene.add(lightBack);

            $.getJSON("test_geojson/univesrity.json", function(data) {
                drawThreeGeo(data, 30.3, 'sphere', {color: 'red'}, planet);
            });
            //Set the camera position
            camera.position.z = 8;
            camera.position.y = 19;
            camera.position.x = 59;

            planet.rotation.x += -1.55;
            planet.rotation.z += -0.4;

            //анимация вращения мыши
            //Render the image

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            const controls = new OrbitControls( camera, renderer.domElement );
            controls.enableDamping = true;
            controls.dampingFactor = 0.11;
            controls.enableZoom = false;
            controls.update();
            function render() {
                // raycaster.setFromCamera( mouse, camera );

                // const intersects = raycaster.intersectObjects( planet.children );
                
                // for ( let i = 0; i < planet.children.length; i ++ ) {
                //     if(planet.children[i].material.color != 'green')
                //     planet.children[i].material.color.set( 'red' );
                // }

                // for ( let i = 0; i < intersects.length; i ++ ) {
                //     intersects[i].object.material.color.set( 'green' );
                // }

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
            // sphere.rotation.y += 0.003;
            controls.update();
            renderer.render( scene, camera );

            onMouseMove();
            };
            
            animate();
            window.requestAnimationFrame(render);