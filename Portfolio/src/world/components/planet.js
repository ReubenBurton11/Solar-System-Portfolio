import { MeshPhongMaterial, Object3D, SphereGeometry, Mesh, Vector3 } from "three";
import PlanetPanel from "@/components/PlanetPanel.vue";
import { createApp } from "vue";

let panelDiv;

class Planet extends Object3D{
    constructor(props){
        super();

        this.name = props.name ? props.name : "Title";
        this.description = props.description ? props.description : "Description";
        this.link = props.link ? props.link : "https://www.heinz.com/en-GB";

        this.tag = "Planet";
        this.panel = null;

        const geo = new SphereGeometry(props.radius ? props.radius : 10);
        const mat = new MeshPhongMaterial({color: props.color ? props.color : "teal"});
        const mesh = new Mesh(geo, mat);
        this.add(mesh);

        mesh.position.set(0,0,0).add(props.position ? props.position : new Vector3(0, 0, 0));
    }

    AddPlanetPanel(){
        panelDiv = document.createElement('div');
        panelDiv.id = "panelDiv";
        document.getElementById('sceneDiv').appendChild(panelDiv);
        const props = {
            title: this.name,
            desc: this.description,
            link: this.link,
        };
        this.panel = createApp(PlanetPanel, props).mount("#panelDiv");
        this.panel.$slots.default = [];
    }

    RemovePlanetPanel(){
        document.getElementById('sceneDiv').removeChild(panelDiv);
        this.panel = null;
    }
}

export {Planet};