import { MeshPhongMaterial, Object3D, SphereGeometry, Mesh, Vector3 } from "three";
import PlanetPanel from "@/components/PlanetPanel.vue";
import HoverPanel from "@/components/HoverPanel.vue";
import { createApp } from "vue";
import { AddUI, RemoveUI } from "../systems/ui";

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

    AddHoverPanel(){
        if (this.panel){
            RemoveUI();
        }
        const props = {
            title: this.name,
        }
        this.panel = AddUI(HoverPanel, props);
    }

    RemoveHoverPanel(){
        if (this.panel){
            RemoveUI();
        }
        this.panel = null;
    }

    AddPlanetPanel(){
        if (this.panel){
            RemoveUI();
        }
        const props = {
            title: this.name,
            desc: this.description,
            link: this.link,
        };
        this.panel = AddUI(PlanetPanel, props);
    }

    RemovePlanetPanel(){
        if (this.panel){
            RemoveUI();
        }
        this.panel = null;
    }
}

export {Planet};