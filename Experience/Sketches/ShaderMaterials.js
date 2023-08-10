import * as THREE from 'three'
import Experience from '../Experience';


import vertexPars from '../shader/organicSplitShaders/vertex_pars.glsl'
import vertexMain from '../shader/organicSplitShaders/vertex_main.glsl'
import fragmentPars from '../shader/organicSplitShaders/fragment_pars.glsl'
import fragmentMain from '../shader/organicSplitShaders/fragment_main.glsl'

import vertexOrganic from '../shader/vertexOrganic.glsl'
import fragmentOrganic from '../shader/fragmentOrganic.glsl'

export default class ShaderMaterials {
    constructor() {
        this.experience = new Experience();
        this.time = this.experience.time.animatedTime;

        
    }

    createSimpleMaterial() {
        this.simpleMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexOrganic,
            fragmentShader: fragmentOrganic
        })

        this.simpleMaterial.uniforms.uTime = { value: 0 }

        return this.simpleMaterial;
    }

    createOrganicMaterial() {

        this.orgaMaterial = new THREE.MeshStandardMaterial({
            onBeforeCompile: (shader) => {
              // storing a reference to the shader object
              this.orgaMaterial.userData.shader = shader

              
        
              //uniforms
              shader.uniforms.uTime = {value: 0}
        
              const parseVertexString = /* glsl */`#include <displacementmap_pars_vertex>`;
              shader.vertexShader = shader.vertexShader.replace(parseVertexString, parseVertexString + /* glsl */`
              ` + vertexPars)
              
              const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`
              shader.vertexShader = shader.vertexShader.replace(mainVertexString, mainVertexString + /* glsl */`
              ` + vertexMain)
        
              const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`
              shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString, mainFragmentString + /* glsl */`
              ` + fragmentMain)
        
              const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`
              shader.fragmentShader = shader.fragmentShader.replace(parsFragmentString, parsFragmentString + /* glsl */`
              ` + fragmentPars)
        
            }
        });

        return this.orgaMaterial;
    }

    //RESIZE
    resize() {
    }

    //UPDATE
    update() {
        this.time = this.experience.time.animatedTime;
        if(this.orgaMaterial) this.orgaMaterial.userData.shader.uniforms.uTime.value = this.time * .04;
        if(this.simpleMaterial) this.simpleMaterial.uniforms.uTime.value = this.time;
    }
}