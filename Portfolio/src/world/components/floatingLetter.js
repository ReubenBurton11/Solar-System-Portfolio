import { Loader, Mesh, MeshPhongMaterial, Object3D, Vector3} from "three";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import HelvetikerFont from "three/examples/fonts/helvetiker_bold.typeface.json";

class Letter extends Object3D{
    constructor(char, font, size, depth, color){
        super();

        this.name = "Letter: " + char;

        const geo = new TextGeometry(char, {
                font: font,
                size: size,
                depth: depth,
            });
        
        geo.computeBoundingBox();
        const mat = new MeshPhongMaterial({color:color});
        const mesh = new Mesh(geo, mat);
        this.add(mesh);

        this.width = geo.boundingBox.max.x;
    }
}

class FloatingLetter extends Object3D{
    constructor(props){
        super();

        this.name = props.name;

        const loader = new FontLoader();
        const font = loader.parse(HelvetikerFont);

        const text = props.text ? props.text : "A";

        this.letters = [];

        let spacing = 0;

        if (props.alignment == "right"){
            for (let i = 0; i < text.length; i++){
                if (text[i] == " "){
                spacing += props.size * props.spacing;
                continue;
                }

                const geo = new TextGeometry(text[i], {
                    font: font,
                    size: props.size ? props.size : 1,
                    depth: props.depth ? props.depth : 1,
                });
        
                geo.computeBoundingBox();
                spacing += geo.boundingBox.max.x * props.spacing;

                geo.dispose();
            }

            spacing = -spacing;
        }

        if (props.alignment == "centre" || props.alignment == "center"){
            for (let i = 0; i < text.length; i++){
                if (text[i] == " "){
                spacing += props.size * props.spacing;
                continue;
                }

                const geo = new TextGeometry(text[i], {
                    font: font,
                    size: props.size ? props.size : 1,
                    depth: props.depth ? props.depth : 1,
                });
        
                geo.computeBoundingBox();
                spacing += geo.boundingBox.max.x * props.spacing;

                geo.dispose();
            }

            spacing = -(spacing / 2);
        }

        for (let i = 0; i < text.length; i++){
            if (text[i] == " "){
                spacing += props.size * props.spacing;
                continue;
            }

            const letter = new Letter(text[i],
                font, 
                props.size ? props.size : 1, 
                props.depth ? props.depth : 1,
                props.color ? 
                (props.color === Array ? props.color : 
                    (props.color.length > i ? props.color[i] : 
                        props.color[i - (props.color.length * Math.floor(i / props.color.length))])) 
                        : "white"
            );

            this.add(letter);
            this.letters.push(letter);

            letter.position.set(...new Vector3(spacing, 0, 0));
            spacing += letter.width * props.spacing;
        };

        this.position.set(...(props.position ? props.position : new Vector3(0, 0, 0)));
    }
}

export {FloatingLetter};