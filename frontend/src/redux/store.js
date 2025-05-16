import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Reducer
const initialState = {
  QuizName: '',
  ClassID: ''
};

const quizReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_QUIZ':
      return {
        ...state,
        QuizName: action.payload.QuizName,
        ClassID: action.payload.ClassID
      };
    default:
      return state;
  }
};

const store = createStore(quizReducer);

export default store;
