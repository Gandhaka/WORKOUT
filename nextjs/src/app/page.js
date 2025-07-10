"use client"

import { useContext,useState,useEffect } from "react"
import AuthContext from "./context/AuthContext.js"
import ProtectedRoute from "./components/ProtectedRouter.js"
import axios from "axios"


const Home = ()=>{  
  
  const {user,authToken,logout} = useContext(AuthContext);
  //const {user,logout} = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([])
  const [routines, setRoutines] = useState([])
  const [workoutName, setWorkoutName] = useState('')
  const [workoutDescription, setWorkoutDescription] = useState('')
  const [routineName, setRoutineName] = useState('')
  const [routineDescription, setRoutineDescription] = useState('')
  const [SelectedWorkouts, setSelectedWorkouts] = useState([])
  const [loadingContent, setLoadingContent] = useState(false)
  const [successMessage, SetSuccess] = useState(null)
  const [error, setError] = useState(null);

  
  
  const clearMessageAfterDelay =()=>{
    setTimeout(() => {authToken
      SetSuccess(null);
      setError(null);
    }, 4000); // Clear message after 3 seconds

  }

  useEffect(()=>{
    const fetchWorkoutsAndRoutines = async ()=>{
      
      if (user && authToken)  
      { setLoadingContent(true)
        setError(null)
        
      try {
        //const token = localStorage.getItem('token');
        const [workoutsResponse, routineResponse] = await Promise.all([
          axios.get('http://localhost:8000/workouts',{
            headers: { Authorization: `Bearer ${authToken}` } // Use backticks here
          }),
          axios.get('http://localhost:8000/routines',{
            headers: { Authorization: `Bearer ${authToken}` } // Use backticks here
          })
        ]);

        setWorkouts(workoutsResponse.data);
        setRoutines(routineResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError("Failed to load Content, Please try again or log in")
      }finally{
        setLoadingContent(false)
      }
    }
    else{
      setWorkouts([])
      setRoutines([])
      setLoadingContent(false)
    } 
  }

    fetchWorkoutsAndRoutines();
},[user,authToken]);

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/workouts', {
          name: workoutName,
          description: workoutDescription,
      },{
          headers: { Authorization: `Bearer ${authToken}` } // Use backticks here
      });

      setWorkouts([...workouts, response.data]);
      setWorkoutName('');
      setWorkoutDescription('');
      setError(null);
      SetSuccess("Workout created successfully!");
      clearMessageAfterDelay();
    } 
    catch (error) {
      console.error('Failed to create workout:', error);
      setError("Failed to create workout, Please try again");
    }
  };

  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/routines', {
        name: routineName,
        description: routineDescription,
        workouts: SelectedWorkouts,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setRoutines([...routines, response.data]);
      setRoutineName('');
      setRoutineDescription('');
      setSelectedWorkouts([]);
      setError(null);
      SetSuccess("Routine created successfully!");
      clearMessageAfterDelay();
     

    } catch (error) {
      console.error('Failed to create routine:', error);
      setError("Failed to create routine, Please try again");
    }
  };

  return (
    

    <ProtectedRoute>

      <div className="container">

        <h1>Welcome!</h1>
        
        
      <main className="container mx-auto p-4">
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        
        <button onClick={logout} className="btn btn-danger">Logout</button>
        <div className="accordion mt-5 mb-5" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Create Workout
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateWorkout}>
                  <div className="mb-3">
                    <label htmlFor="workoutName" className="form-label">Workout Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutName"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutDescription" className="form-label">Workout Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutDescription"
                      value={workoutDescription}
                      onChange={(e) => setWorkoutDescription(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Create Workout</button>
                </form>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Create Routine
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateRoutine}>
                  <div className="mb-3">
                    <label htmlFor="routineName" className="form-label">Routine Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineName"
                      value={routineName}
                      onChange={(e) => setRoutineName(e.target.value)}
                      required
                    />
                  </div>  
                  <div className="mb-3">
                    <label htmlFor="routineDescription" className="form-label">Routine Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineDescription"
                      value={routineDescription}
                      onChange={(e) => setRoutineDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutSelect" className="form-label">Select Workouts</label>
                    <select
                      multiple
                      className="form-control"
                      id="workoutSelect"
                      value={SelectedWorkouts}
                      onChange={(e) => setSelectedWorkouts([...e.target.selectedOptions].map(option => option.value))}
                    >
                      {workouts.map(workout => (
                        <option key={workout.id} value={workout.id}>
                          {workout.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Create Routine</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3>Your routines:</h3>
          
          <ul>
          {routines.map(routine => (
              <div className="card" key={routine.id}>
                <div className="card-body">
                <h5 className="card-title">{routine.name}</h5>
                <p className="card-text">{routine.description}</p>
                <ul className="card-text"> 
                  {routine.workouts && routine.workouts.map(workout => (
                    <li key={workout.id}>
                      {workout.name}: {workout.description}
                    </li>
                  ))}
                </ul>
                
                </div>
              </div>
            ))}

          </ul>
        </div>
        </main>
      </div>
      
    </ProtectedRoute>
  
  );
};

export default Home;