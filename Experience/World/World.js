import * as THREE from 'three'
import Experience from '../Experience';
import { EventEmitter } from "events";

import Environment from '../Scene/Environement';
import ShaderMaterials from '../Sketches/ShaderMaterials';
import Objects from './Objects';
import VisualizerAudio from '../Sketches/VisualizerAudio.js';

export default class World extends EventEmitter {
    constructor() {
        super();

        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;
        
        // Start world (on ressource ready)
        this.resources.on("ready", ()=> {
            this.environment = new Environment();


            /* ---------------------------------------------------------
                                Organic Object
             ---------------------------------------------------------*/
            /*
            this.shaderClass = new ShaderMaterials();
            this.organicMaterial = this.shaderClass.createOrganicMaterial();
            const geometry = new THREE.SphereGeometry(1, 1000, 1000);

            this.sphere = new Objects();
            this.sphere.addMeshObject(
                geometry,
                this.organicMaterial
            ) 

            this.sphere.addObjectDebug('sphere')*/

            /* ---------------------------------------------------------
                                Audio Object
             ---------------------------------------------------------*/                         
            /*
            this.shaderClass = new ShaderMaterials();
            this.sphereGeo =  new THREE.SphereGeometry(1, 100, 100);
            this.audioMaterial = this.shaderClass.createAudioMaterial();
            
            this.audioBall = new Objects();
            this.audioBall.addMeshObject(
                this.sphereGeo,
                this.audioMaterial
            )  

            // Wire Lines
            this.shaderClass.addWireLines(this.sphereGeo, this.audioMaterial, this.audioBall.object)

            // Glitch effect
            this.shaderClass.createGlitchEffect();
    

            // Audio part
            this.VisualizerAudio = new VisualizerAudio(this.audioBall.object, 'uAudioFrequency');
            this.VisualizerAudio.load()       
            this.experience.page.on('play', () => this.VisualizerAudio.sound.play())
            this.experience.page.on('pause', () => this.VisualizerAudio.sound.pause())
            */

            /* ---------------------------------------------------------
                                Displex Object
             ---------------------------------------------------------*/ 
            this.shaderClass = new ShaderMaterials();
            this.torusGeo = new THREE.TorusGeometry(1, 0.3, 100, 100)
            this.displexMaterial = this.shaderClass.createDisplexMaterial()
            
            this.displexTorus = new Objects();
            this.displexTorus.addMeshObject(
                this.torusGeo,
                this.displexMaterial
            )
            
            this.shaderClass.createBloomPassEffect();

     
            this.emit("worldready");
        }); 
        
    }

    /**
     * 
     * @param {number} geometryX 
     * @param {number} geometryZ 
     * @param {*} color 
     */
    setFloor(geometryX, geometryZ, color) {
        const geometry = new THREE.PlaneGeometry(geometryX, geometryZ);
        const material = new THREE.MeshStandardMaterial( {color: color, side: THREE.DoubleSide} );
        this.plane = new THREE.Mesh( geometry, material );
        this.plane.receiveShadow = true;
        this.plane.castShadow = false;
    
        this.plane.rotateX(Math.PI / 180 * 90);
        this.scene.add( this.plane );

        // Position
        if(this.debug.active) {
            this.debugFloor = this.debug.debugFolderObject.addFolder(`floor`)
    
            this.debugFloor.add(this.plane.position, 'x').min(- 25).max(50).step(.1).name('object-X').listen();
            this.debugFloor.add(this.plane.position, 'y').min(- 25).max(50).step(.1).name('object-Y').listen();
            this.debugFloor.add(this.plane.position, 'z').min(- 25).max(50).step(.1).name('object-Z').listen();
        }
    }

    //RESIZE
    resize() {
    }

    //UPDATE
    update() {
        if(this.shaderClass) this.shaderClass.update();
        if(this.VisualizerAudio) this.VisualizerAudio.update();

        if(this.shaderClass && this.shaderClass.softGlitch && this.VisualizerAudio) {
            const frequence = this.VisualizerAudio.update();
            
            this.shaderClass.softGlitch.factor = frequence > 0.6 ? 0.9 : 0.2;
        } 
    }
}