This is a fake 3D terrain generator, originally built for the background of [planetegem.be](https://planetegem.be), but then I decided to expand it with a custom UI and a few sliders to quickly adjust parameters. Just because this made it easier to find the sweetspot in certain variables, and also because I really like randomly generating stuff.

## How it works
- The Grid class creates a 2D array of points, each point having an x, y and z coordinate.
- The Projection class extends the Grid class, and provides a 3D projection of the grid. It's a fake projection: I'm not multiplying any matrices like in real 3D rendering. I'm just manually (and dirtily) manipulating x and y values to create the illusion of a 3D projection.
- The z-coordinate of a Point determines its height (to create structure / terrain in the grid)
- The Background class extends the Projection class, and provides the logic to draw the projection in a canvas. Calling the constructor of the Background class (takes a canvas id as parameter) is how you get started.
- There are several hooks to modify parameters: take a look at the Controller class to see how to use them.
- Use the offset property to animate the background: this one loops between 0 and 1 and determines when new rows need to be added to the grid.