import * as THREE from 'three'
import Experience from '../Experience';
import { EventEmitter } from "events";

import Environment from '../Scene/Environement';
import ShaderMaterials from '../Sketches/ShaderMaterials';
import Objects from './Objects';


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

            // Floor

            

            // Sphere Object
            this.shaderClass = new ShaderMaterials();
            this.shaderMaterial = this.shaderClass.createOrganicMaterial();
            
            const geometry = new THREE.IcosahedronGeometry(1, 300);

            this.sphere = new Objects();
            this.sphere.addMeshObject(
                geometry,
                this.shaderMaterial
            )

            this.sphere.addObjectDebug('sphere')
            this.sphere.object.position.set(0, 0, 0);
            
     
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
        if(this.shaderMaterial) this.shaderClass.update()
    }
}