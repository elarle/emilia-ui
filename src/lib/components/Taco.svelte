<!-- This file cannot be copied, modified, redistributed or any action without explicit permission. This overrides all licenses of this repo. Licenses from dependencies still apply -->

<script>

   let {
      value = $bindable(0),
      min_value = 0,
      warning_value = 15,
      range = 300,
      steps = 15,

      initial_degree = 120,
      degree_range = 300,
      unit = "Km/h",

      arrow_length = 90,

   } = $props();


   let arrow_angle = $derived(initial_degree + ((value-min_value)/(range))*degree_range);

</script>

<div class="flex-shrink-0 w-64 aspect-square bg-neutral-600 rounded-full border-neutral-700 p-2">
   <div class="w-full h-full bg-neutral-800 rounded-full relative">
      <!-- Puntero -->
      <div style={`rotate: ${arrow_angle}deg;`} class="absolute w-full h-full flex items-center z-20">
         <div class="w-full h-1 rounded-xl flex">

            <div class="w-1/2 h-full flex-1"></div>

            <div class="w-1/2 h-full flex-1">
               <div style={`width: ${arrow_length}%`} class={`h-full relative rounded-xl ${value+min_value > warning_value ? "warning bg-red-500" : "light bg-yellow-500"}`}>
                  <div class="w-2 h-2 aspect-square bg-red-500 rounded-xl -translate-x-1/2 -translate-y-1/4"></div>
               </div>
            </div>

         </div>
      </div>

      <!-- Valor -->
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 text-white bg-neutral-600 border-neutral-700 border-2 text-center w-16">
         <p>{value}</p>
      </div>

      <!-- Unidades -->
      <div class="absolute top-3/5 left-1/2 -translate-x-1/2 text-white">
         <p>{unit}</p>
      </div>

      <!-- Padding of numbers -->
      <div class="w-full h-full p-6">
         <div class="relative w-full h-full">

            {#each Array(steps) as _, i}
               <p style={`
                  top: ${(Math.sin(((2*Math.PI*(degree_range/(steps-1))*i)/360)+(initial_degree/360*2*Math.PI))+1)*50}%;
                  left: ${(Math.cos(((2*Math.PI*(degree_range/(steps-1))*i)/360)+(initial_degree/360*2*Math.PI))+1)*50}%;
                  `} class="text-white num_light absolute w-8 h-8 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">{Math.trunc(i*(range/(steps-1))+min_value)}</p>
            {/each}

         </div>
      </div>

      <!-- Flechitas -->

      <!-- <div class="absolute top-0 w-full h-full p-0">
         <div class="relative w-full h-full">
            {#each Array(steps*5) as _, i}
               <p style={`

               top: ${(Math.sin(((2*Math.PI*(degree_range/(steps*5))*i)/360)+initial_degree)+1)*50}%;
               left: ${(Math.cos(((2*Math.PI*(degree_range/(steps*5))*i)/360)+initial_degree)+1)*50}%;

               transform-origin: left;
               transform: ;
               transform: rotateZ(${((360/(steps*5))*i+(((initial_degreee))))}deg) translateY(-50%) translateX(-50%);

               `} class="text-white num_light absolute w-px h-4 bg-white flex items-center justify-center"></p>
            {/each}
         </div>
      </div> -->

   </div>
</div>

<style>
   * {
      transition:all 0.9s;
      transition-timing-function: cubic-bezier(0.460, 1.365, 0.720, 0.945);
   }

   .light{
      box-shadow: 5px 0px 16px 2px rgba(255, 255, 0, 0.336);
   }

   .num_light{
      text-shadow: 0px 0px 16px white;
   }

   .warning{
      box-shadow: 5px 0px 16px 2px rgba(255, 102, 0, 0.336);
   }

</style>
