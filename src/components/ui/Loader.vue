<template>
  <div class="poke_container">
    <div class="pokeball ball">
      <div class="pokeball_part_bottom"></div>
      <div class="pokeball_shadow ball"></div>
      <div class="belt"></div>
      <div class="belt_loop"></div>
      <div class="belt_bg"></div>
      <div class="belt_loop_inside"></div>
      <div class="belt_loop_button"></div>
      <div class="pokeball_light"></div>
    </div>
    <div class="pokeball_ground_shadow ball"></div>
  </div>
</template>
<style scoped>
:root {
  --color-bottom: #ddd;
  --color-belt: #444;
}

body {
  background: #ccc;
  margin: 0;
  height: 100vh;
}

.ball {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.poke_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: inherit;
}

.pokeball {
  position: relative;
  background: #f03e33;
  border: 2px solid black;
  overflow: hidden;
  animation: moveLat 2s ease-in-out infinite alternate-reverse;
  z-index: 1;
}

.pokeball_ground_shadow {
  width: 60px;
  height: 5px;
  margin-left: 60px;
  margin-top: -3px;
  background: rgba(0, 0, 0, 0.5);
  animation: moveLat 2s ease-in-out infinite alternate-reverse;
  z-index: 0;
  filter: blur(2px);
}

.pokeball_part_bottom {
  position: absolute;
  bottom: 0;
  width: 60px;
  height: 26px;
  background: var(--color-bottom);
  animation: rotateBottom 2s ease-in-out infinite alternate-reverse;
}

.belt {
  position: absolute;
  box-sizing: border-box;
  height: 8px;
  width: 100%;
  background: var(--color-belt);
  bottom: calc(50% - 4px);
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  animation: rotate 2s ease-in-out infinite alternate-reverse;
}

.belt_loop {
  position: absolute;
  box-sizing: border-box;
  height: 22px;
  width: 22px;
  top: calc(50% - 11px);
  left: calc(50% - 11px);
  background: var(--color-belt);
  border-radius: 50%;
  border: 2px solid black;
}

.belt_bg {
  position: absolute;
  height: 4px;
  width: 100%;
  background: var(--color-belt);
  bottom: calc(50% - 2px);
  animation: rotate 2s ease-in-out infinite alternate-reverse;
}

.belt_loop_inside {
  position: absolute;
  height: 14px;
  width: 14px;
  top: calc(50% - 7px);
  left: calc(50% - 7px);
  box-sizing: border-box;
  border: 2px solid black;
  border-radius: 50%;
  background: var(--color-bottom);
}

.belt_loop_button {
  position: absolute;
  box-sizing: border-box;
  height: 6px;
  width: 6px;
  top: calc(50% - 3px);
  left: calc(50% - 3px);
  background: var(--color-bottom);
  border-radius: 50%;
  border: 1px solid black;
}

.pokeball_shadow {
  position: absolute;
  left: -15%;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.pokeball_light {
  position: absolute;
  width: 10px;
  height: 20px;
  left: 7px;
  top: 3px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.3);
  transform: skew(-35deg, 2deg) rotate(10deg);
}

@keyframes moveLat {
  0% {
    transform: translateX(0);
  }

  30% {
    transform: translateX(15px);
  }

  50% {
    transform: translateX(0);
  }

  70% {
    transform: translateX(15px);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  30% {
    transform: rotate(20deg);
  }

  50% {
    transform: rotate(0);
  }

  70% {
    transform: rotate(20deg);
  }

  100% {
    transform: rotate(0);
  }
}

@keyframes rotateBottom {
  0% {
    transform: rotate(0);
  }

  30% {
    transform: rotate(20deg) skew(30deg, 0deg) scale(1.2);
  }

  50% {
    transform: rotate(0);
  }

  70% {
    transform: rotate(20deg) skew(30deg, 0deg) scale(1.2);
  }

  100% {
    transform: rotate(0);
  }
}
</style>
