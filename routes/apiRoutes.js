const router = require("express").Router();
const db = require("../models");

// GET : fetch("/api/workouts")
router.get('/api/workouts', (req, res) => {
  db.Workout.find({})
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

// PUT : fetch("/api/workouts/:id")
router.put('/api/workouts/:id', ({ body, params }, res) => {
  // console.log(body)
  db.Workout.findByIdAndUpdate(params.id,
    { $push: { exercises: body } }, { new: true })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// POST : fetch("/api/workouts")
router.post('/api/workouts', ({ body }, res) => {
  db.Workout.create(body)
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

// app.get("/weight", (req, res) => {
//   db.animals.find().sort({ weight: -1 }, (err, found) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(found);
//     }
//   });
// });

// GET : fetch(`/api/workouts/range`)
router.get('/api/workouts/range', (req, res) => {
  let msDays = (7*24*60*60*1000)
  let month = new Date(new Date()-msDays).getMonth()+1;
  let dayofmonth = new Date(new Date()-msDays).getDate();
  let year = new Date(new Date()-msDays).getFullYear();
  let sWorkoutDate = `${month}/${dayofmonth}/${year}`;

  // console.log( `Search for gte: [${sWorkoutDate}]` );

  db.Workout.find( {day: { $gte: `${sWorkoutDate}` }} )

  //get rid of sort and add 
  // .sort({day: -1})
  // .limit(7)

  .then(dbWorkout => {

    // var mapFunction1 = function() {
    //   emit(day, weight);
    // };
    // // console.log( mapFunction1.toString() );
    // var reduceFunction1 = function(day, weight) {
    //   return Array.sum(weight);
    // };
    // const weightSum = db.Workout.mapReduce(
    //   mapFunction1,
    //   reduceFunction1,
    //   { out: "weight_summary" }
    // )

    let sLastDate='';
    let iDuration = 0;
    let iWeight = 0;
    let dbWorkout2=[];

    // console.log( `Length of range query: [${dbWorkout.length}]` );

    let iWorkoutIdx=0;
    if ( dbWorkout.length > 7 )
      iWorkoutIdx = dbWorkout.length-7;
    
    for( iWorkoutIdx; iWorkoutIdx < dbWorkout.length; iWorkoutIdx++ )
    {
      month = new Date(dbWorkout[iWorkoutIdx].day).getMonth()+1;
      dayofmonth = new Date(dbWorkout[iWorkoutIdx].day).getDate();
      year = new Date(dbWorkout[iWorkoutIdx].day).getFullYear();
      sWorkoutDate = `${month}/${dayofmonth}/${year}`;

      // console.log( `[${iWorkoutIdx}]: [${sWorkoutDate}]` );

      if ( sLastDate.length === 0 ) {
        sLastDate = sWorkoutDate;
      } else {
        if ( sLastDate != sWorkoutDate ) {
          dbWorkout2.push( {
            workoutDate: sLastDate,
            totalDuration: iDuration,
            totalWeight: iWeight
          })
          sLastDate = sWorkoutDate;
          iDuration = 0;
          iWeight = 0;
        }
      }

      if ( dbWorkout[iWorkoutIdx].exercises ) {
        for( var j=0; j < dbWorkout[iWorkoutIdx].exercises.length; j++ )
        {
          if ( dbWorkout[iWorkoutIdx].exercises[j] ) {
            if ( dbWorkout[iWorkoutIdx].exercises[j].duration ) {
              // console.log( `     [${j}]: Duration: [${dbWorkout[iWorkoutIdx].exercises[j].duration}]` );
              iDuration += dbWorkout[iWorkoutIdx].exercises[j].duration;
            }
            if ( dbWorkout[iWorkoutIdx].exercises[j].weight ) {
              // console.log( `     [${j}]: Weight:   [${dbWorkout[iWorkoutIdx].exercises[j].weight}]` )
              iWeight += dbWorkout[iWorkoutIdx].exercises[j].weight;
            }
          }
        } // endFor
      }

      if ( iWorkoutIdx === dbWorkout.length-1 ) {
        dbWorkout2.push( {
          workoutDate: sLastDate,
          totalDuration: iDuration,
          totalWeight: iWeight
        })
      }

    } // endFor

    // console.log( `\nRANGE SUMMARY:` );
    // console.log( dbWorkout2 );
    
    res.json(dbWorkout2);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

module.exports = router;
