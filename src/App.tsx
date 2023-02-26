import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
    const [searchQuery, setSearchQuery] = useState({
        first: '',
        second: '',
        third: ''
    });
    const [foods, setFoods] = useState([]);
    const [localFoods, setLocalFoods] = useState([]);
    const url = `${process.env['REACT_APP_BASE_URL']}`;
    const id = `${process.env["REACT_APP_APP_ID"]}`;
    const key = `${process.env["REACT_APP_APP_KEY"]}`;

    const data = {
        line_delimited: false,
        query: `${searchQuery.first} ${searchQuery.second ? `and ${searchQuery.second}`: ''} ${searchQuery.third ? `and ${searchQuery.third}`: ''}`,
        timezone: "Africa/Lagos",
        use_branded_foods: false,
        use_raw_foods: false
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const fetchData = async () => {

            return await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "x-app-id": id,
                    "x-app-key": key,
                },
            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            }).then(function (data) {
                setFoods(data.foods);
            }).catch(function (error) {
                console.warn('Something went wrong.', error);
            });
        }

        return fetchData();
    }

    useEffect(() => {
        const localFood = localStorage.getItem('myFoods')
        if(localFood !== null){
            const foods =  JSON.parse(localFood);
            setLocalFoods(foods)
        }

    }, []);

     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { value, name } = event.target;
        setSearchQuery(prev => ({
            ...prev,
            [name]: value
        }))
  }

    const handlePin = (food: Record<string, any>) => {
        const savedFoods: any = localStorage.getItem('myFoods');
        const existingFood = JSON.parse(savedFoods) || [];
        existingFood.push(food);

        localStorage.setItem('myFoods', JSON.stringify(existingFood));
    }


  return (
    <div className="App">
      <div className="App-header">
      <div className='section'>
         <div>
             <form onSubmit={(e)=>handleSubmit(e)} className='wrapper'>
                 <input
                     placeholder='Enter food'
                     onChange={e => handleInputChange(e)}
                     name='first'
                     value={searchQuery.first} />
                 <input
                     placeholder='Enter food'
                     onChange={e => handleInputChange(e)}
                     name='second'
                     value={searchQuery.second} />
                 <input
                     placeholder='Enter food'
                     onChange={e => handleInputChange(e)}
                     name='third'
                     value={searchQuery.third} />

                 <button type='submit'>
                     Send
                 </button>
             </form>
         </div>
          <div>
              <h2>Pinned Meals</h2>
              <table>
                 <thead>
                 <tr>
                     <th>Qty</th>
                     <th>Unit</th>
                     <th>Food</th>
                     <th>Calories</th>
                     <th>Weight</th>
                     <th></th>
                 </tr>
                 </thead>
                  {localFoods.map((local: Record<string, any>, index) => {
                      return(
                   <tbody>
                   <tr key={index}>
                       <td>{local.serving_qty}</td>
                       <td>{local.serving_unit}</td>
                       <td>{local.food_name}</td>
                       <td>{local.nf_calories}</td>
                       <td>{local.serving_weight_grams}</td>
                   </tr>
                   </tbody>
                      );
                  })}
              </table>
          </div>
      </div>
         <h2>NUTRIENT BREAKDOWN</h2>
             <table>
                <thead>
                <tr>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Food</th>
                    <th>Calories</th>
                    <th>Weight</th>
                    <th>Food Group</th>
                    <th></th>
                </tr>
                </thead>
                 {foods.map((food: Record<string, any>, index) => {
                     return(
                        <tbody>
                        <tr key={index}>
                            <td>{food.serving_qty}</td>
                            <td>{food.serving_unit}</td>
                            <td>{food.food_name}</td>
                            <td>{food.nf_calories}</td>
                            <td>{food.serving_weight_grams}</td>
                            <td>{food.tags.food_group}</td>
                            <td>
                                <div className='pin' onClick={_ => handlePin(food)}>pin</div>
                            </td>
                        </tr>
                        </tbody>
                     );
                 })}
             </table>
      </div>
    </div>
  );
}

export default App;
