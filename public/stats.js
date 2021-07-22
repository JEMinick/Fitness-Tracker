function calculateTotalWeight(data) {
  const totals = [];

  // {
  //   $reduce: {
  //      input: [ 1, 2, 3, 4 ],
  //      initialValue: { sum: 5, product: 2 },
  //      in: {
  //         sum: { $add : ["$$value.sum", "$$this"] },
  //         product: { $multiply: [ "$$value.product", "$$this" ] }
  //      }
  //   }
  // }

  data.forEach((workout) => {
    const workoutTotal = workout.exercises.reduce((total, { type, weight }) => {
      if (type === 'resistance') {
        return total + weight;
      }
      return total;
    }, 0);

    totals.push(workoutTotal);
  });

  return totals;
}

function populateChart(data) {
  // console.log( `populateChart():` );
  // const durations = data;
  // console.log( `DURATIONS: `);
  // console.log( durations );
  // console.log( `POUNDS:` );
  // const pounds = data;
  // console.log( pounds );

  const line = document.querySelector('#canvas').getContext('2d');
  const bar = document.querySelector('#canvas2').getContext('2d');

  // const labels = data.map(({ day }) => {
  //   const date = new Date(day);

  //   // Use JavaScript's `Intl` object to help format dates
  //   return new Intl.DateTimeFormat('en-US', {
  //     weekday: 'short',
  //     month: 'short',
  //     day: 'numeric',
  //   }).format(date);
  // });

  let labels = [];
  for( var i=0; i < data.length; i++ ) {
    labels.push( data[i].workoutDate );
  }
  
  let chartData = [];
  for( var i=0; i < data.length; i++ ) {
    chartData.push( data[i].totalDuration );
  }
  
  let lineChart = new Chart(line, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Workout Duration In Minutes',
          backgroundColor: 'red',
          borderColor: 'red',
          data: chartData,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Time Spent Working Out (Last 7 days)',
      },
      scales: {
        x: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ],
        y: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ]
      }
    }
  });

  chartData = [];
  for( var i=0; i < data.length; i++ ) {
    chartData.push( data[i].totalWeight );
  }

  let barChart = new Chart(bar, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Pounds',
          data: chartData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Pounds Lifted (Last 7 days)',
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

// get all workout data from back-end
API.getWorkoutsInRange()
  .then(populateChart);
