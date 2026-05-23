<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <title>Planetegem PlanetGen</title>
  <meta name="description"
    content="Generate (fake) 3D terrain: you will feel like Snake Plissken approaching New York!">
  <meta name="robots" content="index, follow">

  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/customizer.css">
  <link rel="stylesheet" href="css/logo.css">
  <link rel="stylesheet" href="css/tooltip.css">
  <link rel="stylesheet" href="css/dialog.css">
  <link rel="stylesheet" href="css/confirm-button.css">
  <link rel="stylesheet" href="css/slider.css">
  <link rel="stylesheet" href="css/slider-group.css">
  <link rel="stylesheet" href="css/main.css">

</head>

<body class="opened centered">
  <dialog id="intro-dialog">
    <main>
      <button id="close-intro" class="icon-button">
        <?= file_get_contents(filename: 'resources/close_icon.svg') ?>
      </button>
      <figure class="logo">
        <img src="resources/planet_gen_icon.svg">
        <h1>
          <small>Planetegem</small>
          <br>
          PlanetGen
        </h1>
      </figure>
      <p>
        Welcome to Planetegem PlanetGen, your custom 3D terrain generator!
        Use the sliders in the customization panel to manipulate generation values.
        Ticking the play button in the top left will set you moving through the terrain.
      </p>
      <p>
        Want to see how it works? Have a look at the <a href="https://github.com/planetegem/PlanetGen"
          target="_blank">Github repository</a>.
      </p>
      <form method="dialog">
        <button class="confirm-button">
          <?= file_get_contents(filename: 'resources/triangle.svg') ?>
          <span>Start fiddling</span>
        </button>
      </form>
    </main>
  </dialog>
  <nav class="interaction-bar">
    <button id="animation-toggle" class="icon-button">
      <figure id="play-icon">
        <?= file_get_contents(filename: 'resources/play_icon.svg') ?>
      </figure>
      <figure id="pause-icon">
        <?= file_get_contents(filename: 'resources/pause_icon.svg') ?>
      </figure>
    </button>
    <button id="center-align-toggle" class="icon-button desktop">
      <figure id="align-center-icon">
        <?= file_get_contents(filename: 'resources/align_center_icon.svg') ?>
      </figure>
      <figure id="cancel-align-center-icon">
        <?= file_get_contents(filename: 'resources/cancel_align_center_icon.svg') ?>
      </figure>
    </button>
    <button id="open-intro" class="icon-button">
      <?= file_get_contents(filename: 'resources/help_icon.svg') ?>
    </button>
  </nav>
  <button id="open-customizer" class="icon-button desktop">
    <?= file_get_contents(filename: 'resources/settings_icon.svg') ?>
  </button>
  <aside id="customizer" class="customization-bar">
    <section class="customizer-container">
      <button id="close-customizer" class="icon-button desktop">
        <?= file_get_contents(filename: 'resources/close_icon.svg') ?>
      </button>
      <button id="toggle-customizer" class="icon-button mobile">
        <figure id="open-mobile-customizer">
          <?= file_get_contents(filename: 'resources/expand_icon.svg') ?>
        </figure>
        <figure id="close-mobile-customizer">
          <?= file_get_contents(filename: 'resources/close_icon.svg') ?>
        </figure>
      </button>

      <header>
        <figure class="logo">
          <img src="resources/planet_gen_icon.svg">
          <span>
            <small>Planetegem</small>
            <br>
            PlanetGen
          </span>
        </figure>
      </header>

      <main>
        <section class="slider-group">
          <header>
            <h2>Terrain modifiers</h2>
            <span class="tooltip desktop">
              <?= file_get_contents(('resources/info_icon.svg')) ?>
              <div class="tooltip-content">
                <p>
                  Modify the level of detail (number of points),
                  terrain variation (maximum change in elevation between points)
                  and elevation limit (maximum elevation a point can reach).
                  Change any of these sliders will result in a complete regeneration of the grid.
                </p>
              </div>
            </span>
          </header>
          <main>
            <div id="grid-size">level of detail</div>
            <div id="terrain-variation">terrain variation</div>
            <div id="elevation-limit">terrain elevation</div>
          </main>
        </section>

        <section class="slider-group">
          <header>
            <h2>Projection modifiers</h2>
            <span class="tooltip desktop">
              <?= file_get_contents(('resources/info_icon.svg')) ?>
              <div class="tooltip-content">
                <p>
                  Modify the way the 3D terrain is projected.
                  Horizontal convergence decides how much wider things become when closer to the viewpoint.
                  Vertical divergence decides how tall things become when closer to the viewpoint.
                </p>
              </div>
            </span>
          </header>
          <main>
            <div id="h-convergence">horizontal convergence</div>
            <div id="v-divergence">vertical divergence</div>
          </main>
        </section>

        <section class="slider-group">
          <header>
            <h2>Horizon modifiers</h2>
            <span class="tooltip desktop">
              <?= file_get_contents(('resources/info_icon.svg')) ?>
              <div class="tooltip-content">
                <p>
                  Modify the shape and location of the horizon:
                  horizon height determines where the horizon is (0 = bottom of the screen),
                  horizon curve determines the rate at which it curves.
                </p>
              </div>
            </span>
          </header>
          <main>
            <div id="horizon-curve">horizon curve</div>
            <div id="horizon-height">horizon height</div>
          </main>
        </section>
      </main>
      <footer>
        <p>
          &#169;
          <?php echo date("Y") ?> Niels Van Damme |
          <a href="https://planetegem.be" target="_self">https://planetegem.be</a>
          <br>
        </p>
      </footer>
    </section>
  </aside>
  <main class="background">
    <canvas id="fake-3D-background"></canvas>
  </main>
  <aside id="tooltips"></aside>
  <script src="js/index.js" type="module"></script>
</body>

</html>