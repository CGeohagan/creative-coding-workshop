const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  suffix: random.getSeed(),
  dimensions: [ 4096, 2048 ]
};

//Way to determine which random value you like the most
random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const sketch = () => {
  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.15;
        points.push({
          color: random.pick(palette),
          position: [ u, v ],
          radius,
          rotation: random.noise2D(u, v)
        });
      }
    } 
    return points;
  };

  // Setting deterministic value seed
  // random.setSeed(10);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        color, 
        position,
        radius,
        rotation
      } = data;

      const [ u, v ] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Arial"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('=', 0, 0);
      context.restore();
    });
  };
};

// // trapezoids
// const sketch = () => {
//   const palette = random.shuffle(random.pick(palettes));

//   const createGrid = () => {
//     const points = [];
//     const count = 6;
//     for (let x = 0; x < count; x++) {
//       for (let y = 0; y < count; y++) {
//         const u = count <= 1 ? 0.5 : x / (count - 1);
//         const v = count <= 1 ? 0.5 : y / (count - 1);
        
//         points.push({
//           color: random.pick(palette),
//           position: [ u, v ]
//         });
//       }
//     } 
//     return points;
//   };

//   // Setting deterministic value seed
//   // random.setSeed(10);
//   const points = createGrid();
//   const margin = 400;

//   // pick two random arrays in array
//   // remove from array

//   return ({ context, width, height }) => {
//     context.fillStyle = 'white';
//     context.fillRect(0, 0, width, height);
//     const length = points.length / 2;

//     // for (let i = 0; i < points.length; i++) {
//     //   const point1 = points[i].position;
//     //   points.splice(i, 1);
//     //   const point2 = random.pick(points).position;
//     //   points.splice( points.indexOf(point1), 1);
//     // }

//     points.forEach((data, i) => {
//       const {
//         color, 
//         position
//       } = data;

//       points.splice(i, 1);
//       const position2 = random.pick(points).position

//       const [ u1, v1 ] = position;
//       const [ u2, v2 ] = position2;
      
//       context.beginPath();
//       context.moveTo(u1 * width, v1 * height);
//       context.lineTo(u2 * width, v2 * height);
//       context.lineTo(u2 * width, height);
//       context.lineTo(u1 * width, height);
//       context.lineTo(u1 * width, v1 * height);
//       context.fillStyle = color;
//       context.fill();
//       context.globalAlpha = .95;
//       context.lineWidth = 30;
//       context.strokeStyle = 'white';
//       context.stroke();
//     });
//   };
// };

canvasSketch(sketch, settings);
