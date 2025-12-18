<template>
    <div id="controls">
    <div id="W" class="panel">W</div>
    <div id="A" class="panel">A</div>
    <div id="S" class="panel">S</div>
    <div id="D" class="panel">D</div>
    <div id="Shift" class="panel">Shift</div>
    </div>
</template>

<script setup>
    const props = defineProps({

    });
</script>

<style scoped>
    .panel{
        position:absolute;
        width: 20%;
        height: 20%;
        text-align: center;
        align-content: center;
    }
    #controls{
        position:fixed;
        left: 5vw;
        top: 70vh;
        height: 20vw;
        width: 20vw;
    }
    #W{
        left: 60%;
        top: 0;
    }
    #A{
        left: 40%;
        top: 20%;
    }
    #S{
        left:60%;
        top: 20%;
    }
    #D{
        left:80%;
        top: 20%;
    }
    #Shift{
        left: 0;
        top: 20%;
        width: 30%
    }
</style>