import {createApp} from "vue";

let UIDiv;

function AddUI(element, props = {}, slot = null){
    RemoveUI();
    UIDiv = document.createElement('div');
    UIDiv.id = "UIDiv";
    document.getElementById("sceneDiv").appendChild(UIDiv);
    const UI = createApp(element, props).mount("#UIDiv");
    if (slot){
        if (document.getElementById("slot")){
            document.getElementById("slot").innerHTML = slot;
        }
    }
    return UI;
}

function RemoveUI(){
    if (document.getElementById("UIDiv")){
        document.getElementById("UIDiv").remove();
    }
}

function AddPermanentUI(element){
    const UIElement = document.createElement('div');
    UIElement.id = "UI";
    document.getElementById("sceneDiv").appendChild(UIElement);
    const UI = createApp(element).mount("#UI");
    return UI;
}

export {AddUI, RemoveUI, AddPermanentUI};