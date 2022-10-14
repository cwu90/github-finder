import { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  //status of initial state..no users. no loading
  const initialState = {
    users: [], // all users in array
    user: {}, // a single user which is why we use an object bracket
    repos: [],
    loading: false,
  };

  //bringing in the reducer and using it
  const [state, dispatch] = useReducer(githubReducer, initialState);

  //Set Loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' });
  //Clear users from state
  const clearUsers = () => dispatch({ type: 'CLEAR_USERS' });

  //Get SEARCH results
  const searchUsers = async text => {
    setLoading();

    //Setting up a new var to be attached to the "text" in the search bar
    const params = new URLSearchParams({ q: text });

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    //destructed existing 'item' property in the data
    const { items } = await response.json();

    dispatch({
      type: 'GET_USERS',
      payload: items,
    });
  };

  //Get SINGLE user
  const getUser = async login => {
    setLoading();

    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    if (response.status === 404) {
      window.location = '/notfound';
    } else {
      const data = await response.json();

      dispatch({
        type: 'GET_USER',
        payload: data,
      });
    }
  };

  //Get user REPOS
  const getUserRepos = async login => {
    setLoading();

    const response = await fetch(`${GITHUB_URL}/users/${login}/repos`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    //destructed existing 'item' property in the data
    const { data } = await response.json();

    dispatch({
      type: 'GET_REPOS',
      payload: data,
    });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
