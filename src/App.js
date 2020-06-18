import React, { Component } from 'react';
import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

var mixer;
var action;
var COUNTER = 0;
var clock = new THREE.Clock();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

class App extends Component {
  constructor(props) {
    super(props);
    this.animateRef = React.createRef()
    this.state = {
      counter: -1
    }

  }
  componentDidMount = () => {


    var action;
    // camera.position.z = 5;

    //PLANE
    var geometry = new THREE.PlaneGeometry(4, 4, 4);
    var material = new THREE.MeshPhongMaterial({ color: 'rgba(255, 255, 255, 0)', side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = - Math.PI / 2;
    plane.position.set(0, -1, 0);   //make all zero to remove this plane from canvas
    scene.add(plane);

    //LIGHT
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    var light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(0, 2, 4);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);
    camera.position.z = 5;
    camera.position.set(0, 0, 3);     // object position zoom on Z axis


    renderer.setSize(window.innerWidth / 1.2, window.innerHeight / 1.2);
    this.animateRef.current.appendChild(renderer.domElement);
    renderer.setClearColor('lightblue');

    // orbit 3d env
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    // GLTF loader 
    this.load()

  }
  load = () => {
    var loader = new GLTFLoader();

    loader.load('models/tern_construct_animation.gltf', (gltf) => {

      // Taking animations from  gltf

      mixer = new THREE.AnimationMixer(gltf.scene);


      //-- Playing all animations of gltf 

      // gltf.animations.forEach((clip) => {
      //   mixer
      //     .clipAction(clip)
      //     .play();
      // });


      var animate = () => {

        requestAnimationFrame(animate);


        var delta = clock.getDelta();
        if (mixer !== null) {
          mixer.update(delta);
        };
        renderer.render(scene, camera);
      };

      animate();

      let counter = this.state.counter;
      console.log(counter)


      renderAnimation(gltf, counter);

      scene.add(gltf.scene);
      action.setLoop(THREE.LoopOnce);
      gltf.scene.position.set(0, 0.6, 0);



      function renderAnimation(gltf, counter) {

        action = mixer.clipAction(gltf.animations[counter]);   //getting single animation
        action.play();
      };



    });

  }

  // ---------------------------outside compodidmount




  animateNext = () => {
    let counter = this.state.counter + 1;
    this.setState({ counter: counter })
    this.componentDidMount()

  }


  render() {

    return (<div >

      <div ref={this.animateRef}></div>
      <button className="NextButton button " onClick={this.animateNext}>Next Animation</button>

    </div>);
  }
}

export default App;
