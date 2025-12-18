import {createApp} from "vue";

let UIDiv;

function AddUI(element, props){
    RemoveUI();
    UIDiv = document.createElement('div');
    UIDiv.id = "UIDiv";
    document.getElementById("sceneDiv").appendChild(UIDiv);
    return createApp(element, props).mount("#UIDiv");
}

function RemoveUI(){
    if (document.getElementById("UIDiv")){
        document.getElementById("UIDiv").remove();
    }
}

export {AddUI, RemoveUI};