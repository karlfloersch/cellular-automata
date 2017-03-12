const width = window.innerWidth;
const height = window.innerHeight;


const law = [
  { result: 0, definition: [1,1,1] },
  { result: 0, definition: [1,1,0] },
  { result: 0, definition: [1,0,1] },
  { result: 1, definition: [1,0,0] },
  { result: 1, definition: [0,1,1] },
  { result: 1, definition: [0,1,0] },
  { result: 1, definition: [0,0,1] },
  { result: 0, definition: [0,0,0] }
];
const rowSize = 50;
let state = [new Array(rowSize+1).join('0').split('').map(parseFloat)];
state[0][state[0].length/2] = 1; // Start with 1 in the middle

function generateNextBlock(blocks, law) {
  for(let i = 0; i < law.length; i++) {
    if (blocks[0] === law[i].definition[0] &&
        blocks[1] === law[i].definition[1] &&
        blocks[2] === law[i].definition[2]){
      return law[i].result;
    }
  }
}

function generateNextRow(lastRow) {
  let nextRow = [0];
  for(let i = 1; i < lastRow.length-1; i++) {
    nextRow.push(generateNextBlock([lastRow[i-1], lastRow[i], lastRow[i+1]], law));
  }
  nextRow.push(0);
  return nextRow;
}

for (let i = 0; i < 100; i++) {
  state.push(generateNextRow(state[i]));
}

var svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height)
            .call(d3.drag())
              .on("start", () => {
                console.log('drag start');
              })
              .on("drag", () => {
                console.log('drag drag');
              })
              .on("end", () => {
                console.log('drag end');
              });

var zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[-100, -100], [width + 90, height + 100]])
    .on("zoom", zoomed);

var view = svg.append("rect")
    .attr("class", "view")
    .attr("x", 0.5)
    .attr("y", 0.5)
    .attr("width", width - 1)
    .attr("height", height - 1);

state.map(function (rowData, rowNumber) {
  let row = svg.append('g');
  const boxColor = ['#fff', '#000'];

  row.selectAll("rect")
      .data(rowData)
      .enter()
      .append("rect")
        .attr("x", (d, columnNumber) => width*(columnNumber/rowSize))
        .attr("y", () => {
          return rowNumber*(width)/rowSize;
        })
        .attr("width", (width)/rowSize)
        .attr("height", (width)/rowSize)
        .attr("fill", function(v) { return boxColor[v]; });

});


// var gX = svg.append("g")
//     .attr("class", "axis axis--x")
//     .call(xAxis);

// var gY = svg.append("g")
//     .attr("class", "axis axis--y")
//     .call(yAxis);

// d3.select("button")
//     .on("click", resetted);

svg.call(zoom);

function zoomed() {
  view.attr("transform", d3.event.transform);
  // gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
  // gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
}
